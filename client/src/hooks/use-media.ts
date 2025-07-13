import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export function useMediaContent(filters?: {
  type?: string;
  category?: string;
}) {
  const queryParams = new URLSearchParams();
  if (filters?.type) queryParams.append("type", filters.type);
  if (filters?.category) queryParams.append("category", filters.category);

  return useQuery({
    queryKey: ["/api/media", queryParams.toString()],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useMediaItem(id: number) {
  return useQuery({
    queryKey: ["/api/media", id],
    enabled: !!id,
  });
}

export function usePlayMedia() {
  const { toast } = useToast();

  return {
    playContent: (content: any) => {
      if (content.isPremium) {
        toast({
          title: "Premium Content",
          description: "Upgrade to premium to access this content.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Playing Content",
        description: `Now playing: ${content.title}`,
      });
    },
  };
}
