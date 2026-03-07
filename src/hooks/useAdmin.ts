import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAllPlayers = () => {
  return useQuery({
    queryKey: ["admin_players"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("players")
        .select("*, teams(name, abbreviation)")
        .order("name");
      if (error) throw error;
      return data;
    },
  });
};

export const useAllTeams = () => {
  return useQuery({
    queryKey: ["admin_teams"],
    queryFn: async () => {
      const { data, error } = await supabase.from("teams").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });
};

export const useAllAnnouncements = () => {
  return useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const useAllLeagueSettings = () => {
  return useQuery({
    queryKey: ["league_settings_all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("league_settings")
        .select("*")
        .order("category");
      if (error) throw error;
      return data;
    },
  });
};

export const useCreatePlayer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (player: {
      name: string;
      position: string;
      archetype: string;
      team_id?: string | null;
      overall: number;
      uc_balance: number;
      user_id?: string | null;
    }) => {
      const { data, error } = await supabase.from("players").insert(player).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin_players"] }),
  });
};

export const useUpdatePlayer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      const { error } = await supabase.from("players").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin_players"] });
      qc.invalidateQueries({ queryKey: ["player"] });
    },
  });
};

export const useCreateTeam = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (team: { name: string; abbreviation?: string; primary_color?: string; secondary_color?: string }) => {
      const { data, error } = await supabase.from("teams").insert(team).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin_teams"] }),
  });
};

export const useUpdateTeam = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      const { error } = await supabase.from("teams").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin_teams"] }),
  });
};

export const useUpdateLeagueSetting = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, value }: { id: string; value: any }) => {
      const { error } = await supabase.from("league_settings").update({ value }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["league_settings"] });
      qc.invalidateQueries({ queryKey: ["league_settings_all"] });
    },
  });
};

export const useCreateAnnouncement = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ann: { title: string; body: string; author_id?: string }) => {
      const { error } = await supabase.from("announcements").insert(ann);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["announcements"] }),
  });
};

export const useAdminAdjustUC = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      playerId,
      currentBalance,
      amount,
      reason,
      performedBy,
    }: {
      playerId: string;
      currentBalance: number;
      amount: number;
      reason: string;
      performedBy?: string;
    }) => {
      const { error: ucErr } = await supabase
        .from("players")
        .update({ uc_balance: currentBalance + amount })
        .eq("id", playerId);
      if (ucErr) throw ucErr;

      const { error: txErr } = await supabase.from("transactions").insert({
        player_id: playerId,
        type: "admin_adjustment",
        amount,
        description: reason || "Admin Adjustment",
        performed_by: performedBy,
      });
      if (txErr) throw txErr;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin_players"] });
      qc.invalidateQueries({ queryKey: ["player"] });
      qc.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};
