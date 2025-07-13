import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, Users, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useCapacitorBack } from "@/hooks/use-capacitor-back";

export default function Workshops() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Use the centralized back button hook
  useCapacitorBack();

  const { data: workshopsData = [] } = useQuery<any[]>({
    queryKey: ["/api/workshops"],
  });

  const { data: userWorkshops = [] } = useQuery<any[]>({
    queryKey: ["/api/workshop-bookings/user/1"],
  });

  const bookWorkshopMutation = useMutation({
    mutationFn: async (workshopId: number) => {
      const response = await apiRequest("POST", "/api/workshop-bookings", {
        userId: 1,
        workshopId: workshopId,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Workshop Booked",
        description: "You have successfully joined the workshop!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/workshops"] });
      queryClient.invalidateQueries({ queryKey: ["/api/workshop-bookings/user/1"] });
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: "Failed to book workshop. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleJoinWorkshop = (workshopId: number) => {
    bookWorkshopMutation.mutate(workshopId);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
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
          <h2 className="text-xl font-bold text-gray-800">Workshops</h2>
          <div></div>
        </div>
      </header>

      <main className="pb-20 p-4 space-y-6">
        {/* Upcoming Workshops */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Upcoming Workshops</h3>
          
          {workshopsData?.map((workshop, index) => (
            <motion.div key={workshop.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card key={workshop.id} className="animate-fade-in card-hover">
                <div className="relative">
                  <img
                    src={workshop.imageUrl}
                    alt={workshop.title}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-black bg-opacity-70 text-white border-none">
                      <Users className="mr-1" size={12} />
                      {workshop.currentParticipants}/{workshop.maxParticipants}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800">{workshop.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{workshop.description}</p>
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="text-peacock" size={16} />
                      <span className="text-sm text-gray-600">{formatDate(workshop.scheduledAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="text-peacock" size={16} />
                      <span className="text-sm text-gray-600">{formatTime(workshop.scheduledAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge variant="secondary" className="text-xs bg-peacock-light bg-opacity-20 text-peacock">
                      {workshop.duration} min
                    </Badge>
                    <Badge variant="secondary" className="text-xs bg-peacock-light bg-opacity-20 text-peacock">
                      {workshop.category}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-peacock font-bold text-lg">₹{(workshop.fee / 100).toLocaleString()}</span>
                    <Button
                      className="button-peacock"
                      onClick={() => handleJoinWorkshop(workshop.id)}
                      disabled={bookWorkshopMutation.isPending || workshop.currentParticipants >= workshop.maxParticipants}
                    >
                      {workshop.currentParticipants >= workshop.maxParticipants ? "Full" : "Join Workshop"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* My Workshops */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">My Workshops</h3>
          {userWorkshops?.length === 0 ? (
            <Card className="animate-fade-in">
              <CardContent className="p-8 text-center">
                <div className="text-gray-400 text-4xl mb-4">📅</div>
                <p className="text-gray-600">No workshops registered yet</p>
                <p className="text-sm text-gray-500 mt-2">Join a workshop to get started with your mental health journey</p>
              </CardContent>
            </Card>
          ) : (
            userWorkshops?.map((booking, index) => {
              const workshop = workshopsData?.find(w => w.id === booking.workshopId);
              if (!workshop) return null;

              return (
                <motion.div key={booking.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                  <Card key={booking.id} className="animate-fade-in">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{workshop.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{workshop.description}</p>
                          <div className="flex items-center space-x-4 mt-3">
                            <div className="flex items-center space-x-1">
                              <Calendar className="text-peacock" size={16} />
                              <span className="text-sm text-gray-600">{formatDate(workshop.scheduledAt)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="text-peacock" size={16} />
                              <span className="text-sm text-gray-600">{formatTime(workshop.scheduledAt)}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                          Registered
                        </Badge>
                      </div>
                      <Button className="w-full mt-4 button-peacock" variant="outline">
                        Join Session
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
