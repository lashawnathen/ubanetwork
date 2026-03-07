import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PlayerDetails from "./pages/PlayerDetails";
import UpgradeCenter from "./pages/UpgradeCenter";
import DailyRewards from "./pages/DailyRewards";
import Transactions from "./pages/Transactions";
import Rankings from "./pages/Rankings";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="dark">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/player" element={<PlayerDetails />} />
            <Route path="/upgrades" element={<UpgradeCenter />} />
            <Route path="/rewards" element={<DailyRewards />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/rankings" element={<Rankings />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
