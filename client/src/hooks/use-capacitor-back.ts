import { useEffect } from "react";
import { useLocation } from "wouter";

// Define root pages where app should close on back button
const ROOT_PAGES = ["/", "/home"];

// Define navigation hierarchy for back button
const BACK_NAVIGATION_MAP: Record<string, string> = {
  "/podcasts": "/library",
  "/stories": "/library", 
  "/articles": "/library",
  "/exercises": "/",
  "/experts": "/",
  "/therapy": "/",
  "/booking": "/therapy",
  "/video-call": "/",
  "/profile": "/",
  "/notifications": "/",
  "/personality-analysis": "/",
  "/workshops": "/",
  "/library": "/"
};

export function useCapacitorBack() {
  const [currentLocation, setLocation] = useLocation();

  useEffect(() => {
    // Only handle back button on mobile/Capacitor
    if (typeof window === "undefined") {
      return;
    }

    // Check if Capacitor is available
    const capacitor = (window as any).Capacitor;
    if (!capacitor || !capacitor.Plugins || !capacitor.Plugins.App) {
      return;
    }

    const handleBackButton = () => {
      // If on a root page, let the app close (default behavior)
      if (ROOT_PAGES.includes(currentLocation)) {
        return;
      }

      // Get the target page for back navigation
      const targetPage = BACK_NAVIGATION_MAP[currentLocation];
      
      if (targetPage) {
        setLocation(targetPage);
      } else {
        // Fallback: go to home
        setLocation("/");
      }
    };

    const App = capacitor.Plugins.App;
    const handler = App.addListener('backButton', handleBackButton);
    return () => handler.remove();
  }, [currentLocation, setLocation]);
} 