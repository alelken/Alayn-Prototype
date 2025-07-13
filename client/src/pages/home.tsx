import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Globe, Brain, Video, Flower, Users, Lightbulb, Flame, Quote, User, X, Sparkle, Book } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDailyQuote } from "@/hooks/use-daily-quote";
import { motion, AnimatePresence } from "framer-motion";

const randomQuotes = [
  {
    quote: "The best way out is always through.",
    author: "Robert Frost",
    category: "Perseverance",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80"
  },
  {
    quote: "You are stronger than you think.",
    author: "Unknown",
    category: "Strength",
    image: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=800&q=80"
  },
  {
    quote: "Every day may not be good, but there is something good in every day.",
    author: "Alice Morse Earle",
    category: "Positivity",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80"
  },
  {
    quote: "Happiness is not by chance, but by choice.",
    author: "Jim Rohn",
    category: "Happiness",
    image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80"
  },
  {
    quote: "Start where you are. Use what you have. Do what you can.",
    author: "Arthur Ashe",
    category: "Motivation",
    image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=800&q=80"
  },
  {
    quote: "You don’t have to control your thoughts. You just have to stop letting them control you.",
    author: "Dan Millman",
    category: "Mindfulness",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
  },
  {
    quote: "The only journey is the journey within.",
    author: "Rainer Maria Rilke",
    category: "Self-Discovery",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80"
  },
  {
    quote: "Peace comes from within. Do not seek it without.",
    author: "Buddha",
    category: "Spirituality",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
  },
];

