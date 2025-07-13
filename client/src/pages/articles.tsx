import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { useCapacitorBack } from "@/hooks/use-capacitor-back";

type Article = {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  content: string;
};

const sampleArticles: Article[] = [
  {
    id: 1,
    title: "Understanding Mindfulness",
    description: "A comprehensive guide to mindfulness practices.",
    thumbnailUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    content: "Mindfulness is the practice of being present in the moment..."
  },
  {
    id: 2,
    title: "Stress Management Techniques",
    description: "Effective ways to manage daily stress.",
    thumbnailUrl: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
    content: "Stress is a natural part of life, but how we handle it matters..."
  },
  {
    id: 3,
    title: "Building Healthy Relationships",
    description: "Tips for maintaining strong relationships.",
    thumbnailUrl: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=800&q=80",
    content: "Healthy relationships are built on trust, communication, and mutual respect..."
  }
];

export default function Articles() {
  const [search, setSearch] = useState("");
  const [, setLocation] = useLocation();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  
  // Use the centralized back button hook
  useCapacitorBack();
  
  const filtered = sampleArticles.filter(
    (a: Article) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase())
  );
  
  return (
    <div className="min-h-screen bg-soft-gray">
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-bold text-gray-800">Articles</h2>
        </div>
      </header>
      <main className="p-4 space-y-4">
        <input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-peacock"
        />
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((article, idx) => (
            <motion.div key={article.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <Card key={article.id} className="animate-fade-in card-hover">
                <CardContent className="p-4 flex flex-col items-center">
                  <div className="w-full h-40 rounded-xl overflow-hidden bg-peacock bg-opacity-10 flex items-center justify-center mb-2 relative">
                    <img src={article.thumbnailUrl} alt={article.title} className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 rounded-full p-2">
                      <BookOpen className="text-white" size={20} />
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-1 text-center flex items-center justify-center gap-2">{article.title}</h4>
                  <p className="text-sm text-gray-600 mb-2 text-center">{article.description}</p>
                  <Button className="button-peacock mt-2" size="sm" onClick={() => setSelectedArticle(article)}>Read</Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </main>
      {/* Article Reader Dialog */}
      {selectedArticle && (
        <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedArticle.title}</DialogTitle>
            </DialogHeader>
            <div className="prose max-w-none text-gray-800">
              <p>{selectedArticle.content}</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 