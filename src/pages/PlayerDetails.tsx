import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import {
  usePlayer,
  usePlayerAttributes,
  usePlayerBadges,
  usePlayerTendencies,
  usePlayerHotzones,
  usePlayerSignatures,
  usePlayerAccessories,
  usePlayerGear,
  usePlayerGameplan,
} from "@/hooks/usePlayer";

const tabs = ["Attributes", "Badges", "Tendencies", "Hotzones", "Signatures", "Accessories", "Gear", "Gameplan"];

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

const gameplanFields = [
  { key: "shot_tendency", label: "Shot Tendency" },
  { key: "drive_tendency", label: "Drive Tendency" },
  { key: "playmaking_focus", label: "Playmaking Focus" },
  { key: "defensive_aggression", label: "Defensive Aggression" },
  { key: "rebounding_priority", label: "Rebounding Priority" },
  { key: "tempo", label: "Tempo / Pace" },
  { key: "usage", label: "Usage / Touches" },
  { key: "freelance_style", label: "Freelance Style" },
];

const PlayerDetails = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "attributes";
  const [activeTab, setActiveTab] = useState(
    Math.max(0, tabs.findIndex((t) => t.toLowerCase() === initialTab.toLowerCase()))
  );

  const { playerId } = useAuth();
  const { data: player } = usePlayer();
  const { data: attributes } = usePlayerAttributes(playerId);
  const { data: badges } = usePlayerBadges(playerId);
  const { data: tendencies } = usePlayerTendencies(playerId);
  const { data: hotzones } = usePlayerHotzones(playerId);
  const { data: signatures } = usePlayerSignatures(playerId);
  const { data: accessories } = usePlayerAccessories(playerId);
  const { data: gear } = usePlayerGear(playerId);
  const { data: gameplan } = usePlayerGameplan(playerId);

  const teamName = (player as any)?.teams?.name || "Free Agent";
  const categories = [...new Set((attributes ?? []).map((a) => a.category))];
  const badgeCategories = [...new Set((badges ?? []).map((b) => b.category).filter(Boolean))];

  // Map hotzones to grid
  const hotZoneMap: Record<string, string> = {};
  hotzones?.forEach((h) => { hotZoneMap[h.zone] = h.level; });

  return (
    <AppLayout>
      <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
        {/* Player Header */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center border border-border overflow-hidden">
            {player?.profile_image_url ? (
              <img src={player.profile_image_url} alt={player.name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-display text-2xl text-primary">{player?.overall}</span>
            )}
          </div>
          <div>
            <h1 className="font-display text-xl text-foreground">{player?.name}</h1>
            <p className="text-sm text-muted-foreground">{player?.position} · {player?.archetype}</p>
            <p className="text-xs text-muted-foreground">{teamName}</p>
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
            {/* Attributes */}
            {activeTab === 0 && (
              <div className="space-y-5">
                {categories.map((cat) => (
                  <div key={cat}>
                    <h3 className="font-display text-xs text-muted-foreground uppercase tracking-wider mb-2">{cat}</h3>
                    <div className="space-y-1.5">
                      {(attributes ?? []).filter((a) => a.category === cat).map((attr) => (
                        <div key={attr.id} className="glass-card p-3 flex items-center gap-3">
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
                {(!attributes || attributes.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-8">No attributes set yet</p>
                )}
              </div>
            )}

            {/* Badges */}
            {activeTab === 1 && (
              <div className="space-y-5">
                {badgeCategories.map((cat) => (
                  <div key={cat}>
                    <h3 className="font-display text-xs text-muted-foreground uppercase tracking-wider mb-2">{cat}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {(badges ?? []).filter((b) => b.category === cat).map((badge) => (
                        <div key={badge.id} className={`glass-card p-3 flex items-center justify-between border ${getBadgeColor(badge.level)}`}>
                          <span className="text-sm">{badge.name}</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider">{badge.level}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {(!badges || badges.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-8">No badges set yet</p>
                )}
              </div>
            )}

            {/* Tendencies */}
            {activeTab === 2 && (
              <div className="space-y-1.5">
                {(tendencies ?? []).map((t) => (
                  <div key={t.id} className="glass-card p-3 flex items-center gap-3">
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
                {(!tendencies || tendencies.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-8">No tendencies set yet</p>
                )}
              </div>
            )}

            {/* Hotzones */}
            {activeTab === 3 && (
              <div className="glass-card p-6 text-center">
                <div className="grid grid-cols-5 grid-rows-5 gap-1 max-w-[240px] mx-auto mb-4">
                  {Array.from({ length: 25 }).map((_, i) => {
                    const zoneKey = `zone_${i}`;
                    const level = hotZoneMap[zoneKey] || "neutral";
                    const isHot = level === "hot";
                    const isCold = level === "cold";
                    return (
                      <div
                        key={i}
                        className={`aspect-square rounded-lg ${
                          isHot ? "bg-destructive/60 border border-destructive/40" :
                          isCold ? "bg-info/40 border border-info/30" :
                          "bg-secondary border border-border"
                        }`}
                      />
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground">Shot chart zones — Hot zones highlighted</p>
              </div>
            )}

            {/* Signatures */}
            {activeTab === 4 && (
              <div className="space-y-2">
                {(signatures ?? []).map((s) => (
                  <div key={s.id} className="glass-card p-4 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">{s.category}</span>
                    <span className="text-sm font-medium text-foreground">{s.name}</span>
                  </div>
                ))}
                {(!signatures || signatures.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-8">No signatures set yet</p>
                )}
              </div>
            )}

            {/* Accessories */}
            {activeTab === 5 && (
              <div className="space-y-2">
                {(accessories ?? []).map((a) => (
                  <div key={a.id} className="glass-card p-4 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">{a.slot}</span>
                    <span className="text-sm font-medium text-foreground">{a.name}</span>
                  </div>
                ))}
                {(!accessories || accessories.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-8">No accessories set yet</p>
                )}
              </div>
            )}

            {/* Gear */}
            {activeTab === 6 && (
              <div className="space-y-2">
                {(gear ?? []).map((g) => (
                  <div key={g.id} className="glass-card p-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">{g.slot}</span>
                      {g.brand && <span className="text-xs text-primary ml-2">{g.brand}</span>}
                    </div>
                    <span className="text-sm font-medium text-foreground">{g.name}</span>
                  </div>
                ))}
                {(!gear || gear.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-8">No gear set yet</p>
                )}
              </div>
            )}

            {/* Gameplan */}
            {activeTab === 7 && (
              <div className="space-y-2">
                {gameplan ? (
                  gameplanFields.map((f) => (
                    <div key={f.key} className="glass-card p-4 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{f.label}</span>
                      <span className="text-sm font-semibold text-foreground capitalize">
                        {(gameplan as any)[f.key] || "—"}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No gameplan set yet</p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </AppLayout>
  );
};

export default PlayerDetails;
