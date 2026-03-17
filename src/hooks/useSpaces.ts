import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import type { Space } from "@/lib/types";

export function useSpaces() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: spaces = [], isLoading } = useQuery({
    queryKey: ["spaces", user?.id],
    queryFn: async (): Promise<Space[]> => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("space_members")
        .select("space_id, spaces(id, name, created_by, created_at, cover_image_id)")
        .eq("user_id", user.id);
      if (error) throw error;
      const rows = (data ?? []) as { spaces: { id: string; name: string; created_by: string; created_at: string; cover_image_id?: string } | null }[];
      return rows
        .map((row) => row.spaces)
        .filter(Boolean)
        .map((s) => ({
          id: s!.id,
          name: s!.name,
          createdBy: s!.created_by,
          createdAt: s!.created_at,
          coverImageId: s!.cover_image_id,
        }));
    },
    enabled: !!user?.id,
  });

  const createSpace = useMutation({
    mutationFn: async (name: string): Promise<Space> => {
      if (!user?.id) throw new Error("Not signed in");

      // Insert the space. The DB trigger adds the creator to space_members,
      // but the RETURNING data may be filtered by the SELECT RLS policy before
      // the trigger-inserted row is visible.  So we try .select() first and
      // fall back to a separate query through space_members.
      const { data, error } = await supabase
        .from("spaces")
        .insert({ name, created_by: user.id })
        .select("id, name, created_by, created_at")
        .single();

      if (!error && data) {
        const row = data as { id: string; name: string; created_by: string; created_at: string };
        return { id: row.id, name: row.name, createdBy: row.created_by, createdAt: row.created_at };
      }

      // Fallback: the insert likely succeeded but the select was blocked by
      // RLS timing.  Query through space_members where the trigger has now
      // committed the membership row.
      const { data: rows, error: queryError } = await supabase
        .from("space_members")
        .select("spaces(id, name, created_by, created_at)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (queryError) throw queryError;

      const match = (rows ?? [])
        .map((r) => (r as { spaces: { id: string; name: string; created_by: string; created_at: string } | null }).spaces)
        .filter(Boolean)
        .find((s) => s!.name === name && s!.created_by === user.id);

      if (!match) throw error ?? new Error("Space was created but could not be retrieved");

      return { id: match.id, name: match.name, createdBy: match.created_by, createdAt: match.created_at };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spaces", user?.id] });
    },
  });

  return { spaces, isLoading, createSpace };
}
