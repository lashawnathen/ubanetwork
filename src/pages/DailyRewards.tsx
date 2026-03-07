import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Check, Flame } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { usePlayer, useLeagueSettings, useClaimDailyReward } from "@/hooks/usePlayer";
import { toast } from "@/hooks/use-toast";

const DailyRewards = () => {
  const { playerId } = useAuth();
  const { data: player } = usePlayer();
  const { data: settings } = useLeagueSettings();
  const claimReward = useClaimDailyReward();
  const [claimedResult, setClaimedResult] = useState<{ rewardAmount: number; newStreak: number } | null>(null);

  const maxStreak = settings?.daily_reward_streak_max ?? 7;
  const base = settings?.daily_reward_base ?? 500;
  const bonus = settings?.daily_reward_streak_bonus ?? 100;

  // Check if already claimed today
  const today = new Date().toISOString().split("T")[0];
  const lastClaimDate = player?.last_daily_claim
    ? new Date(player.last_daily_claim).toISOString().split("T")[0]
    : null;
  const alreadyClaimed = lastClaimDate === today || !!claimedResult;

  const handleClaim = async () => {
    if (!player || !playerId || !settings) return;
    try {
      const result = await claimReward.mutateAsync({
        playerId,
        currentBalance: player.uc_balance,
        currentStreak: player.daily_streak,
        lastClaim: player.last_daily_claim,
        settings,
      });
      setClaimedResult(result);
      toast({ title: "Reward Claimed!", description: `+${result.rewardAmount} UC` });
    } catch (err: any) {
      toast({ title: "Claim Failed", description: err.message, variant: "destructive" });
    }
  };

  const currentStreak = claimedResult?.newStreak ?? player?.daily_streak ?? 0;

  // Generate reward grid
  const rewardDays = Array.from({ length: maxStreak }, (_, i) => {
    const day = i + 1;
    const reward = base + bonus * i;
    const isPast = day < currentStreak || (day === currentStreak && alreadyClaimed);
    const isToday = day === currentStreak + 1 && !alreadyClaimed;
    return { day, reward, isPast, isToday };
  });

  return (
    <AppLayout>
      <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
        <h1 className="font-display text-2xl text-foreground mb-1">Daily Rewards</h1>
        <div className="flex items-center gap-2 mb-6">
          <Flame className="w-4 h-4 text-accent" />
          <span className="text-sm text-accent font-semibold">{currentStreak} Day Streak</span>
        </div>

        {/* Reward Grid */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {rewardDays.map((r) => (
            <motion.div
              key={r.day}
              className={`glass-card p-3 flex flex-col items-center gap-1 relative ${
                r.isToday ? "glow-primary border-primary/30" : ""
              } ${r.isPast ? "opacity-60" : ""}`}
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-[10px] text-muted-foreground uppercase">Day {r.day}</span>
              {r.isPast ? (
                <Check className="w-5 h-5 text-success" />
              ) : (
                <Gift className={`w-5 h-5 ${r.isToday ? "text-primary" : "text-muted-foreground"}`} />
              )}
              <span className="text-[10px] font-semibold text-foreground text-center leading-tight">{r.reward} UC</span>
            </motion.div>
          ))}
        </div>

        {/* Claim Button */}
        {!alreadyClaimed ? (
          <motion.button
            onClick={handleClaim}
            disabled={claimReward.isPending}
            className="tap-highlight w-full py-4 rounded-2xl bg-primary text-primary-foreground font-display text-lg uppercase tracking-wider glow-primary disabled:opacity-70"
            whileTap={{ scale: 0.97 }}
          >
            {claimReward.isPending ? "Claiming..." : "Claim Today's Reward"}
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 text-center glow-accent"
          >
            <div className="text-4xl mb-2">🎉</div>
            <h2 className="font-display text-xl text-accent mb-1">Reward Claimed!</h2>
            <p className="text-sm text-muted-foreground">
              +{claimedResult?.rewardAmount ?? base} UC added to your account
            </p>
            <p className="text-xs text-muted-foreground mt-3">Come back tomorrow to keep your streak!</p>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
};

export default DailyRewards;
