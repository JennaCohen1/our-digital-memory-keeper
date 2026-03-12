import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import type { Album, Story, Photo } from "@/lib/types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "";

function assetPublicUrl(storagePath: string): string {
  return `${supabaseUrl}/storage/v1/object/public/assets/${storagePath}`;
}

function mapAlbumRow(row: {
  id: string;
  title: string;
  event_date: string;
  created_at: string;
  created_by: string;
  space_id: string;
  description?: string;
  album_photos?: {
    caption: string | null;
    sort_order: number;
    assets: {
      id: string;
      storage_path: string;
      event_date?: string;
    } | null;
  }[];
}): Album {
  const photos: Photo[] = (row.album_photos ?? [])
    .filter((ap) => ap.assets)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((ap) => ({
      id: ap.assets!.id,
      imageData: assetPublicUrl(ap.assets!.storage_path),
      caption: ap.caption ?? undefined,
    }));
  return {
    id: row.id,
    title: row.title,
    date: row.event_date,
    createdAt: row.created_at,
    spaceId: row.space_id,
    createdBy: row.created_by,
    photos,
  };
}

function mapStoryRow(row: {
  id: string;
  title: string;
  content: string;
  event_date: string;
  created_at: string;
  created_by: string;
  space_id: string;
}): Story {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    date: row.event_date,
    createdAt: row.created_at,
    spaceId: row.space_id,
    createdBy: row.created_by,
  };
}

export function useAlbums(spaceId: string | null) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: albums = [], isLoading } = useQuery({
    queryKey: ["albums", spaceId],
    queryFn: async (): Promise<Album[]> => {
      if (!spaceId) return [];
      const { data, error } = await supabase
        .from("albums")
        .select("id, title, event_date, created_at, created_by, space_id, description, album_photos(sort_order, caption, assets(id, storage_path, event_date))")
        .eq("space_id", spaceId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapAlbumRow);
    },
    enabled: !!spaceId,
  });

  const addAlbum = useMutation({
    mutationFn: async (input: {
      title: string;
      date: string;
      photos: { imageData: string; caption?: string }[];
    }) => {
      if (!user?.id || !spaceId) throw new Error("Not signed in or no space");
      const eventDate = input.date || new Date().toISOString().slice(0, 10);
      const assetIds: string[] = [];
      for (let i = 0; i < input.photos.length; i++) {
        const p = input.photos[i];
        const base64 = p.imageData.replace(/^data:image\/\w+;base64,/, "");
        const buf = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
        const ext = p.imageData.startsWith("data:image/png") ? "png" : "jpg";
        const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("assets")
          .upload(path, buf, { contentType: ext === "png" ? "image/png" : "image/jpeg", upsert: false });
        if (uploadError) throw uploadError;
        const { data: asset, error: assetError } = await supabase
          .from("assets")
          .insert({
            owner_user_id: user.id,
            storage_path: path,
            mime_type: ext === "png" ? "image/png" : "image/jpeg",
            event_date: eventDate,
            source: "upload",
          })
          .select("id")
          .single();
        if (assetError) throw assetError;
        assetIds.push(asset.id);
      }
      const { data: album, error: albumError } = await supabase
        .from("albums")
        .insert({
          space_id: spaceId,
          title: input.title,
          event_date: eventDate,
          created_by: user.id,
        })
        .select("id, title, event_date, created_at, created_by, space_id")
        .single();
      if (albumError) throw albumError;
      for (let i = 0; i < assetIds.length; i++) {
        await supabase.from("album_photos").insert({
          album_id: album.id,
          asset_id: assetIds[i],
          caption: input.photos[i]?.caption ?? null,
          sort_order: i,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["albums", spaceId] });
    },
  });

  const deleteAlbum = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("albums").delete().eq("id", id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["albums", spaceId] });
    },
  });

  return {
    albums,
    isLoading,
    addAlbum: addAlbum.mutateAsync,
    deleteAlbum: deleteAlbum.mutateAsync,
  };
}

export function useStories(spaceId: string | null) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: stories = [], isLoading } = useQuery({
    queryKey: ["stories", spaceId],
    queryFn: async (): Promise<Story[]> => {
      if (!spaceId) return [];
      const { data, error } = await supabase
        .from("stories")
        .select("id, title, content, event_date, created_at, created_by, space_id")
        .eq("space_id", spaceId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapStoryRow);
    },
    enabled: !!spaceId,
  });

  const addStory = useMutation({
    mutationFn: async (input: { title: string; content: string; date: string }) => {
      if (!user?.id || !spaceId) throw new Error("Not signed in or no space");
      const eventDate = input.date || new Date().toISOString().slice(0, 10);
      const { data, error } = await supabase
        .from("stories")
        .insert({
          space_id: spaceId,
          title: input.title,
          content: input.content,
          event_date: eventDate,
          created_by: user.id,
        })
        .select("id, title, content, event_date, created_at, created_by, space_id")
        .single();
      if (error) throw error;
      return mapStoryRow(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories", spaceId] });
    },
  });

  const deleteStory = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("stories").delete().eq("id", id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories", spaceId] });
    },
  });

  return {
    stories,
    isLoading,
    addStory: addStory.mutateAsync,
    deleteStory: deleteStory.mutateAsync,
  };
}

export function useMyMemories() {
  const { user } = useAuth();

  const { data: albums = [], isLoading: albumsLoading } = useQuery({
    queryKey: ["my-albums", user?.id],
    queryFn: async (): Promise<Album[]> => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("albums")
        .select("id, title, event_date, created_at, created_by, space_id, description, album_photos(sort_order, caption, assets(id, storage_path, event_date))")
        .eq("created_by", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapAlbumRow);
    },
    enabled: !!user?.id,
  });

  const { data: stories = [], isLoading: storiesLoading } = useQuery({
    queryKey: ["my-stories", user?.id],
    queryFn: async (): Promise<Story[]> => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("stories")
        .select("id, title, content, event_date, created_at, created_by, space_id")
        .eq("created_by", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapStoryRow);
    },
    enabled: !!user?.id,
  });

  const spaceIds = [...new Set([...albums.map((a) => a.spaceId), ...stories.map((s) => s.spaceId)])].filter(Boolean) as string[];
  const { data: spaceNames = {} } = useQuery({
    queryKey: ["space-names", spaceIds],
    queryFn: async (): Promise<Record<string, string>> => {
      if (spaceIds.length === 0) return {};
      const { data, error } = await supabase.from("spaces").select("id, name").in("id", spaceIds);
      if (error) throw error;
      return (data ?? []).reduce((acc, row) => {
        acc[row.id] = row.name;
        return acc;
      }, {} as Record<string, string>);
    },
    enabled: spaceIds.length > 0,
  });

  const queryClient = useQueryClient();
  const deleteAlbum = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("albums").delete().eq("id", id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-albums", user?.id] });
    },
  });
  const deleteStory = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("stories").delete().eq("id", id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-stories", user?.id] });
    },
  });

  return {
    albums,
    stories,
    spaceNames,
    isLoading: albumsLoading || storiesLoading,
    deleteAlbum: deleteAlbum.mutateAsync,
    deleteStory: deleteStory.mutateAsync,
  };
}
