import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronUp, Coins } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import {
  usePlayer,
  usePlayerAttributes,
  usePlayerBadges,
  useLeagueSettings,
  useUpgradeAttribute,
  useUpgradeBadge,
} from "@/hooks/usePlayer";
import { toast } from "@/hooks/use-toast";

const UpgradeCenter = () => {
  const [tab, setTab] = useState<"attributes" | "badges">("attributes");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [upgradeType, setUpgradeType] = useState<"attr" | "badge">("attr");

  const { playerId } = useAuth();
  const { data: player } = usePlayer();
  const { data: attributes } = usePlayerAttributes(playerId);
  const { data: badges } = usePlayerBadges(playerId);
  const { data: settings } = useLeagueSettings();
  const upgradeAttr = useUpgradeAttribute();
  const upgradeBadge = useUpgradeBadge();

  const getAttrCost = (value: number) => {
    const base = settings?.attribute_upgrade_base_cost ?? 200;
    const perPoint = settings?.attribute_upgrade_per_point ?? 15;
    return Math.round(value * perPoint + base);
  };

  const getBadgeCost = (level: string) => {
    if (level === "Bronze") return settings?.badge_upgrade_cost_bronze_to_silver ?? 500;
    if (level === "Silver") return settings?.badge_upgrade_cost_silver_to_gold ?? 1000;
    if (level === "Gold") return settings?.badge_upgrade_cost_gold_to_hof ?? 2000;
    return 0;
  };

  const getNextBadgeLevel = (level: string) => {
    if (level === "Bronze") return "Silver";
    if (level === "Silver") return "Gold";
    if (level === "Gold") return "HOF";
    return null;
  };

  const handleUpgrade = (item: any, type: "attr" | "badge") => {
    setSelectedItem(item);
    setUpgradeType(type);
    setShowConfirm(true);
  };

  const confirmUpgrade = async () => {
    if (!player || !selectedItem) return;

    try {
      if (upgradeType === "attr") {
        const cost = getAttrCost(selectedItem.value);
        await upgradeAttr.mutateAsync({
          playerId: player.id,
          attributeId: selectedItem.id,
          attributeName: selectedItem.name,
          currentValue: selectedItem.value,
          cost,
          currentBalance: player.uc_balance,
        });
        toast({ title: "Upgrade Applied!", description: `${selectedItem.name} upgraded to ${selectedItem.value + 1}` });
      } else {
        const nextLevel = getNextBadgeLevel(selectedItem.level)!;
        const cost = getBadgeCost(selectedItem.level);
        await upgradeBadge.mutateAsync({
          playerId: player.id,
          badgeId: selectedItem.id,
          badgeName: selectedItem.name,
          currentLevel: selectedItem.level,
          nextLevel,
          cost,
          currentBalance: player.uc_balance,
        });
        toast({ title: "Badge Upgraded!", description: `${selectedItem.name} upgraded to ${nextLevel}` });
      }
    } catch (err: any) {
      toast({ title: "Upgrade Failed", description: err.message, variant: "destructive" });
    }

    setShowConfirm(false);
    setSelectedItem(null);
  };

  const balance = player?.uc_balance ?? 0;

  return (
    <AppLayout>
      <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-5">
          <h1 className="font-display text-2xl text-foreground">Upgrade Center</h1>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent/10 border border-accent/20">
            <Coins className="w-4 h-4 text-accent" />
            <span className="font-display text-sm text-accent">{balance.toLocaleString()} UC</span>
          </div>
        </div>

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
            {(attributes ?? []).map((attr) => {
              const cost = getAttrCost(attr.value);
              const canAfford = balance >= cost;
              return (
                <motion.div key={attr.id} className="glass-card p-4 flex items-center gap-3" layout>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{attr.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-display text-lg text-foreground">{attr.value}</span>
                      <ChevronUp className="w-3.5 h-3.5 text-success" />
                      <span className="font-display text-lg text-success">{attr.value + 1}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUpgrade(attr, "attr")}
                    disabled={!canAfford}
                    className={`tap-highlight px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider ${
                      canAfford
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    {cost} UC
                  </button>
                </motion.div>
              );
            })}
            {(!attributes || attributes.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-8">No attributes to upgrade</p>
            )}
          </div>
        )}

        {tab === "badges" && (
          <div className="space-y-2">
            {(badges ?? []).map((badge) => {
              const nextLevel = getNextBadgeLevel(badge.level);
              const cost = getBadgeCost(badge.level);
              const canAfford = balance >= cost;
              return (
                <motion.div key={badge.id} className="glass-card p-4 flex items-center gap-3" layout>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{badge.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground uppercase">{badge.level}</span>
                      {nextLevel && (
                        <>
                          <ChevronUp className="w-3 h-3 text-success" />
                          <span className="text-xs text-success uppercase">{nextLevel}</span>
                        </>
                      )}
                    </div>
                  </div>
                  {!nextLevel ? (
                    <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-success/10 border border-success/20">
                      <Check className="w-4 h-4 text-success" />
                      <span className="text-xs font-semibold text-success">MAX</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(badge, "badge")}
                      disabled={!canAfford}
                      className={`tap-highlight px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider ${
                        canAfford
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground cursor-not-allowed"
                      }`}
                    >
                      {cost} UC
                    </button>
                  )}
                </motion.div>
              );
            })}
            {(!badges || badges.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-8">No badges to upgrade</p>
            )}
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      <AnimatePresence>
        {showConfirm && selectedItem && (
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
              <p className="text-sm text-muted-foreground mb-2">
                Upgrade <span className="text-foreground font-semibold">{selectedItem.name}</span>
                {upgradeType === "attr"
                  ? ` from ${selectedItem.value} to ${selectedItem.value + 1}`
                  : ` from ${selectedItem.level} to ${getNextBadgeLevel(selectedItem.level)}`}
              </p>
              <p className="text-sm text-accent font-display mb-6">
                Cost: {upgradeType === "attr" ? getAttrCost(selectedItem.value) : getBadgeCost(selectedItem.level)} UC
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
                  disabled={upgradeAttr.isPending || upgradeBadge.isPending}
                  className="tap-highlight flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold uppercase tracking-wider disabled:opacity-70"
                >
                  {upgradeAttr.isPending || upgradeBadge.isPending ? "Processing..." : "Upgrade Now"}
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
