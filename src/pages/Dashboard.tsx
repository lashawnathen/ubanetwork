import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Zap, Award, TrendingUp, Gift, ChevronRight, Coins, Star } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { samplePlayer, transactions } from "@/data/sampleData";
import ubaLogo from "@/assets/uba-logo.png";

const quickActions = [
  { label: "Attributes", icon: TrendingUp, path: "/player?tab=attributes" },
  { label: "Badges", icon: Award, path: "/player?tab=badges" },
  { label: "Tendencies", icon: Zap, path: "/player?tab=tendencies" },
  { label: "Hotzones", icon: Star, path: "/player?tab=hotzones" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const Dashboard = () => {
  const navigate = useNavigate();
  const recentTx = transactions.slice(0, 3);

  return (
    <AppLayout>
      <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
          {/* Header */}
          <motion.div variants={item} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={ubaLogo} alt="UBA" className="w-10 h-10" />
              <div>
                <p className="text-muted-foreground text-xs">Welcome back</p>
                <h1 className="font-display text-xl text-foreground">{samplePlayer.name}</h1>
              </div>
            </div>
            <button
              onClick={() => navigate("/transactions")}
              className="tap-highlight flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent/10 border border-accent/20"
            >
              <Coins className="w-4 h-4 text-accent" />
              <span className="font-display text-sm text-accent">{samplePlayer.ucBalance.toLocaleString()} UC</span>
            </button>
          </motion.div>

          {/* Player Card */}
          <motion.div
            variants={item}
            className="glass-card glow-primary p-5 relative overflow-hidden cursor-pointer"
            onClick={() => navigate("/player")}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px]" />
            <div className="flex items-start justify-between relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                    {samplePlayer.position}
                  </span>
                  <span className="text-xs text-muted-foreground">Season {samplePlayer.season}</span>
                </div>
                <h2 className="font-display text-2xl text-foreground">{samplePlayer.name}</h2>
                <p className="text-sm text-muted-foreground">{samplePlayer.archetype}</p>
                <p className="text-xs text-muted-foreground">{samplePlayer.team}</p>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-display text-5xl text-gradient-primary leading-none">{samplePlayer.overall}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Overall</span>
              </div>
            </div>
            <div className="flex items-center justify-end mt-3 text-xs text-muted-foreground">
              <span>View Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </motion.div>

          {/* Daily Reward */}
          <motion.div
            variants={item}
            className="glass-card p-4 flex items-center justify-between cursor-pointer"
            onClick={() => navigate("/rewards")}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                <Gift className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Daily Reward Ready</p>
                <p className="text-xs text-muted-foreground">{samplePlayer.dailyStreak} day streak 🔥</p>
              </div>
            </div>
            <button className="tap-highlight px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider">
              Claim
            </button>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={item}>
            <h3 className="font-display text-sm text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</h3>
            <div className="grid grid-cols-4 gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className="tap-highlight glass-card p-3 flex flex-col items-center gap-2 hover:border-primary/30 transition-colors"
                >
                  <action.icon className="w-5 h-5 text-primary" />
                  <span className="text-[10px] text-muted-foreground font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={item}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-sm text-muted-foreground uppercase tracking-wider">Recent Activity</h3>
              <button onClick={() => navigate("/transactions")} className="text-xs text-primary">View All</button>
            </div>
            <div className="space-y-2">
              {recentTx.map((tx) => (
                <div key={tx.id} className="glass-card p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground">{tx.reason}</p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                  <span className={`font-display text-sm ${tx.amount > 0 ? "text-success" : "text-destructive"}`}>
                    {tx.amount > 0 ? "+" : ""}{tx.amount.toLocaleString()} UC
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
