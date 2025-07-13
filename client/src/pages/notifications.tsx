import { Card, CardContent } from "@/components/ui/card";
import { Bell, CheckCircle, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useCapacitorBack } from "@/hooks/use-capacitor-back";

const sampleNotifications = [
  {
    id: 1,
    type: "success",
    title: "Session Booked",
    message: "Your therapy session with Dr. Priya Sharma is confirmed for tomorrow at 10:00 AM.",
    time: "2 hours ago"
  },
  {
    id: 2,
    type: "info",
    title: "New Podcast Available",
    message: "Listen to our latest podcast on Mindful Living.",
    time: "5 hours ago"
  },
  {
    id: 3,
    type: "warning",
    title: "Subscription Expiring Soon",
    message: "Your premium subscription will expire in 3 days. Renew to keep enjoying all features.",
    time: "1 day ago"
  },
];

function getIcon(type: string) {
  if (type === "success") return <CheckCircle className="text-green-500" size={24} />;
  if (type === "warning") return <AlertTriangle className="text-yellow-500" size={24} />;
  return <Bell className="text-peacock" size={24} />;
}

export default function Notifications() {
  // Use the centralized back button hook
  useCapacitorBack();

  return (
    <div className="min-h-screen bg-soft-gray">
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
        </div>
      </header>
      <main className="p-4 space-y-4">
        <motion.div className="main-content" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {sampleNotifications.map((n, idx) => (
            <motion.div key={n.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <Card key={n.id} className="animate-fade-in">
                <CardContent className="flex items-center gap-4 p-4">
                  <div>{getIcon(n.type)}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">{n.title}</h4>
                    <p className="text-sm text-gray-600 mb-1">{n.message}</p>
                    <span className="text-xs text-gray-400">{n.time}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
} 