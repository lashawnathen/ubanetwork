import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { usePlayerTransactions } from "@/hooks/usePlayer";

const Transactions = () => {
  const { playerId } = useAuth();
  const { data: transactions, isLoading } = usePlayerTransactions(playerId);

  return (
    <AppLayout>
      <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
        <h1 className="font-display text-2xl text-foreground mb-5">Transaction History</h1>
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}
        <div className="space-y-2">
          {(transactions ?? []).map((tx, i) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass-card p-4 flex items-center gap-3"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                tx.amount > 0 ? "bg-success/10 border border-success/20" : "bg-destructive/10 border border-destructive/20"
              }`}>
                {tx.amount > 0 ? (
                  <ArrowDownLeft className="w-4 h-4 text-success" />
                ) : (
                  <ArrowUpRight className="w-4 h-4 text-destructive" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{tx.description}</p>
                <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()} · {tx.type}</p>
              </div>
              <span className={`font-display text-sm whitespace-nowrap ${tx.amount > 0 ? "text-success" : "text-destructive"}`}>
                {tx.amount > 0 ? "+" : ""}{tx.amount.toLocaleString()} UC
              </span>
            </motion.div>
          ))}
          {!isLoading && (!transactions || transactions.length === 0) && (
            <p className="text-sm text-muted-foreground text-center py-8">No transactions yet</p>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Transactions;
