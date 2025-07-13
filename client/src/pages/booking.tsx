import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Calendar, Clock, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { useCapacitorBack } from "@/hooks/use-capacitor-back";

const timeSlots = [
  "09:00 AM", "10:30 AM", "02:00 PM", "04:00 PM", "05:30 PM", "07:00 PM"
];

const dates = Array.from({ length: 14 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() + i);
  return date;
});

export default function Booking() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/booking/:therapistId");
  const therapistId = params?.therapistId ? params.therapistId : null;
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [therapist, setTherapist] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use the centralized back button hook
  useCapacitorBack();

  useEffect(() => {
    async function fetchTherapist() {
      if (!therapistId) return;
      setIsLoading(true);
      const docRef = doc(db, "therapists", therapistId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTherapist({ id: docSnap.id, ...docSnap.data() });
      } else {
        setTherapist(null);
      }
      setIsLoading(false);
    }
    fetchTherapist();
  }, [therapistId]);

  const bookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      const response = await apiRequest("POST", "/api/bookings", bookingData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking Confirmed",
        description: "Your therapy session has been booked successfully!",
      });
      setLocation("/video-call");
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: "Failed to book session. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select both date and time for your session.",
        variant: "destructive",
      });
      return;
    }

    const scheduledDateTime = new Date(selectedDate);
    const [time, period] = selectedTime.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    const adjustedHours = period === "PM" && hours !== 12 ? hours + 12 : hours;
    
    scheduledDateTime.setHours(adjustedHours, minutes, 0, 0);

    const platformFee = therapist ? Math.round(therapist.feePerSession * 0.1) : 0;
    const totalFee = therapist ? therapist.feePerSession + platformFee : 0;

    bookingMutation.mutate({
      userId: 1,
      therapistId: therapistId,
      scheduledAt: scheduledDateTime.toISOString(),
      fee: totalFee,
      platformFee: platformFee,
      status: "scheduled",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-soft-gray flex items-center justify-center">
        <div className="loading-spinner w-8 h-8" />
      </div>
    );
  }

  if (!therapist) {
    return (
      <div className="min-h-screen bg-soft-gray flex items-center justify-center">
        <p className="text-gray-600">Therapist not found</p>
      </div>
    );
  }

  const platformFee = therapist ? Math.round(therapist.feePerSession * 0.1) : 0;
  const totalFee = therapist ? therapist.feePerSession + platformFee : 0;

  return (
    <div className="min-h-screen bg-soft-gray">
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/therapy")}
            className="text-peacock"
          >
            <ArrowLeft size={20} />
          </Button>
          <h2 className="text-xl font-bold text-gray-800">Book Session</h2>
          <div></div>
        </div>
      </header>

      <main className="pb-20 p-4 space-y-6">
        {/* Therapist Info */}
        <Card className="animate-fade-in">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={therapist.imageUrl} alt={therapist.name} />
                <AvatarFallback>{therapist.name.split(' ').map((n: any) => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-gray-800">{therapist.name}</h3>
                <p className="text-sm text-gray-600">Clinical Psychologist</p>
                <div className="flex items-center space-x-1 mt-1">
                  <Star className="text-yellow-500 fill-current" size={16} />
                  <span className="text-sm text-gray-600">{(therapist.rating / 10).toFixed(1)} (127 reviews)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date Selection */}
        <Card className="animate-fade-in">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-800 mb-4">Select Date</h3>
            <div className="grid grid-cols-7 gap-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="text-center text-sm text-gray-600 py-2 font-medium">
                  {day}
                </div>
              ))}
              {dates.map((date, index) => {
                const isSelected = selectedDate?.toDateString() === date.toDateString();
                const isToday = date.toDateString() === new Date().toDateString();
                const isPast = date < new Date();
                
                return (
                  <Button
                    key={index}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "h-10 text-sm transition-all",
                      isSelected && "button-peacock",
                      isToday && !isSelected && "border-peacock text-peacock",
                      isPast && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={() => !isPast && setSelectedDate(date)}
                    disabled={isPast}
                  >
                    {date.getDate()}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Time Selection */}
        <Card className="animate-fade-in">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-800 mb-4">Available Times</h3>
            <div className="grid grid-cols-3 gap-3">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "transition-all",
                    selectedTime === time && "button-peacock"
                  )}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Session Details */}
        <Card className="animate-fade-in">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-800 mb-4">Session Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Date & Time</span>
                <span className="text-gray-800 font-medium">
                  {selectedDate && selectedTime 
                    ? `${selectedDate.toLocaleDateString()} at ${selectedTime}`
                    : "Please select date and time"
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration</span>
                <span className="text-gray-800 font-medium">50 minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Session Fee</span>
                <span className="text-gray-800 font-medium">₹{(therapist.feePerSession / 100).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Platform Fee</span>
                <span className="text-gray-800 font-medium">₹{(platformFee / 100).toLocaleString()}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-gray-800 font-semibold">Total</span>
                  <span className="text-peacock font-bold text-lg">₹{(totalFee / 100).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Book Button */}
        <Button
          className="w-full button-peacock text-lg py-4"
          onClick={handleBooking}
          disabled={!selectedDate || !selectedTime || bookingMutation.isPending}
        >
          {bookingMutation.isPending ? "Booking..." : "Confirm & Pay"}
        </Button>
      </main>
    </div>
  );
}
