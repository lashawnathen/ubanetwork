import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const usePlayer = () => {
  const { playerId } = useAuth();

  return useQuery({
    queryKey: ["player", playerId],
    queryFn: async () => {
      if (!playerId) return null;
      const { data, error } = await supabase
        .from("players")
        .select("*, teams(name, abbreviation, logo_url, primary_color)")
        .eq("id", playerId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!playerId,
  });
};

export const usePlayerAttributes = (playerId: string | null) => {
  return useQuery({
    queryKey: ["player_attributes", playerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("player_attributes")
        .select("*")
        .eq("player_id", playerId!);
      if (error) throw error;
      return data;
    },
    enabled: !!playerId,
  });
};

export const usePlayerBadges = (playerId: string | null) => {
  return useQuery({
    queryKey: ["player_badges", playerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("player_badges")
        .select("*")
        .eq("player_id", playerId!);
      if (error) throw error;
      return data;
    },
    enabled: !!playerId,
  });
};

export const usePlayerTendencies = (playerId: string | null) => {
  return useQuery({
    queryKey: ["player_tendencies", playerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("player_tendencies")
        .select("*")
        .eq("player_id", playerId!);
      if (error) throw error;
      return data;
    },
    enabled: !!playerId,
  });
};

export const usePlayerHotzones = (playerId: string | null) => {
  return useQuery({
    queryKey: ["player_hotzones", playerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("player_hotzones")
        .select("*")
        .eq("player_id", playerId!);
      if (error) throw error;
      return data;
    },
    enabled: !!playerId,
  });
};

export const usePlayerSignatures = (playerId: string | null) => {
  return useQuery({
    queryKey: ["player_signatures", playerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("player_signatures")
        .select("*")
        .eq("player_id", playerId!);
      if (error) throw error;
      return data;
    },
    enabled: !!playerId,
  });
};

export const usePlayerAccessories = (playerId: string | null) => {
  return useQuery({
    queryKey: ["player_accessories", playerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("player_accessories")
        .select("*")
        .eq("player_id", playerId!);
      if (error) throw error;
      return data;
    },
    enabled: !!playerId,
  });
};

export const usePlayerGear = (playerId: string | null) => {
  return useQuery({
    queryKey: ["player_gear", playerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("player_gear")
        .select("*")
        .eq("player_id", playerId!);
      if (error) throw error;
      return data;
    },
    enabled: !!playerId,
  });
};

export const usePlayerGameplan = (playerId: string | null) => {
  return useQuery({
    queryKey: ["player_gameplans", playerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("player_gameplans")
        .select("*")
        .eq("player_id", playerId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!playerId,
  });
};

export const usePlayerTransactions = (playerId: string | null) => {
  return useQuery({
    queryKey: ["transactions", playerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("player_id", playerId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!playerId,
  });
};

export const useLeagueSettings = () => {
  return useQuery({
    queryKey: ["league_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("league_settings")
        .select("*");
      if (error) throw error;
      // Convert to key-value map
      const map: Record<string, number> = {};
      data?.forEach((s) => {
        map[s.key] = typeof s.value === "number" ? s.value : Number(s.value);
      });
      return map;
    },
  });
};

export const useUpgradeAttribute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      playerId,
      attributeId,
      attributeName,
      currentValue,
      cost,
      currentBalance,
    }: {
      playerId: string;
      attributeId: string;
      attributeName: string;
      currentValue: number;
      cost: number;
      currentBalance: number;
    }) => {
      if (currentBalance < cost) throw new Error("Not enough UC");

      // Update attribute
      const { error: attrErr } = await supabase
        .from("player_attributes")
        .update({ value: currentValue + 1 })
        .eq("id", attributeId);
      if (attrErr) throw attrErr;

      // Deduct UC
      const { error: ucErr } = await supabase
        .from("players")
        .update({ uc_balance: currentBalance - cost })
        .eq("id", playerId);
      if (ucErr) throw ucErr;

      // Log transaction
      const { error: txErr } = await supabase.from("transactions").insert({
        player_id: playerId,
        type: "attribute_upgrade",
        amount: -cost,
        description: `Attribute Upgrade: ${attributeName} ${currentValue}→${currentValue + 1}`,
      });
      if (txErr) throw txErr;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["player"] });
      queryClient.invalidateQueries({ queryKey: ["player_attributes"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};

export const useUpgradeBadge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      playerId,
      badgeId,
      badgeName,
      currentLevel,
      nextLevel,
      cost,
      currentBalance,
    }: {
      playerId: string;
      badgeId: string;
      badgeName: string;
      currentLevel: string;
      nextLevel: string;
      cost: number;
      currentBalance: number;
    }) => {
      if (currentBalance < cost) throw new Error("Not enough UC");

      const { error: badgeErr } = await supabase
        .from("player_badges")
        .update({ level: nextLevel })
        .eq("id", badgeId);
      if (badgeErr) throw badgeErr;

      const { error: ucErr } = await supabase
        .from("players")
        .update({ uc_balance: currentBalance - cost })
        .eq("id", playerId);
      if (ucErr) throw ucErr;

      const { error: txErr } = await supabase.from("transactions").insert({
        player_id: playerId,
        type: "badge_upgrade",
        amount: -cost,
        description: `Badge Upgrade: ${badgeName} ${currentLevel}→${nextLevel}`,
      });
      if (txErr) throw txErr;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["player"] });
      queryClient.invalidateQueries({ queryKey: ["player_badges"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};

export const useClaimDailyReward = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      playerId,
      currentBalance,
      currentStreak,
      lastClaim,
      settings,
    }: {
      playerId: string;
      currentBalance: number;
      currentStreak: number;
      lastClaim: string | null;
      settings: Record<string, number>;
    }) => {
      const now = new Date();
      const today = now.toISOString().split("T")[0];

      if (lastClaim) {
        const lastDate = new Date(lastClaim).toISOString().split("T")[0];
        if (lastDate === today) throw new Error("Already claimed today");
      }

      const base = settings.daily_reward_base || 500;
      const bonus = settings.daily_reward_streak_bonus || 100;
      const maxStreak = settings.daily_reward_streak_max || 7;

      // Calculate streak
      let newStreak = 1;
      if (lastClaim) {
        const lastDate = new Date(lastClaim);
        const diffDays = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          newStreak = currentStreak >= maxStreak ? 1 : currentStreak + 1;
        }
      }

      const rewardAmount = base + bonus * (newStreak - 1);

      // Insert daily claim
      const { error: claimErr } = await supabase.from("daily_claims").insert({
        player_id: playerId,
        reward_amount: rewardAmount,
        streak_day: newStreak,
      });
      if (claimErr) throw claimErr;

      // Update player
      const { error: playerErr } = await supabase
        .from("players")
        .update({
          uc_balance: currentBalance + rewardAmount,
          daily_streak: newStreak,
          last_daily_claim: now.toISOString(),
        })
        .eq("id", playerId);
      if (playerErr) throw playerErr;

      // Log transaction
      const { error: txErr } = await supabase.from("transactions").insert({
        player_id: playerId,
        type: "daily_reward",
        amount: rewardAmount,
        description: `Daily Reward Claim (Day ${newStreak} streak)`,
      });
      if (txErr) throw txErr;

      return { rewardAmount, newStreak };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["player"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};
