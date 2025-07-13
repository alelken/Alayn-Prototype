import { useState, useEffect, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Search, Play, BookOpen, Headphones, Video, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { VideoPlayer } from "@/components/ui/video-player";
import { motion } from "framer-motion";
import { useCapacitorBack } from "@/hooks/use-capacitor-back";

export default function Library() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const { toast } = useToast();

  // Use the centralized back button hook
  useCapacitorBack();

  // Map UI filter to backend type
  const typeMap: Record<string, string> = {
    Stories: "video",
    Podcasts: "audio",
    Articles: "article"
  };
  // Use the new sampleMediaContent directly
  const [mediaContent, setMediaContent] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedContent, setSelectedContent] = useState<any>(null);

  useEffect(() => {
    const fetchMediaContent = async () => {
      try {
        setIsLoading(true);
        const mediaCollectionRef = collection(db, "media");
        const snapshot = await getDocs(mediaCollectionRef);
        const fetchedContent = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMediaContent(fetchedContent);
      } catch (error) {
        toast({
          title: "Error fetching media",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMediaContent();
  }, [toast]);

  const handlePlayContent = (content: any) => {
    if (content.isPremium) {
      toast({
        title: "Premium Content",
        description: "Upgrade to premium to access this content.",
        variant: "destructive",
      });
      return;
    }
    setSelectedContent(content);
  };

  const getOverlayIcon = (type: string) => {
    if (type === "audio") return <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 rounded-full p-2"><Headphones className="text-white" size={20} /></div>;
    if (type === "video") return <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 rounded-full p-2"><Video className="text-white" size={20} /></div>;
    if (type === "article") return <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 rounded-full p-2"><BookOpen className="text-white" size={20} /></div>;
    return null;
  };

  // Memoize filtered content to avoid unnecessary re-renders
  const filteredContent = useMemo(() =>
    mediaContent?.filter((content: any) =>
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [mediaContent, searchQuery]
  );
  const podcasts = filteredContent.filter(c => c.type === "audio");
  const stories = filteredContent.filter(c => c.type === "video");
  const articles = filteredContent.filter(c => c.type === "article");

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
          <h2 className="text-xl font-bold text-gray-800">Media Library</h2>
          <div></div>
        </div>
      </header>

      <main className="pb-20 p-4 space-y-6">
        {/* Search and Filter */}
        <Card className="animate-fade-in">
          <CardContent className="p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 focus-peacock"
              />
            </div>
            {/* Removed typeFilters div */}
          </CardContent>
        </Card>

        {/* Podcasts Segment */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Podcasts</h3>
            <Button className="button-peacock" onClick={() => setLocation("/podcasts")}>View All</Button>
          </div>
          {podcasts.length === 0 && <p className="text-gray-500">No podcasts found.</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {podcasts.slice(0, 2).map((content, index) => (
              <motion.div key={content.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Card key={content.id} className="animate-fade-in card-hover">
                  <CardContent className="p-4 flex flex-col items-center">
                    <div className="w-full h-40 rounded-xl overflow-hidden bg-peacock bg-opacity-10 flex items-center justify-center mb-2 relative">
                      <img src={content.thumbnailUrl} alt={content.title} className="w-full h-full object-cover" />
                      {getOverlayIcon(content.type)}
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1 text-center flex items-center justify-center gap-2">{content.title}</h4>
                    <p className="text-sm text-gray-600 mb-2 text-center">{content.description}</p>
                    <span className="text-xs text-gray-500">{content.language === "en" ? "English" : content.language}</span>
                    <Button className="button-peacock mt-2" size="icon" onClick={() => handlePlayContent({ ...content, contentUrl: content.contentUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' })}><Play size={20} /></Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stories Segment */}
        <div className="space-y-4 mt-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Stories</h3>
            <Button className="button-peacock" onClick={() => setLocation("/stories")}>View All</Button>
          </div>
          {stories.length === 0 && <p className="text-gray-500">No stories found.</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stories.slice(0, 2).map((content, index) => (
              <motion.div key={content.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Card key={content.id} className="animate-fade-in card-hover">
                  <CardContent className="p-4 flex flex-col items-center">
                    <div className="w-full h-40 rounded-xl overflow-hidden bg-peacock bg-opacity-10 flex items-center justify-center mb-2 relative">
                      <img src={content.thumbnailUrl} alt={content.title} className="w-full h-full object-cover" />
                      {getOverlayIcon(content.type)}
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1 text-center flex items-center justify-center gap-2">{content.title}</h4>
                    <p className="text-sm text-gray-600 mb-2 text-center">{content.description}</p>
                    <span className="text-xs text-gray-500">{content.language === "en" ? "English" : content.language}</span>
                    <Button className="button-peacock mt-2" size="icon" onClick={() => handlePlayContent({ ...content, contentUrl: content.contentUrl || 'https://www.w3schools.com/html/mov_bbb.mp4' })}><Play size={20} /></Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Articles Segment */}
        <div className="space-y-4 mt-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Articles</h3>
            <Button className="button-peacock" onClick={() => setLocation("/articles")}>View All</Button>
          </div>
          {articles.length === 0 && <p className="text-gray-500">No articles found.</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {articles.slice(0, 2).map((content, index) => (
              <motion.div key={content.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Card key={content.id} className="animate-fade-in card-hover">
                  <CardContent className="p-4 flex flex-col items-center">
                    <div className="w-full h-40 rounded-xl overflow-hidden bg-peacock bg-opacity-10 flex items-center justify-center mb-2 relative">
                      <img src={content.thumbnailUrl} alt={content.title} className="w-full h-full object-cover" />
                      {getOverlayIcon(content.type)}
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1 text-center flex items-center justify-center gap-2">{content.title}</h4>
                    <p className="text-sm text-gray-600 mb-2 text-center">{content.description}</p>
                    <span className="text-xs text-gray-500">{content.language === "en" ? "English" : content.language}</span>
                    <Button className="button-peacock mt-2" size="icon" onClick={() => handlePlayContent({ ...content, articleText: content.articleText || 'Sample article content for ' + content.title })}><BookOpen size={20} /></Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {filteredContent?.length === 0 && (
          <Card className="animate-fade-in">
            <CardContent className="p-8 text-center">
              <div className="text-gray-400 text-4xl mb-4">📚</div>
              <p className="text-gray-600">No content found</p>
              <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Video Player Dialog */}
      {selectedContent && selectedContent.type === "video" && (
        <Dialog open={!!selectedContent} onOpenChange={() => setSelectedContent(null)}>
          <DialogContent className="max-w-4xl p-0">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle>{selectedContent.title}</DialogTitle>
            </DialogHeader>
            <div className="px-6 pb-6">
              <VideoPlayer
                src={selectedContent.contentUrl}
                poster={selectedContent.thumbnailUrl}
                title={selectedContent.title}
                onEnded={() => {
                  toast({
                    title: "Video Completed",
                    description: `You've finished watching "${selectedContent.title}"`,
                  });
                }}
              />
              <div className="mt-4">
                <p className="text-gray-600 mb-2">{selectedContent.description}</p>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs bg-peacock-light bg-opacity-20 text-peacock">
                    {selectedContent.category}
                  </Badge>
                  <Badge variant="secondary" className="text-xs bg-peacock-light bg-opacity-20 text-peacock">
                    {selectedContent.language === "en" ? "English" : selectedContent.language === "hi" ? "Hindi" : selectedContent.language === "ta" ? "Tamil" : "Telugu"}
                  </Badge>
                  <Badge variant="secondary" className="text-xs bg-peacock-light bg-opacity-20 text-peacock">
                    {selectedContent.duration} min
                  </Badge>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Audio Player Dialog */}
      {selectedContent && selectedContent.type === "audio" && (
        <Dialog open={!!selectedContent} onOpenChange={() => setSelectedContent(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedContent.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-600">{selectedContent.description}</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <audio controls className="w-full">
                  <source src={selectedContent.contentUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs bg-peacock-light bg-opacity-20 text-peacock">
                  {selectedContent.category}
                </Badge>
                <Badge variant="secondary" className="text-xs bg-peacock-light bg-opacity-20 text-peacock">
                  {selectedContent.language === "en" ? "English" : selectedContent.language === "hi" ? "Hindi" : selectedContent.language === "ta" ? "Tamil" : "Telugu"}
                </Badge>
                <Badge variant="secondary" className="text-xs bg-peacock-light bg-opacity-20 text-peacock">
                  {selectedContent.duration} min
                </Badge>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Article Reader Dialog */}
      {selectedContent && selectedContent.type === "article" && (
        <Dialog open={!!selectedContent} onOpenChange={() => setSelectedContent(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedContent.title}</DialogTitle>
            </DialogHeader>
            <div className="prose max-w-none text-gray-800">
              <p>{selectedContent.articleText || 'This is a sample article. Replace with real content.'}</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
