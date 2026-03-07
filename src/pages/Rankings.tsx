import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Users, Newspaper } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { standings, topPlayers, recentNews } from "@/data/sampleData";

const tabs = ["Standings", "Top Players", "News"];

const Rankings = () => {
  const [tab, setTab] = useState(0);

  return (
    <AppLayout>
      <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
        <h1 className="font-display text-2xl text-foreground mb-5">League</h1>

        <div className="flex gap-2 mb-5">
          {tabs.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className={`tap-highlight px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                tab === i ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 0 && (
          <div className="glass-card overflow-hidden">
            <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-3 px-4 py-2 text-[10px] text-muted-foreground uppercase tracking-wider border-b border-border">
              <span>#</span><span>Team</span><span>W</span><span>L</span><span>PCT</span>
            </div>
            {standings.map((s, i) => (
              <motion.div
                key={s.team}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className={`grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-3 px-4 py-3 items-center ${
                  i !== standings.length - 1 ? "border-b border-border/50" : ""
                } ${i === 0 ? "bg-accent/5" : ""}`}
              >
                <span className={`font-display text-sm w-5 ${i === 0 ? "text-accent" : "text-muted-foreground"}`}>{s.rank}</span>
                <span className="text-sm font-medium text-foreground">{s.team}</span>
                <span className="text-sm text-foreground w-6 text-center">{s.wins}</span>
                <span className="text-sm text-muted-foreground w-6 text-center">{s.losses}</span>
                <span className="text-sm text-muted-foreground w-10 text-right">{s.pct}</span>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 1 && (
          <div className="space-y-2">
            {topPlayers.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-4 flex items-center gap-3"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-display text-sm ${
                  i === 0 ? "bg-accent/10 text-accent border border-accent/20" : "bg-secondary text-muted-foreground"
                }`}>
                  {p.rank}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.position} · {p.team}</p>
                </div>
                <span className="font-display text-xl text-primary">{p.overall}</span>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 2 && (
          <div className="space-y-3">
            {recentNews.map((n, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-4"
              >
                <p className="text-xs text-primary mb-1">{n.date}</p>
                <h3 className="font-display text-base text-foreground mb-1">{n.title}</h3>
                <p className="text-sm text-muted-foreground">{n.excerpt}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Rankings;
