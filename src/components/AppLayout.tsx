import { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, User, TrendingUp, Gift, Trophy, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { path: "/dashboard", icon: Home, label: "Home" },
  { path: "/player", icon: User, label: "Player" },
  { path: "/upgrades", icon: TrendingUp, label: "Upgrade" },
  { path: "/rewards", icon: Gift, label: "Rewards" },
  { path: "/rankings", icon: Trophy, label: "League" },
];

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 pb-20 overflow-y-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-border/50 rounded-t-2xl px-2 pt-2 pb-safe">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="tap-highlight flex flex-col items-center gap-0.5 py-2 px-3 relative"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <item.icon
                  className={`w-5 h-5 transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}
                />
                <span className={`text-[10px] font-medium transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
          {isAdmin && (
            <button
              onClick={() => navigate("/admin")}
              className="tap-highlight flex flex-col items-center gap-0.5 py-2 px-3 relative"
            >
              {location.pathname === "/admin" && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <Shield className={`w-5 h-5 transition-colors ${location.pathname === "/admin" ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-[10px] font-medium transition-colors ${location.pathname === "/admin" ? "text-primary" : "text-muted-foreground"}`}>
                Admin
              </span>
            </button>
          )}
        </div>
      </nav>
    </div>
  );
};

export default AppLayout;
