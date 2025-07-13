import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useTherapists(filters?: {
  search?: string;
  specialty?: string;
  language?: string;
}) {
  const queryParams = new URLSearchParams();
  if (filters?.search) queryParams.append("search", filters.search);
  if (filters?.specialty) queryParams.append("specialty", filters.specialty);
  if (filters?.language) queryParams.append("language", filters.language);

  return useQuery({
    queryKey: ["/api/therapists", queryParams.toString()],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useTherapist(id: number) {
  return useQuery({
    queryKey: ["/api/therapists", id],
    enabled: !!id,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (bookingData: {
      userId: number;
      therapistId: number;
      scheduledAt: string;
      fee: number;
      platformFee: number;
      status?: string;
    }) => {
      const response = await apiRequest("POST", "/api/bookings", bookingData);
      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ["/api/bookings/user", variables.userId] 
      });
      toast({
        title: "Booking Confirmed",
        description: "Your therapy session has been booked successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: "Failed to book session. Please try again.",
        variant: "destructive",
      });
    },
  });
}

export function useUserBookings(userId: number) {
  return useQuery({
    queryKey: ["/api/bookings/user", userId],
    enabled: !!userId,
  });
}
