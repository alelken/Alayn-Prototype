import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function usePersonalityQuestions() {
  return useQuery({
    queryKey: ["/api/personality-analysis/questions"],
    staleTime: Infinity,
  });
}

export function usePersonalityAnalysis(userId: number) {
  return useQuery({
    queryKey: ["/api/personality-analysis/user", userId],
    enabled: !!userId,
  });
}

export function useCreatePersonalityAnalysis() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { userId: number; responses: Record<number, number> }) => {
      const response = await apiRequest("POST", "/api/personality-analysis", data);
      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ["/api/personality-analysis/user", variables.userId] 
      });
      toast({
        title: "Analysis Complete",
        description: "Your personality analysis has been completed successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: "Failed to complete personality analysis. Please try again.",
        variant: "destructive",
      });
    },
  });
}
