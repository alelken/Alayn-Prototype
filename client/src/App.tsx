import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import SplashScreen from "@/components/ui/splash-screen";
import Home from "@/pages/home";
import PersonalityAnalysis from "@/pages/personality-analysis";
import Therapy from "@/pages/therapy";
import Booking from "@/pages/booking";
import VideoCall from "@/pages/video-call";
import Workshops from "@/pages/workshops";
import Exercises from "@/pages/exercises";
import Library from "@/pages/library";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";
import BottomNavigation from "@/components/ui/bottom-navigation";
import { useLocation } from "wouter";
import Notifications from "@/pages/notifications";
import Podcasts from "@/pages/podcasts";
import Stories from "@/pages/stories";
import Articles from "@/pages/articles";
import Experts from "@/pages/experts";

function Router() {
  const [location] = useLocation();
  const [showSplash, setShowSplash] = useState(true);
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    name: "Priya",
    email: "priya.sharma@email.com",
    subscriptionTier: "premium",
    language: "en",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  const isVideoCall = location === "/video-call";
  const hideBottomNav = isVideoCall;

  return (
    <div className="mobile-container">
      <div className="min-h-screen bg-soft-gray">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/personality-analysis" component={PersonalityAnalysis} />
          <Route path="/therapy" component={Therapy} />
          <Route path="/booking/:therapistId" component={Booking} />
          <Route path="/video-call" component={VideoCall} />
          <Route path="/workshops" component={Workshops} />
          <Route path="/exercises" component={Exercises} />
          <Route path="/library" component={Library} />
          <Route path="/profile" component={Profile} />
          <Route path="/notifications" component={Notifications} />
          <Route path="/podcasts" component={Podcasts} />
          <Route path="/stories" component={Stories} />
          <Route path="/articles" component={Articles} />
          <Route path="/experts" component={Experts} />
          <Route component={NotFound} />
        </Switch>
        
        {!hideBottomNav && <BottomNavigation />}
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
