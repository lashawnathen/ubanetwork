import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Users, Newspaper } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const tabs = ["Standings", "Top Players", "News"];

const Rankings = () => {
  const [tab, setTab] = useState(0);

  const { data: teams } = useQuery({
    queryKey: ["rankings_teams"],
    queryFn: async () => {
      const { data, error } = await supabase.from("teams").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: topPlayers } = useQuery({
    queryKey: ["rankings_players"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("players")
        .select("*, teams(name, abbreviation)")
        .eq("status", "active")
        .order("overall", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
  });

  const { data: announcements } = useQuery({
    queryKey: ["announcements_public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
  });

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
            <div className="grid grid-cols-[auto_1fr] gap-x-3 px-4 py-2 text-[10px] text-muted-foreground uppercase tracking-wider border-b border-border">
              <span>#</span><span>Team</span>
            </div>
            {(teams ?? []).map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className={`grid grid-cols-[auto_1fr] gap-x-3 px-4 py-3 items-center ${
                  i !== (teams?.length ?? 0) - 1 ? "border-b border-border/50" : ""
                } ${i === 0 ? "bg-accent/5" : ""}`}
              >
                <span className={`font-display text-sm w-5 ${i === 0 ? "text-accent" : "text-muted-foreground"}`}>{i + 1}</span>
                <div className="flex items-center gap-2">
                  {t.logo_url && <img src={t.logo_url} alt="" className="w-6 h-6 rounded" />}
                  <span className="text-sm font-medium text-foreground">{t.name}</span>
                  {t.abbreviation && <span className="text-xs text-muted-foreground">({t.abbreviation})</span>}
                </div>
              </motion.div>
            ))}
            {(!teams || teams.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-6">No teams yet</p>
            )}
          </div>
        )}

        {tab === 1 && (
          <div className="space-y-2">
            {(topPlayers ?? []).map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-4 flex items-center gap-3"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-display text-sm ${
                  i === 0 ? "bg-accent/10 text-accent border border-accent/20" : "bg-secondary text-muted-foreground"
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.position} · {(p as any).teams?.name || "Free Agent"}</p>
                </div>
                <span className="font-display text-xl text-primary">{p.overall}</span>
              </motion.div>
            ))}
            {(!topPlayers || topPlayers.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-8">No players yet</p>
            )}
          </div>
        )}

        {tab === 2 && (
          <div className="space-y-3">
            {(announcements ?? []).map((n, i) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-4"
              >
                <p className="text-xs text-primary mb-1">{new Date(n.created_at).toLocaleDateString()}</p>
                <h3 className="font-display text-base text-foreground mb-1">{n.title}</h3>
                <p className="text-sm text-muted-foreground">{n.body}</p>
              </motion.div>
            ))}
            {(!announcements || announcements.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-8">No announcements yet</p>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Rankings;
