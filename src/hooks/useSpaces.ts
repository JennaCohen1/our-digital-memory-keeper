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
      const { data, error } = await supabase
        .from("spaces")
        .insert({ name, created_by: user.id })
        .select("id, name, created_by, created_at")
        .single();
      if (error) throw error;
      const row = data as { id: string; name: string; created_by: string; created_at: string };
      return {
        id: row.id,
        name: row.name,
        createdBy: row.created_by,
        createdAt: row.created_at,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spaces", user?.id] });
    },
  });

  return { spaces, isLoading, createSpace };
}