export default function Home() {
  const [userName] = useState("Priya");
  const [, setLocation] = useLocation();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  // Pick a random quote on first render and keep it stable
  const [selectedQuote] = useState(() => {
    return randomQuotes[Math.floor(Math.random() * randomQuotes.length)];
  });

  // Mock last activity (could be loaded from localStorage or user profile in real app)
  const lastActivity = {
    type: "exercise", // "workshop" | "media" | "exercise"
    label: "Mindful Breathing",
    section: "/exercises",
    description: "Continue your mindful breathing exercise.",
  };

  const { data: streak } = useQuery({
    queryKey: ["/api/user-progress/1/streak"],
  });

  const { data: personalityAnalysis } = useQuery({
    queryKey: ["/api/personality-analysis/user/1"],
  });

  const { data: exercises } = useQuery({
    queryKey: ["/api/exercises/user/1"],
  });

  const { data: dailyQuote } = useDailyQuote();

  const recommendedExercises: any[] = (exercises as any[])?.slice?.(0, 2) || [];

  return (
    <div className="min-h-screen bg-soft-gray">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-1">
            <img src="/icon.png" alt="App Icon" className="w-10 h-10 rounded-full object-cover bg-white p-1" />
            <h1 className="text-peacock text-xl font-bold">Alayn</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative touch-target" onClick={() => setLocation("/notifications") }>
              <Bell className="text-gray-600" size={24} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                2
              </span>
            </button>
            <button className="touch-target" onClick={() => setLocation("/profile") }>
              <User className="text-gray-600" size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Welcome Modal (fullscreen overlay) */}
      <AnimatePresence>
        {showWelcomeModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0">
              <img
                src={selectedQuote.image}
                alt="Quote Background"
                className="w-full h-full object-cover object-center"
                style={{ filter: 'brightness(0.7) blur(0px)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            </div>
            <button
              className="absolute top-6 right-6 z-10 bg-white bg-opacity-80 rounded-full p-2 hover:bg-opacity-100 transition"
              onClick={() => setShowWelcomeModal(false)}
              aria-label="Close"
            >
              <X className="text-gray-800" size={28} />
            </button>
            <motion.div
              className="relative z-10 flex flex-col items-center justify-center text-center px-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Quote className="text-white mb-4" size={36} />
              <p className="text-2xl md:text-3xl font-bold text-white mb-4 max-w-2xl drop-shadow-lg">
                "{selectedQuote.quote}"
              </p>
              <p className="text-lg text-white opacity-90 mb-2">— {selectedQuote.author}</p>
              <Badge className="bg-white bg-opacity-30 text-white hover:bg-opacity-40">
                {selectedQuote.category}
              </Badge>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.main className="pb-20 p-4 space-y-6" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        {/* Welcome Card */}
        <Card
          className="peacock-gradient text-white animate-fade-in relative overflow-hidden cursor-pointer"
          style={{ minHeight: 220 }}
          onClick={() => setShowWelcomeModal(true)}
        >
          {/* Background image with overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={selectedQuote.image}
              alt="Quote Background"
              className="w-full h-full object-cover object-center"
              style={{ filter: 'brightness(0.5) blur(1px)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          <CardContent className="p-6 relative z-10">
            <h2 className="text-2xl font-bold mb-2">Welcome, {userName}!</h2>
            <p className="text-lg opacity-90 mb-4">Message from your Spiritual Guide</p>
            {/* Random Quote */}
            <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
              <Quote className="text-white mb-2" size={20} />
              <p className="text-lg font-medium mb-2 leading-relaxed">
                "{selectedQuote.quote}"
              </p>
              <p className="text-sm opacity-80">
                — {selectedQuote.author}
              </p>
              <Badge className="mt-2 bg-white bg-opacity-30 text-white hover:bg-opacity-40">
                {selectedQuote.category}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Resume Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Resume</h3>
          <Card className="card-hover animate-fade-in">
            <CardContent className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">{lastActivity.label}</h4>
                <p className="text-sm text-gray-600 mb-2">{lastActivity.description}</p>
              </div>
              <Button className="button-peacock" onClick={() => setLocation(lastActivity.section)}>
                Resume
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Daily Tip */}
        <Card className="animate-fade-in">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800">Daily Tip</h3>
              <Lightbulb className="text-yellow-500" size={20} />
            </div>
            <p className="text-gray-600 leading-relaxed">
              Take 5 minutes today to practice deep breathing. Focus on your breath and let go of any tension.
            </p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
            <Link href="/personality-analysis">
              <motion.div whileHover={{ scale: 1.03, boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                <Card className="card-hover cursor-pointer animate-fade-in h-full flex flex-col justify-center items-center min-h-[160px]">
                  <CardContent className="flex flex-col items-center justify-center h-full min-h-[140px] px-4 py-6 gap-2">
                    <Sparkle className="text-peacock mb-1" size={32} />
                    <h4 className="font-semibold text-gray-800 text-center leading-tight">Self Analysis</h4>
                    <p className="text-sm text-gray-600 text-center">Discover yourself</p>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
            <Link href="/experts">
              <motion.div whileHover={{ scale: 1.03, boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                <Card className="card-hover cursor-pointer animate-fade-in h-full flex flex-col justify-center items-center min-h-[160px]">
                  <CardContent className="flex flex-col items-center justify-center h-full min-h-[140px] px-4 py-6 gap-2">
                    <Video className="text-peacock mb-1" size={32} />
                    <h4 className="font-semibold text-gray-800 text-center leading-tight">Experts at Service</h4>
                    <p className="text-sm text-gray-600 text-center">Connect with top therapists</p>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
            <Link href="/exercises">
              <motion.div whileHover={{ scale: 1.03, boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                <Card className="card-hover cursor-pointer animate-fade-in h-full flex flex-col justify-center items-center min-h-[160px]">
                  <CardContent className="flex flex-col items-center justify-center h-full min-h-[140px] px-4 py-6 gap-2">
                    <Flower className="text-peacock mb-1" size={32} />
                    <h4 className="font-semibold text-gray-800 text-center leading-tight">Mindful Exercises</h4>
                    <p className="text-sm text-gray-600 text-center">Practice mindfulness</p>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
            <Link href="/library">
              <motion.div whileHover={{ scale: 1.03, boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                <Card className="card-hover cursor-pointer animate-fade-in h-full flex flex-col justify-center items-center min-h-[160px]">
                  <CardContent className="flex flex-col items-center justify-center h-full min-h-[140px] px-4 py-6 gap-2">
                    <Book className="text-peacock mb-1" size={32} />
                    <h4 className="font-semibold text-gray-800 text-center leading-tight">Media Library</h4>
                    <p className="text-sm text-gray-600 text-center">Podcasts, stories & more</p>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          </div>
        </div>

        {/* Personalized Recommendations */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Recommended for You</h3>
          <div className="space-y-3">
            {recommendedExercises.map((exercise: any) => (
              <Card key={exercise.id} className="animate-fade-in">
                <div className="relative">
                  <img 
                    src={exercise.imageUrl} 
                    alt={exercise.title}
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 rounded-t-lg flex items-center justify-center">
                    <Button size="lg" className="bg-white bg-opacity-90 text-peacock hover:bg-opacity-100">
                      <span className="ml-1">Start</span>
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-gray-800">{exercise.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{exercise.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-peacock text-sm font-medium">{exercise.duration} min</span>
                    <Badge variant="secondary" className="text-xs">
                      {exercise.difficulty}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Progress Tracker */}
        <Card className="animate-fade-in">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Progress</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-peacock rounded-full flex items-center justify-center">
                    <Flame className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Meditation Streak</p>
                    <p className="text-sm text-gray-600">{(streak as any)?.streak || 0} days in a row</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-peacock">{(streak as any)?.streak || 0}</p>
                  <p className="text-sm text-gray-600">days</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div 
                  className="bg-peacock h-2 rounded-full transition-all duration-300" 
                  initial={{ width: 0 }} 
                  animate={{ width: `${Math.min(((((streak as any)?.streak || 0) / 10) * 100), 100)}%` }} 
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.main>
    </div>
  );
}
