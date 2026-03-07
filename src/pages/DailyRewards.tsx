import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Check, Flame } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { dailyRewards, samplePlayer } from "@/data/sampleData";

const DailyRewards = () => {
  const [claimed, setClaimed] = useState(false);

  return (
    <AppLayout>
      <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
        <h1 className="font-display text-2xl text-foreground mb-1">Daily Rewards</h1>
        <div className="flex items-center gap-2 mb-6">
          <Flame className="w-4 h-4 text-accent" />
          <span className="text-sm text-accent font-semibold">{samplePlayer.dailyStreak} Day Streak</span>
        </div>

        {/* Reward Grid */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {dailyRewards.map((r, i) => {
            const isToday = i === 6;
            const isClaimed = r.claimed || (isToday && claimed);
            return (
              <motion.div
                key={r.day}
                className={`glass-card p-3 flex flex-col items-center gap-1 relative ${
                  isToday && !claimed ? "glow-primary border-primary/30" : ""
                } ${isClaimed ? "opacity-60" : ""}`}
                whileHover={{ scale: 1.02 }}
              >
                <span className="text-[10px] text-muted-foreground uppercase">Day {r.day}</span>
                {isClaimed ? (
                  <Check className="w-5 h-5 text-success" />
                ) : (
                  <Gift className={`w-5 h-5 ${isToday ? "text-primary" : "text-muted-foreground"}`} />
                )}
                <span className="text-[10px] font-semibold text-foreground text-center leading-tight">{r.reward}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Claim Button */}
        {!claimed ? (
          <motion.button
            onClick={() => setClaimed(true)}
            className="tap-highlight w-full py-4 rounded-2xl bg-primary text-primary-foreground font-display text-lg uppercase tracking-wider glow-primary"
            whileTap={{ scale: 0.97 }}
          >
            Claim Today's Reward
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 text-center glow-accent"
          >
            <div className="text-4xl mb-2">🎉</div>
            <h2 className="font-display text-xl text-accent mb-1">Reward Claimed!</h2>
            <p className="text-sm text-muted-foreground">+1000 UC & Badge Token added to your account</p>
            <p className="text-xs text-muted-foreground mt-3">Come back tomorrow to keep your streak!</p>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
};

export default DailyRewards;
