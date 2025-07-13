import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Headphones } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { useCapacitorBack } from "@/hooks/use-capacitor-back";

type Podcast = {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: number;
  language: string;
  contentUrl: string;
};

const samplePodcasts: Podcast[] = [
  {
    id: 1,
    title: "Mindful Living",
    description: "Explore mindfulness techniques for daily life.",
    thumbnailUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    duration: 12,
    language: "en",
    contentUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "Stress Less",
    description: "Tips and tricks to manage stress effectively.",
    thumbnailUrl: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
    duration: 18,
    language: "en",
    contentUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "The Power of Gratitude",
    description: "How gratitude can change your life.",
    thumbnailUrl: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=800&q=80",
    duration: 15,
    language: "en",
    contentUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

export default function Podcasts() {
  const [search, setSearch] = useState("");
  const [, setLocation] = useLocation();
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);
  
  // Use the centralized back button hook
  useCapacitorBack();
  
  const filtered = samplePodcasts.filter(
    (p: Podcast) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="min-h-screen bg-soft-gray">
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-bold text-gray-800">Podcasts</h2>
        </div>
      </header>
      <main className="p-4 space-y-4">
        <input
          type="text"
          placeholder="Search podcasts..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-peacock"
        />
        <motion.div className="main-content" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((podcast: Podcast, idx: number) => (
              <motion.div key={podcast.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                <Card key={podcast.id} className="animate-fade-in card-hover">
                  <CardContent className="p-4 flex flex-col items-center">
                    <div className="w-full h-40 rounded-xl overflow-hidden bg-peacock bg-opacity-10 flex items-center justify-center mb-2 relative">
                      <img src={podcast.thumbnailUrl} alt={podcast.title} className="w-full h-full object-cover" />
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 rounded-full p-2">
                        <Headphones className="text-white" size={20} />
                      </div>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1 text-center flex items-center justify-center gap-2">{podcast.title}</h4>
                    <p className="text-sm text-gray-600 mb-2 text-center">{podcast.description}</p>
                    <span className="text-xs text-gray-500">{podcast.duration} min</span>
                    <Button className="button-peacock mt-2" size="icon" onClick={() => setSelectedPodcast({ ...podcast, contentUrl: podcast.contentUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' })}><Play size={20} /></Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
      {/* Audio Player Dialog */}
      {selectedPodcast && (
        <Dialog open={!!selectedPodcast} onOpenChange={() => setSelectedPodcast(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedPodcast.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-600">{selectedPodcast.description}</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <audio controls className="w-full">
                  <source src={selectedPodcast.contentUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">{selectedPodcast.duration} min</span>
                <span className="text-xs text-gray-500">{selectedPodcast.language === "en" ? "English" : selectedPodcast.language}</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 