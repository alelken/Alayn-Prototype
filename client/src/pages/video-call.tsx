import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Video, VideoOff, Phone, MessageSquare, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useCapacitorBack } from "@/hooks/use-capacitor-back";

export default function VideoCall() {
  const [, setLocation] = useLocation();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

  // Use the centralized back button hook
  useCapacitorBack();

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setLocation("/");
  };

  return (
    <motion.div className="relative h-screen bg-gray-900 overflow-hidden" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      {/* Main video (therapist) */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600"
          alt="Therapist in video call"
          className="w-full h-full object-cover"
        />
        
        {/* Encrypted indicator */}
        <div className="absolute top-4 left-4">
          <Badge className="bg-black bg-opacity-70 text-white border-none">
            <Shield className="mr-1" size={12} />
            Encrypted
          </Badge>
        </div>
        
        {/* Call duration */}
        <div className="absolute top-4 right-4">
          <Badge className="bg-black bg-opacity-70 text-white border-none">
            {formatDuration(callDuration)}
          </Badge>
        </div>
      </div>

      {/* User video (PIP) */}
      <div className="absolute top-4 right-4 w-24 h-32 bg-gray-700 rounded-xl overflow-hidden border-2 border-white shadow-lg z-10">
        <img
          src="https://images.unsplash.com/photo-1494790108755-2616b9531d4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=200"
          alt="User in video call"
          className="w-full h-full object-cover"
        />
        {!isVideoOn && (
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
            <VideoOff className="text-white" size={20} />
          </div>
        )}
      </div>

      {/* Call controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center space-x-6 bg-black bg-opacity-70 p-4 rounded-full backdrop-blur-sm">
          <Button
            size="lg"
            variant="ghost"
            className={cn(
              "w-12 h-12 rounded-full touch-target transition-colors",
              isMuted ? "bg-red-600 hover:bg-red-500" : "bg-gray-600 hover:bg-gray-500"
            )}
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <MicOff className="text-white" size={20} /> : <Mic className="text-white" size={20} />}
          </Button>
          
          <Button
            size="lg"
            variant="ghost"
            className={cn(
              "w-12 h-12 rounded-full touch-target transition-colors",
              !isVideoOn ? "bg-red-600 hover:bg-red-500" : "bg-gray-600 hover:bg-gray-500"
            )}
            onClick={() => setIsVideoOn(!isVideoOn)}
          >
            {isVideoOn ? <Video className="text-white" size={20} /> : <VideoOff className="text-white" size={20} />}
          </Button>
          
          <Button
            size="lg"
            variant="ghost"
            className="w-12 h-12 bg-red-600 hover:bg-red-500 rounded-full touch-target transition-colors"
            onClick={handleEndCall}
          >
            <Phone className="text-white" size={20} />
          </Button>
          
          <Button
            size="lg"
            variant="ghost"
            className="w-12 h-12 bg-gray-600 hover:bg-gray-500 rounded-full touch-target transition-colors"
          >
            <MessageSquare className="text-white" size={20} />
          </Button>
        </div>
      </div>

      {/* Session info overlay */}
      <div className="absolute bottom-24 left-4 right-4 z-10">
        <div className="bg-black bg-opacity-50 rounded-lg p-3 text-white text-center">
          <p className="text-sm">Session with Dr. Meera Sharma</p>
          <p className="text-xs opacity-80">Mental Health Consultation</p>
        </div>
      </div>
    </motion.div>
  );
}
