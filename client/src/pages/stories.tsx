import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Video } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VideoPlayer } from "@/components/ui/video-player";
import { motion } from "framer-motion";
import { useCapacitorBack } from "@/hooks/use-capacitor-back";

type Story = {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: number;
  contentUrl: string;
};

const sampleStories: Story[] = [
  {
    id: 1,
    title: "The Journey Within",
    description: "A story about self-discovery and inner peace.",
    thumbnailUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    duration: 8,
    contentUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },
  {
    id: 2,
    title: "Finding Balance",
    description: "Learn how to balance work and personal life.",
    thumbnailUrl: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
    duration: 12,
    contentUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },
  {
    id: 3,
    title: "Mindful Moments",
    description: "Short stories for daily mindfulness practice.",
    thumbnailUrl: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=800&q=80",
    duration: 6,
    contentUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  }
];

export default function Stories() {
  const [search, setSearch] = useState("");
  const [, setLocation] = useLocation();
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  
  // Use the centralized back button hook
  useCapacitorBack();
  
  const filtered = sampleStories.filter(
    (s: Story) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="min-h-screen bg-soft-gray">
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-bold text-gray-800">Stories</h2>
        </div>
      </header>
      <main className="p-4 space-y-4">
        <input
          type="text"
          placeholder="Search stories..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-peacock"
        />
        <motion.div className="main-content" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((story, idx) => (
              <motion.div key={story.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                <Card key={story.id} className="animate-fade-in card-hover">
                  <CardContent className="p-4 flex flex-col items-center">
                    <div className="w-full h-40 rounded-xl overflow-hidden bg-peacock bg-opacity-10 flex items-center justify-center mb-2 relative">
                      <img src={story.thumbnailUrl} alt={story.title} className="w-full h-full object-cover" />
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 rounded-full p-2">
                        <Video className="text-white" size={20} />
                      </div>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1 text-center flex items-center justify-center gap-2">{story.title}</h4>
                    <p className="text-sm text-gray-600 mb-2 text-center">{story.description}</p>
                    <span className="text-xs text-gray-500">{story.duration} min</span>
                    <Button className="button-peacock mt-2" size="icon" onClick={() => setSelectedStory(story)}><Play size={20} /></Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
      {/* Video Player Dialog */}
      {selectedStory && (
        <Dialog open={!!selectedStory} onOpenChange={() => setSelectedStory(null)}>
          <DialogContent className="max-w-4xl p-0">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle>{selectedStory.title}</DialogTitle>
            </DialogHeader>
            <div className="px-6 pb-6">
              <VideoPlayer
                src={selectedStory.contentUrl}
                poster={selectedStory.thumbnailUrl}
                title={selectedStory.title}
              />
              <div className="mt-4">
                <p className="text-gray-600 mb-2">{selectedStory.description}</p>
                <span className="text-xs text-gray-500">{selectedStory.duration} min</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 