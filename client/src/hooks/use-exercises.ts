import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useExercises(filters?: {
  category?: string;
  userId?: number;
}) {
  const queryParams = new URLSearchParams();
  if (filters?.category) queryParams.append("category", filters.category);
  if (filters?.userId) queryParams.append("userId", filters.userId.toString());

  return useQuery({
    queryKey: ["/api/exercises", queryParams.toString()],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useExercise(id: number) {
  return useQuery({
    queryKey: ["/api/exercises", id],
    enabled: !!id,
  });
}

export function useCreateUserProgress() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (progressData: {
      userId: number;
      exerciseId?: number;
      mediaId?: number;
      duration?: number;
      streakCount?: number;
    }) => {
      const response = await apiRequest("POST", "/api/user-progress", progressData);
      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ["/api/user-progress", variables.userId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ["/api/user-progress", variables.userId, "streak"] 
      });
      toast({
        title: "Progress Updated",
        description: "Great job! Keep up the good work!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
    },
  });
}

export function useUserProgress(userId: number) {
  return useQuery({
    queryKey: ["/api/user-progress", userId],
    enabled: !!userId,
  });
}

export function useUserStreak(userId: number) {
  return useQuery({
    queryKey: ["/api/user-progress", userId, "streak"],
    enabled: !!userId,
  });
}
