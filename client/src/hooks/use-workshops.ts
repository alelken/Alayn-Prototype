import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useWorkshops() {
  return useQuery({
    queryKey: ["/api/workshops"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useWorkshop(id: number) {
  return useQuery({
    queryKey: ["/api/workshops", id],
    enabled: !!id,
  });
}

export function useCreateWorkshopBooking() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (bookingData: {
      userId: number;
      workshopId: number;
    }) => {
      const response = await apiRequest("POST", "/api/workshop-bookings", bookingData);
      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/workshops"] });
      queryClient.invalidateQueries({ 
        queryKey: ["/api/workshop-bookings/user", variables.userId] 
      });
      toast({
        title: "Workshop Booked",
        description: "You have successfully joined the workshop!",
      });
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: "Failed to book workshop. Please try again.",
        variant: "destructive",
      });
    },
  });
}

export function useUserWorkshops(userId: number) {
  return useQuery({
    queryKey: ["/api/workshop-bookings/user", userId],
    enabled: !!userId,
  });
}
