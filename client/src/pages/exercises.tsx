import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, Clock, Signal, Play, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useCapacitorBack } from "@/hooks/use-capacitor-back";

const categoryFilters = [
  "Yoga",
  "Addiction",
  "Introvertedness",
  "Career Guidance",
  "Relationship Guidance",
  "Parenting",
  "Spiritual Guidance",
  "Stress Management",
  "Pink Feature"
];

export default function Exercises() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("Yoga");
  const [exercises, setExercises] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Use the centralized back button hook
  useCapacitorBack();

  useEffect(() => {
    async function fetchExercises() {
      setIsLoading(true);
      const querySnapshot = await getDocs(collection(db, "exercises"));
      const allExercises = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setExercises(
        (allExercises as any[]).filter((ex: any) => ex.category?.toLowerCase() === selectedCategory.toLowerCase())
      );
      setIsLoading(false);
    }
    fetchExercises();
  }, [selectedCategory]);

  const startExerciseMutation = useMutation({
    mutationFn: async (exerciseId: number) => {
      const response = await apiRequest("POST", "/api/user-progress", {
        userId: 1,
        exerciseId: exerciseId,
        duration: 0,
        streakCount: 1,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Exercise Started",
        description: "Great job! Keep up the good work!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user-progress/1/streak"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to start exercise. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleStartExercise = (exercise: any) => {
    if (exercise.isPremium) {
      toast({
        title: "Premium Feature",
        description: "Upgrade to premium to access this exercise.",
        variant: "destructive",
      });
      return;
    }
    startExerciseMutation.mutate(exercise.id);
  };

  const getRatingStars = (rating: number) => {
    return (rating / 10).toFixed(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-soft-gray flex items-center justify-center">
        <div className="loading-spinner w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-gray">
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/")}
            className="text-peacock"
          >
            <ArrowLeft size={20} />
          </Button>
          <h2 className="text-xl font-bold text-gray-800">Mindful Exercises</h2>
          <div></div>
        </div>
      </header>

      <main className="pb-20 p-4 space-y-6">
        {/* Categories */}
        <div className="flex space-x-3 overflow-x-auto pb-2 hide-scrollbar">
          {categoryFilters.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "secondary"}
              size="sm"
              className={cn(
                "whitespace-nowrap transition-all",
                selectedCategory === category ? "button-peacock" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Exercise Cards */}
        <div className="space-y-4">
          {exercises?.map((exercise, index) => (
            <motion.div key={exercise.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card key={exercise.id} className="animate-fade-in card-hover">
                <div className="relative">
                  <img
                    src={exercise.imageUrl}
                    alt={exercise.title}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 rounded-t-lg flex items-center justify-center">
                    <Button
                      size="lg"
                      className="bg-white bg-opacity-90 text-peacock hover:bg-opacity-100"
                      onClick={() => handleStartExercise(exercise)}
                      disabled={startExerciseMutation.isPending}
                    >
                      <Play className="mr-1" size={20} />
                      Start
                    </Button>
                  </div>
                  {exercise.isPremium && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-yellow-500 text-white border-none">
                        <Crown className="mr-1" size={12} />
                        Premium
                      </Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800">{exercise.title}</h4>
                    <div className="flex items-center space-x-1">
                      <Heart className="text-red-500 fill-current" size={16} />
                      <span className="text-sm text-gray-600">{getRatingStars(exercise.rating)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{exercise.description}</p>
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-1">
                      <Clock className="text-peacock" size={16} />
                      <span className="text-sm text-gray-600">{exercise.duration} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Signal className="text-peacock" size={16} />
                      <span className="text-sm text-gray-600 capitalize">{exercise.difficulty}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {exercise.isPremium ? (
                        <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                          <Crown className="mr-1" size={12} />
                          Premium
                        </Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          Free
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-xs bg-peacock-light bg-opacity-20 text-peacock">
                        {exercise.category}
                      </Badge>
                    </div>
                    <Button
                      className="button-peacock"
                      onClick={() => handleStartExercise(exercise)}
                      disabled={startExerciseMutation.isPending}
                    >
                      <Play className="mr-1" size={16} />
                      {startExerciseMutation.isPending ? "Starting..." : "Start"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {exercises?.length === 0 && (
          <Card className="animate-fade-in">
            <CardContent className="p-8 text-center">
              <div className="text-gray-400 text-4xl mb-4">🧘‍♀️</div>
              <p className="text-gray-600">No exercises found in this category</p>
              <p className="text-sm text-gray-500 mt-2">Try selecting a different category</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
