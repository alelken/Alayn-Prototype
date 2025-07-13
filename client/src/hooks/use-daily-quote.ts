import { useQuery } from "@tanstack/react-query";

export function useDailyQuote() {
  return useQuery({
    queryKey: ["/api/daily-quote"],
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}