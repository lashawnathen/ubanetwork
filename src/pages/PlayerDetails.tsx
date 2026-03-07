import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { samplePlayer, attributes, badges, tendencies } from "@/data/sampleData";

const tabs = ["Attributes", "Badges", "Tendencies", "Hotzones", "Signatures", "Accessories", "Gear"];

const getAttrColor = (value: number) => {
  if (value >= 90) return "text-success";
  if (value >= 80) return "text-primary";
  if (value >= 70) return "text-accent";
  if (value >= 60) return "text-warning";
  return "text-destructive";
};

const getBarColor = (value: number) => {
  if (value >= 90) return "bg-success";
  if (value >= 80) return "bg-primary";
  if (value >= 70) return "bg-accent";
  if (value >= 60) return "bg-warning";
  return "bg-destructive";
};

const getBadgeColor = (level: string) => {
  switch (level) {
    case "HOF": return "bg-accent/20 text-accent border-accent/30";
    case "Gold": return "bg-[hsl(45,80%,50%)]/20 text-[hsl(45,80%,65%)] border-[hsl(45,80%,50%)]/30";
    case "Silver": return "bg-muted text-muted-foreground border-border";
    case "Bronze": return "bg-[hsl(25,60%,40%)]/20 text-[hsl(25,60%,60%)] border-[hsl(25,60%,40%)]/30";
    default: return "bg-muted text-muted-foreground border-border";
  }
};

const PlayerDetails = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "attributes";
  const [activeTab, setActiveTab] = useState(
    tabs.findIndex((t) => t.toLowerCase() === initialTab.toLowerCase()) >= 0
      ? tabs.findIndex((t) => t.toLowerCase() === initialTab.toLowerCase())
      : 0
  );

  const categories = [...new Set(attributes.map((a) => a.category))];

  return (
    <AppLayout>
      <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
        {/* Player Header */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center border border-border">
            <span className="font-display text-2xl text-primary">{samplePlayer.overall}</span>
          </div>
          <div>
            <h1 className="font-display text-xl text-foreground">{samplePlayer.name}</h1>
            <p className="text-sm text-muted-foreground">{samplePlayer.position} · {samplePlayer.archetype}</p>
            <p className="text-xs text-muted-foreground">{samplePlayer.team}</p>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-1 overflow-x-auto pb-3 mb-4 scrollbar-none -mx-4 px-4">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`tap-highlight whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === i
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 0 && (
              <div className="space-y-5">
                {categories.map((cat) => (
                  <div key={cat}>
                    <h3 className="font-display text-xs text-muted-foreground uppercase tracking-wider mb-2">{cat}</h3>
                    <div className="space-y-1.5">
                      {attributes.filter((a) => a.category === cat).map((attr) => (
                        <div key={attr.name} className="glass-card p-3 flex items-center gap-3">
                          <span className="text-sm text-foreground flex-1">{attr.name}</span>
                          <div className="w-24 h-1.5 rounded-full bg-secondary overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${getBarColor(attr.value)}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${attr.value}%` }}
                              transition={{ duration: 0.5, delay: 0.1 }}
                            />
                          </div>
                          <span className={`font-display text-sm w-8 text-right ${getAttrColor(attr.value)}`}>
                            {attr.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 1 && (
              <div className="space-y-5">
                {[...new Set(badges.map((b) => b.category))].map((cat) => (
                  <div key={cat}>
                    <h3 className="font-display text-xs text-muted-foreground uppercase tracking-wider mb-2">{cat}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {badges.filter((b) => b.category === cat).map((badge) => (
                        <div key={badge.name} className={`glass-card p-3 flex items-center justify-between border ${getBadgeColor(badge.level)}`}>
                          <span className="text-sm">{badge.name}</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider">{badge.level}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 2 && (
              <div className="space-y-1.5">
                {tendencies.map((t) => (
                  <div key={t.name} className="glass-card p-3 flex items-center gap-3">
                    <span className="text-sm text-foreground flex-1">{t.name}</span>
                    <div className="w-24 h-1.5 rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${t.value}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <span className="font-display text-sm text-foreground w-8 text-right">{t.value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 3 && (
              <div className="glass-card p-6 text-center">
                <div className="grid grid-cols-5 grid-rows-5 gap-1 max-w-[240px] mx-auto mb-4">
                  {Array.from({ length: 25 }).map((_, i) => {
                    const hot = [2, 6, 7, 8, 11, 12, 13, 16, 17, 18, 22];
                    const isHot = hot.includes(i);
                    return (
                      <div
                        key={i}
                        className={`aspect-square rounded-lg ${
                          isHot ? "bg-destructive/60 border border-destructive/40" : "bg-secondary border border-border"
                        }`}
                      />
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground">Shot chart zones — Hot zones highlighted</p>
              </div>
            )}

            {(activeTab === 4 || activeTab === 5 || activeTab === 6) && (
              <div className="glass-card p-8 text-center">
                <p className="text-muted-foreground text-sm">
                  {tabs[activeTab]} coming soon
                </p>
                <p className="text-xs text-muted-foreground mt-1">This section will be available in a future update.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </AppLayout>
  );
};

export default PlayerDetails;
