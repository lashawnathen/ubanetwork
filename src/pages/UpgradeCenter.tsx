import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronUp, Coins } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { attributes, badges, samplePlayer } from "@/data/sampleData";

const UpgradeCenter = () => {
  const [tab, setTab] = useState<"attributes" | "badges">("attributes");
  const [selectedAttr, setSelectedAttr] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [upgraded, setUpgraded] = useState<string[]>([]);

  const getUpgradeCost = (value: number) => Math.round(value * 15 + 200);

  const handleUpgrade = (name: string) => {
    setSelectedAttr(name);
    setShowConfirm(true);
  };

  const confirmUpgrade = () => {
    if (selectedAttr) setUpgraded((prev) => [...prev, selectedAttr]);
    setShowConfirm(false);
    setSelectedAttr(null);
  };

  return (
    <AppLayout>
      <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-5">
          <h1 className="font-display text-2xl text-foreground">Upgrade Center</h1>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent/10 border border-accent/20">
            <Coins className="w-4 h-4 text-accent" />
            <span className="font-display text-sm text-accent">{samplePlayer.ucBalance.toLocaleString()} UC</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {(["attributes", "badges"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`tap-highlight px-5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                tab === t ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "attributes" && (
          <div className="space-y-2">
            {attributes.map((attr) => {
              const cost = getUpgradeCost(attr.value);
              const isUpgraded = upgraded.includes(attr.name);
              return (
                <motion.div
                  key={attr.name}
                  className="glass-card p-4 flex items-center gap-3"
                  layout
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{attr.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-display text-lg text-foreground">{isUpgraded ? attr.value + 1 : attr.value}</span>
                      {!isUpgraded && (
                        <>
                          <ChevronUp className="w-3.5 h-3.5 text-success" />
                          <span className="font-display text-lg text-success">{attr.value + 1}</span>
                        </>
                      )}
                    </div>
                  </div>
                  {isUpgraded ? (
                    <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-success/10 border border-success/20">
                      <Check className="w-4 h-4 text-success" />
                      <span className="text-xs font-semibold text-success">Done</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(attr.name)}
                      className="tap-highlight px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider"
                    >
                      {cost} UC
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {tab === "badges" && (
          <div className="space-y-2">
            {badges.map((badge) => {
              const nextLevel = badge.level === "Bronze" ? "Silver" : badge.level === "Silver" ? "Gold" : badge.level === "Gold" ? "HOF" : null;
              const cost = badge.level === "Bronze" ? 500 : badge.level === "Silver" ? 1000 : badge.level === "Gold" ? 2000 : 0;
              const isUpgraded = upgraded.includes(badge.name);
              return (
                <motion.div key={badge.name} className="glass-card p-4 flex items-center gap-3" layout>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{badge.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground uppercase">{isUpgraded && nextLevel ? nextLevel : badge.level}</span>
                      {!isUpgraded && nextLevel && (
                        <>
                          <ChevronUp className="w-3 h-3 text-success" />
                          <span className="text-xs text-success uppercase">{nextLevel}</span>
                        </>
                      )}
                    </div>
                  </div>
                  {isUpgraded || !nextLevel ? (
                    <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-success/10 border border-success/20">
                      <Check className="w-4 h-4 text-success" />
                      <span className="text-xs font-semibold text-success">{!nextLevel ? "MAX" : "Done"}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(badge.name)}
                      className="tap-highlight px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider"
                    >
                      {cost} UC
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass-card glow-primary p-6 w-full max-w-sm"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <h2 className="font-display text-xl text-foreground mb-2">Confirm Upgrade</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Upgrade <span className="text-foreground font-semibold">{selectedAttr}</span>? This will deduct UC from your balance.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="tap-highlight flex-1 py-3 rounded-xl bg-secondary text-foreground text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmUpgrade}
                  className="tap-highlight flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold uppercase tracking-wider"
                >
                  Upgrade Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
};

export default UpgradeCenter;
