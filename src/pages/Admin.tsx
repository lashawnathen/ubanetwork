import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Coins, Award, Shield, Megaphone, Settings, Gamepad2, ArrowLeft, Plus, Search, Save } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import {
  useAllPlayers,
  useAllTeams,
  useAllAnnouncements,
  useAllLeagueSettings,
  useCreatePlayer,
  useUpdatePlayer,
  useCreateTeam,
  useUpdateTeam,
  useUpdateLeagueSetting,
  useCreateAnnouncement,
  useAdminAdjustUC,
} from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

const adminTabs = [
  { label: "Players", icon: Users },
  { label: "Teams", icon: Award },
  { label: "Economy", icon: Coins },
  { label: "Announce", icon: Megaphone },
  { label: "Settings", icon: Settings },
];

const Admin = () => {
  const [tab, setTab] = useState(0);
  const { user } = useAuth();

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
              key={t.label}
              onClick={() => setTab(i)}
              className={`tap-highlight whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                tab === i ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}
            >
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          ))}
        </div>

        {tab === 0 && <PlayersTab userId={user?.id} />}
        {tab === 1 && <TeamsTab />}
        {tab === 2 && <EconomyTab userId={user?.id} />}
        {tab === 3 && <AnnouncementsTab userId={user?.id} />}
        {tab === 4 && <SettingsTab />}
      </div>
    </AppLayout>
  );
};

// ==========================================
// Players Tab
// ==========================================
const PlayersTab = ({ userId }: { userId?: string }) => {
  const { data: players } = useAllPlayers();
  const { data: teams } = useAllTeams();
  const createPlayer = useCreatePlayer();
  const updatePlayer = useUpdatePlayer();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<any>(null);
  const [creating, setCreating] = useState(false);
  const [newPlayer, setNewPlayer] = useState({ name: "", position: "PG", archetype: "Two-Way", overall: 60, uc_balance: 0, team_id: "" as string, user_id: "" as string });

  const filtered = (players ?? []).filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    try {
      const data: any = { ...newPlayer };
      if (!data.team_id) delete data.team_id;
      if (!data.user_id) delete data.user_id;
      await createPlayer.mutateAsync(data);
      toast({ title: "Player Created" });
      setCreating(false);
      setNewPlayer({ name: "", position: "PG", archetype: "Two-Way", overall: 60, uc_balance: 0, team_id: "", user_id: "" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleUpdate = async () => {
    if (!editing) return;
    try {
      const { id, teams: _, ...rest } = editing;
      await updatePlayer.mutateAsync({ id, ...rest });
      toast({ title: "Player Updated" });
      setEditing(null);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  if (editing) {
    return (
      <div className="space-y-4">
        <button onClick={() => setEditing(null)} className="flex items-center gap-1 text-sm text-primary">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h3 className="font-display text-base text-foreground">Edit: {editing.name}</h3>
        <div className="space-y-3">
          {[
            { key: "name", label: "Name", type: "text" },
            { key: "position", label: "Position", type: "text" },
            { key: "archetype", label: "Archetype", type: "text" },
            { key: "overall", label: "Overall", type: "number" },
            { key: "uc_balance", label: "UC Balance", type: "number" },
            { key: "season", label: "Season", type: "number" },
            { key: "status", label: "Status", type: "text" },
            { key: "profile_image_url", label: "Profile Image URL", type: "text" },
            { key: "user_id", label: "Assigned User ID", type: "text" },
          ].map((field) => (
            <div key={field.key}>
              <label className="text-xs text-muted-foreground uppercase tracking-wider">{field.label}</label>
              <input
                type={field.type}
                value={editing[field.key] ?? ""}
                onChange={(e) => setEditing({ ...editing, [field.key]: field.type === "number" ? Number(e.target.value) : e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          ))}
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider">Team</label>
            <select
              value={editing.team_id ?? ""}
              onChange={(e) => setEditing({ ...editing, team_id: e.target.value || null })}
              className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">No Team</option>
              {(teams ?? []).map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleUpdate}
            disabled={updatePlayer.isPending}
            className="tap-highlight w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> {updatePlayer.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    );
  }

  if (creating) {
    return (
      <div className="space-y-4">
        <button onClick={() => setCreating(false)} className="flex items-center gap-1 text-sm text-primary">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h3 className="font-display text-base text-foreground">Add New Player</h3>
        <div className="space-y-3">
          <input placeholder="Player Name" value={newPlayer.name} onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
          <input placeholder="Position (PG, SG, SF, PF, C)" value={newPlayer.position} onChange={(e) => setNewPlayer({ ...newPlayer, position: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
          <input placeholder="Archetype" value={newPlayer.archetype} onChange={(e) => setNewPlayer({ ...newPlayer, archetype: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
          <input type="number" placeholder="Overall" value={newPlayer.overall} onChange={(e) => setNewPlayer({ ...newPlayer, overall: Number(e.target.value) })}
            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
          <input type="number" placeholder="Starting UC" value={newPlayer.uc_balance} onChange={(e) => setNewPlayer({ ...newPlayer, uc_balance: Number(e.target.value) })}
            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
          <select value={newPlayer.team_id} onChange={(e) => setNewPlayer({ ...newPlayer, team_id: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary">
            <option value="">No Team</option>
            {(teams ?? []).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <input placeholder="Assign User ID (optional)" value={newPlayer.user_id} onChange={(e) => setNewPlayer({ ...newPlayer, user_id: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
          <button onClick={handleCreate} disabled={!newPlayer.name || createPlayer.isPending}
            className="tap-highlight w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold uppercase tracking-wider">
            {createPlayer.isPending ? "Creating..." : "Create Player"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search players..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button onClick={() => setCreating(true)} className="tap-highlight px-3 py-2.5 rounded-xl bg-primary text-primary-foreground">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      {filtered.map((p) => (
        <div key={p.id} className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-base text-foreground">{p.name}</h3>
              <p className="text-xs text-muted-foreground">{p.position} · {(p as any).teams?.name || "Free Agent"} · OVR {p.overall}</p>
              <p className="text-xs text-accent">{p.uc_balance.toLocaleString()} UC</p>
            </div>
            <button onClick={() => setEditing({ ...p })} className="tap-highlight px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold">
              Edit
            </button>
          </div>
        </div>
      ))}
      {filtered.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-6">No players found</p>
      )}
    </div>
  );
};

// ==========================================
// Teams Tab
// ==========================================
const TeamsTab = () => {
  const { data: teams } = useAllTeams();
  const createTeam = useCreateTeam();
  const updateTeam = useUpdateTeam();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [newTeam, setNewTeam] = useState({ name: "", abbreviation: "", primary_color: "#7c3aed", secondary_color: "#1a1a2e" });

  const handleCreate = async () => {
    try {
      await createTeam.mutateAsync(newTeam);
      toast({ title: "Team Created" });
      setCreating(false);
      setNewTeam({ name: "", abbreviation: "", primary_color: "#7c3aed", secondary_color: "#1a1a2e" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleUpdate = async () => {
    if (!editing) return;
    try {
      const { id, ...rest } = editing;
      await updateTeam.mutateAsync({ id, ...rest });
      toast({ title: "Team Updated" });
      setEditing(null);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  if (editing) {
    return (
      <div className="space-y-4">
        <button onClick={() => setEditing(null)} className="flex items-center gap-1 text-sm text-primary"><ArrowLeft className="w-4 h-4" /> Back</button>
        <h3 className="font-display text-base text-foreground">Edit: {editing.name}</h3>
        <div className="space-y-3">
          {[
            { key: "name", label: "Team Name" },
            { key: "abbreviation", label: "Abbreviation" },
            { key: "logo_url", label: "Logo URL" },
            { key: "primary_color", label: "Primary Color" },
            { key: "secondary_color", label: "Secondary Color" },
          ].map((f) => (
            <div key={f.key}>
              <label className="text-xs text-muted-foreground uppercase tracking-wider">{f.label}</label>
              <input value={editing[f.key] ?? ""} onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
          ))}
          <button onClick={handleUpdate} disabled={updateTeam.isPending}
            className="tap-highlight w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold uppercase tracking-wider">
            {updateTeam.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {!creating && (
        <button onClick={() => setCreating(true)} className="tap-highlight w-full py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-semibold flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Add Team
        </button>
      )}
      {creating && (
        <div className="glass-card p-4 space-y-3">
          <input placeholder="Team Name" value={newTeam.name} onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
          <input placeholder="Abbreviation (e.g. CHI)" value={newTeam.abbreviation} onChange={(e) => setNewTeam({ ...newTeam, abbreviation: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
          <div className="flex gap-2">
            <button onClick={() => setCreating(false)} className="flex-1 py-2 rounded-xl bg-secondary text-foreground text-sm">Cancel</button>
            <button onClick={handleCreate} disabled={!newTeam.name || createTeam.isPending}
              className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold">{createTeam.isPending ? "..." : "Create"}</button>
          </div>
        </div>
      )}
      {(teams ?? []).map((t) => (
        <div key={t.id} className="glass-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {t.logo_url && <img src={t.logo_url} alt="" className="w-8 h-8 rounded" />}
            <div>
              <h3 className="font-display text-base text-foreground">{t.name}</h3>
              <p className="text-xs text-muted-foreground">{t.abbreviation || "—"}</p>
            </div>
          </div>
          <button onClick={() => setEditing({ ...t })} className="tap-highlight px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold">Edit</button>
        </div>
      ))}
      {(!teams || teams.length === 0) && !creating && (
        <p className="text-sm text-muted-foreground text-center py-6">No teams yet</p>
      )}
    </div>
  );
};

// ==========================================
// Economy Tab (UC Adjustments)
// ==========================================
const EconomyTab = ({ userId }: { userId?: string }) => {
  const { data: players } = useAllPlayers();
  const adjustUC = useAdminAdjustUC();
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  const player = players?.find((p) => p.id === selectedPlayer);

  const handleAdjust = async () => {
    if (!player || !amount) return;
    try {
      await adjustUC.mutateAsync({
        playerId: player.id,
        currentBalance: player.uc_balance,
        amount: Number(amount),
        reason,
        performedBy: userId,
      });
      toast({ title: "UC Adjusted", description: `${Number(amount) > 0 ? "+" : ""}${amount} UC for ${player.name}` });
      setAmount("");
      setReason("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="glass-card p-5 space-y-4">
      <h3 className="font-display text-base text-foreground">Adjust UC Balance</h3>
      <select value={selectedPlayer} onChange={(e) => setSelectedPlayer(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary">
        <option value="">Select Player</option>
        {(players ?? []).map((p) => <option key={p.id} value={p.id}>{p.name} ({p.uc_balance.toLocaleString()} UC)</option>)}
      </select>
      {player && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Current:</span>
          <span className="font-display text-lg text-accent">{player.uc_balance.toLocaleString()} UC</span>
        </div>
      )}
      <input type="number" placeholder="Amount (positive to add, negative to subtract)" value={amount} onChange={(e) => setAmount(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
      <input type="text" placeholder="Reason" value={reason} onChange={(e) => setReason(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
      <button onClick={handleAdjust} disabled={!selectedPlayer || !amount || adjustUC.isPending}
        className="tap-highlight w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold uppercase tracking-wider disabled:opacity-50">
        {adjustUC.isPending ? "Processing..." : "Apply Adjustment"}
      </button>
    </div>
  );
};

// ==========================================
// Announcements Tab
// ==========================================
const AnnouncementsTab = ({ userId }: { userId?: string }) => {
  const { data: announcements } = useAllAnnouncements();
  const createAnnouncement = useCreateAnnouncement();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handlePublish = async () => {
    try {
      await createAnnouncement.mutateAsync({ title, body, author_id: userId });
      toast({ title: "Announcement Published" });
      setTitle("");
      setBody("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="glass-card p-5 space-y-4">
        <h3 className="font-display text-base text-foreground">Post Announcement</h3>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
        <textarea placeholder="Announcement body..." rows={4} value={body} onChange={(e) => setBody(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
        <button onClick={handlePublish} disabled={!title || !body || createAnnouncement.isPending}
          className="tap-highlight w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold uppercase tracking-wider disabled:opacity-50">
          {createAnnouncement.isPending ? "Publishing..." : "Publish"}
        </button>
      </div>
      {(announcements ?? []).map((a) => (
        <div key={a.id} className="glass-card p-4">
          <p className="text-xs text-primary mb-1">{new Date(a.created_at).toLocaleDateString()}</p>
          <h3 className="font-display text-base text-foreground mb-1">{a.title}</h3>
          <p className="text-sm text-muted-foreground">{a.body}</p>
        </div>
      ))}
    </div>
  );
};

// ==========================================
// Settings Tab
// ==========================================
const SettingsTab = () => {
  const { data: settings } = useAllLeagueSettings();
  const updateSetting = useUpdateLeagueSetting();
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  const handleSave = async (setting: any) => {
    const newValue = editValues[setting.id] ?? String(setting.value);
    try {
      // Try to save as number if possible
      const parsed = Number(newValue);
      await updateSetting.mutateAsync({ id: setting.id, value: isNaN(parsed) ? newValue : parsed });
      toast({ title: "Setting Updated", description: setting.key });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const categories = [...new Set((settings ?? []).map((s) => s.category))];

  return (
    <div className="space-y-5">
      {categories.map((cat) => (
        <div key={cat}>
          <h3 className="font-display text-xs text-muted-foreground uppercase tracking-wider mb-2">{cat}</h3>
          <div className="space-y-2">
            {(settings ?? []).filter((s) => s.category === cat).map((s) => (
              <div key={s.id} className="glass-card p-4">
                <p className="text-sm font-medium text-foreground mb-1">{s.description || s.key}</p>
                <p className="text-[10px] text-muted-foreground mb-2">{s.key}</p>
                <div className="flex gap-2">
                  <input
                    value={editValues[s.id] ?? String(s.value)}
                    onChange={(e) => setEditValues({ ...editValues, [s.id]: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button onClick={() => handleSave(s)} disabled={updateSetting.isPending}
                    className="tap-highlight px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold">
                    <Save className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {(!settings || settings.length === 0) && (
        <p className="text-sm text-muted-foreground text-center py-6">No settings configured</p>
      )}
    </div>
  );
};

export default Admin;
