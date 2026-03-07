import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Coins, Award, TrendingUp, Megaphone, Shield } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { samplePlayer, attributes } from "@/data/sampleData";

const adminTabs = ["Players", "UC", "Upgrades", "Announcements"];

const Admin = () => {
  const [tab, setTab] = useState(0);
  const [announcement, setAnnouncement] = useState("");

  return (
    <AppLayout>
      <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
        <div className="flex items-center gap-2 mb-5">
          <Shield className="w-5 h-5 text-primary" />
          <h1 className="font-display text-2xl text-foreground">Admin Panel</h1>
        </div>

        <div className="flex gap-2 mb-5 overflow-x-auto -mx-4 px-4 scrollbar-none">
          {adminTabs.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className={`tap-highlight whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                tab === i ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 0 && (
          <div className="space-y-3">
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-display text-base text-foreground">{samplePlayer.name}</h3>
                  <p className="text-xs text-muted-foreground">{samplePlayer.position} · {samplePlayer.team} · OVR {samplePlayer.overall}</p>
                </div>
                <button className="tap-highlight px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold">
                  Edit
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-secondary rounded-xl p-2">
                  <p className="font-display text-lg text-foreground">{samplePlayer.overall}</p>
                  <p className="text-[10px] text-muted-foreground">OVR</p>
                </div>
                <div className="bg-secondary rounded-xl p-2">
                  <p className="font-display text-lg text-accent">{samplePlayer.ucBalance.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">UC</p>
                </div>
                <div className="bg-secondary rounded-xl p-2">
                  <p className="font-display text-lg text-foreground">S{samplePlayer.season}</p>
                  <p className="text-[10px] text-muted-foreground">Season</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 1 && (
          <div className="glass-card p-5 space-y-4">
            <h3 className="font-display text-base text-foreground">Adjust UC Balance</h3>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Player:</span>
              <span className="text-sm text-foreground font-semibold">{samplePlayer.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Current:</span>
              <span className="font-display text-lg text-accent">{samplePlayer.ucBalance.toLocaleString()} UC</span>
            </div>
            <input
              type="number"
              placeholder="Amount to add/subtract"
              className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              type="text"
              placeholder="Reason (e.g. Admin Adjustment)"
              className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button className="tap-highlight w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold uppercase tracking-wider">
              Apply Adjustment
            </button>
          </div>
        )}

        {tab === 2 && (
          <div className="space-y-2">
            <div className="glass-card p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Ball Handle 90 → 92</p>
                <p className="text-xs text-muted-foreground">{samplePlayer.name} · Pending</p>
              </div>
              <div className="flex gap-2">
                <button className="tap-highlight px-3 py-1.5 rounded-lg bg-success/10 text-success text-xs font-semibold border border-success/20">
                  Approve
                </button>
                <button className="tap-highlight px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold border border-destructive/20">
                  Deny
                </button>
              </div>
            </div>
            <div className="glass-card p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Dimer Silver → Gold</p>
                <p className="text-xs text-muted-foreground">{samplePlayer.name} · Pending</p>
              </div>
              <div className="flex gap-2">
                <button className="tap-highlight px-3 py-1.5 rounded-lg bg-success/10 text-success text-xs font-semibold border border-success/20">
                  Approve
                </button>
                <button className="tap-highlight px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold border border-destructive/20">
                  Deny
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === 3 && (
          <div className="glass-card p-5 space-y-4">
            <h3 className="font-display text-base text-foreground">Post Announcement</h3>
            <input
              type="text"
              placeholder="Title"
              className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <textarea
              placeholder="Announcement body..."
              rows={4}
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
            <button className="tap-highlight w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold uppercase tracking-wider">
              Publish
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Admin;
