import { useLocation } from "wouter";
import { Link } from "wouter";
import { Home, Video, Flower, Book, Sparkle } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/therapy", icon: Video, label: "Therapy" },
  { path: "/exercises", icon: Flower, label: "Exercises" },
  { path: "/library", icon: Book, label: "Library" },
  { path: "/personality-analysis", icon: Sparkle, label: "Analysis" },
];

export default function BottomNavigation() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 max-w-sm w-full bg-white border-t border-gray-200 z-30 no-print">
      <div className="flex justify-around py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <Link key={item.path} href={item.path}>
              <button
                className={cn(
                  "flex flex-col items-center space-y-1 touch-target transition-colors",
                  isActive ? "text-peacock" : "text-gray-600"
                )}
              >
                <Icon size={24} />
                <span className="text-xs">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
