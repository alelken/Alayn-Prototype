import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Video, Users, BookOpen, Star, Shield, Calendar, PlayCircle, Search, Ticket, Play } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Filter, ChevronDown, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useCapacitorBack } from "@/hooks/use-capacitor-back";

const sampleWorkshops = [
  {
    id: 1,
    title: "Mindfulness for Beginners",
    date: "2024-07-10",
    time: "6:00 PM",
    host: "Dr. Anjali Verma",
    imageUrl: "/public/workshop1.jpg",
    description: "A live interactive session to introduce mindfulness practices.",
    ticketPrice: 299
  },
  {
    id: 2,
    title: "Overcoming Stress",
    date: "2024-07-15",
    time: "5:00 PM",
    host: "Dr. Priya Sharma",
    imageUrl: "/public/workshop2.jpg",
    description: "Learn practical tools to manage and reduce stress.",
    ticketPrice: 399
  },
  {
    id: 3,
    title: "Yoga for Mental Wellness",
    date: "2024-07-20",
    time: "7:30 AM",
    host: "Yogi Ramesh",
    imageUrl: "/public/workshop3.jpg",
    description: "Morning yoga session focused on mental clarity and calm.",
    ticketPrice: 199
  },
  {
    id: 4,
    title: "Parenting in the Digital Age",
    date: "2024-07-22",
    time: "8:00 PM",
    host: "Dr. Meera Nair",
    imageUrl: "/public/workshop4.jpg",
    description: "Strategies for mindful parenting and digital balance.",
    ticketPrice: 349
  },
  {
    id: 5,
    title: "Building Resilience",
    date: "2024-07-25",
    time: "6:30 PM",
    host: "Dr. Arjun Patel",
    imageUrl: "/public/workshop5.jpg",
    description: "Interactive workshop on developing emotional resilience.",
    ticketPrice: 299
  }
];

const sampleVideos = [
  {
    id: 1,
    title: "Understanding Anxiety",
    doctor: "Dr. Rahul Mehta",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
    description: "A short educational video on anxiety and coping strategies.",
    ticketPrice: 0
  },
  {
    id: 2,
    title: "Healthy Relationships 101",
    doctor: "Dr. Priya Sharma",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    description: "Tips for building and maintaining healthy relationships.",
    ticketPrice: 0
  },
  {
    id: 3,
    title: "Work-Life Balance Hacks",
    doctor: "Dr. Kavita Rao",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80",
    description: "Practical advice for balancing work and personal life.",
    ticketPrice: 99
  },
  {
    id: 4,
    title: "Dealing with Exam Stress",
    doctor: "Dr. Sameer Kulkarni",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=800&q=80",
    description: "Coping mechanisms for students facing academic pressure.",
    ticketPrice: 49
  },
  {
    id: 5,
    title: "Meditation for Beginners",
    doctor: "Swami Suresh",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
    description: "Step-by-step guide to starting a meditation practice.",
    ticketPrice: 0
  }
];

export default function Experts() {
  const [tab, setTab] = useState("sessions");
  const [therapists, setTherapists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use the centralized back button hook
  useCapacitorBack();

  // Therapy page state and logic (copied from therapy.tsx, minus header)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [allTherapists, setAllTherapists] = useState<any[]>([]);
  const [isTherapyLoading, setIsTherapyLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedCostRange, setSelectedCostRange] = useState("All");
  const [isSpecialtyOpen, setIsSpecialtyOpen] = useState(true);
  const [isLanguageOpen, setIsLanguageOpen] = useState(true);
  const [isRegionOpen, setIsRegionOpen] = useState(true);
  const [isCostOpen, setIsCostOpen] = useState(true);

  // Add state for search and filter for workshops and videos
  const [workshopSearch, setWorkshopSearch] = useState("");
  const [workshopFilterOpen, setWorkshopFilterOpen] = useState(false);
  const [workshopHost, setWorkshopHost] = useState("All");
  const [workshopPrice, setWorkshopPrice] = useState("All");
  const [videoSearch, setVideoSearch] = useState("");
  const [videoFilterOpen, setVideoFilterOpen] = useState(false);
  const [videoDoctor, setVideoDoctor] = useState("All");
  const [videoPrice, setVideoPrice] = useState("All");

  // Unique hosts and doctors for filters
  const workshopHosts = ["All", ...Array.from(new Set(sampleWorkshops.map(w => w.host)))];
  const videoDoctors = ["All", ...Array.from(new Set(sampleVideos.map(v => v.doctor)))];
  const priceRanges = [
    { label: "All", min: 0, max: Infinity },
    { label: "Free", min: 0, max: 0 },
    { label: "Under ₹200", min: 1, max: 200 },
    { label: "₹200 - ₹400", min: 200, max: 400 },
    { label: "Above ₹400", min: 401, max: Infinity }
  ];

  // Filtered data
  const filteredWorkshops = sampleWorkshops.filter(w => {
    if (workshopSearch && !w.title.toLowerCase().includes(workshopSearch.toLowerCase()) && !w.description.toLowerCase().includes(workshopSearch.toLowerCase())) return false;
    if (workshopHost !== "All" && w.host !== workshopHost) return false;
    if (workshopPrice !== "All") {
      const range = priceRanges.find(r => r.label === workshopPrice);
      if (range && (w.ticketPrice < range.min || w.ticketPrice > range.max)) return false;
    }
    return true;
  });
  const filteredVideos = sampleVideos.filter(v => {
    if (videoSearch && !v.title.toLowerCase().includes(videoSearch.toLowerCase()) && !v.description.toLowerCase().includes(videoSearch.toLowerCase())) return false;
    if (videoDoctor !== "All" && v.doctor !== videoDoctor) return false;
    if (videoPrice !== "All") {
      const range = priceRanges.find(r => r.label === videoPrice);
      if (range && (v.ticketPrice < range.min || v.ticketPrice > range.max)) return false;
    }
    return true;
  });

  useEffect(() => {
    async function fetchTherapists() {
      setIsLoading(true);
      const querySnapshot = await getDocs(collection(db, "therapists"));
      setTherapists(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsLoading(false);
    }
    fetchTherapists();
  }, []);

  useEffect(() => {
    async function fetchTherapists() {
      setIsTherapyLoading(true);
      const querySnapshot = await getDocs(collection(db, "therapists"));
      setAllTherapists(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsTherapyLoading(false);
    }
    fetchTherapists();
  }, []);

  // Memoized filters and handlers (copied from therapy.tsx)
  // ... (copy the memoized filter logic, handlers, and UI for search, filters, and therapist cards, minus the header)

  // Add dummy handlers for play and buy ticket
  const handlePlayWorkshop = (workshop: any) => {
    alert(`Playing workshop: ${workshop.title}`);
  };
  const handleBuyWorkshop = (workshop: any) => {
    alert(`Buying ticket for: ${workshop.title}`);
  };
  const handlePlayVideo = (video: any) => {
    alert(`Playing video: ${video.title}`);
  };
  const handleBuyVideo = (video: any) => {
    alert(`Buying ticket for: ${video.title}`);
  };

  return (
    <div className="min-h-screen bg-soft-gray">
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-bold text-gray-800">Experts at Service</h2>
        </div>
      </header>
      <main className="p-4 max-w-2xl mx-auto">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="w-full flex justify-center mb-4 gap-2">
            <TabsTrigger value="sessions" className="flex-1 flex items-center justify-center gap-2"><Video size={18}/>Sessions</TabsTrigger>
            <TabsTrigger value="workshops" className="flex-1 flex items-center justify-center gap-2"><Users size={18}/>Workshops</TabsTrigger>
            <TabsTrigger value="videos" className="flex-1 flex items-center justify-center gap-2"><BookOpen size={18}/>Educational Videos</TabsTrigger>
          </TabsList>
          <TabsContent value="sessions">
            {isTherapyLoading ? (
              <div className="flex justify-center items-center py-12"><div className="loading-spinner w-8 h-8" /></div>
            ) : (
              <motion.div className="main-content" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                {/* Filter Button */}
                <div className="flex justify-end mb-2">
                  <Sheet open={showFilters} onOpenChange={setShowFilters}>
                    <SheetTrigger asChild>
                      <button
                        className="flex items-center gap-2 px-3 py-1.5 rounded bg-peacock text-white text-sm font-medium hover:bg-peacock-dark transition"
                        onClick={() => setShowFilters(true)}
                      >
                        <Filter size={18} /> Filters
                      </button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[280px] sm:w-[320px]">
                      <SheetHeader>
                        <SheetTitle className="flex items-center justify-between">
                          <span>Filters</span>
                          {(selectedSpecialty !== "All" || selectedLanguage !== "All" || selectedRegion !== "All" || selectedCostRange !== "All" || searchQuery) && (
                            <button
                              onClick={() => {
                                setSelectedSpecialty("All");
                                setSelectedLanguage("All");
                                setSelectedRegion("All");
                                setSelectedCostRange("All");
                                setSearchQuery("");
                              }}
                              className="text-sm text-peacock hover:text-peacock-dark px-2 py-1 h-auto"
                            >
                              Clear All
                            </button>
                          )}
                        </SheetTitle>
                      </SheetHeader>
                      <div className="space-y-4 mt-6">
                        {/* Specialty Filter */}
                        <Collapsible open={isSpecialtyOpen} onOpenChange={setIsSpecialtyOpen}>
                          <CollapsibleTrigger asChild>
                            <button
                              className="w-full flex justify-between items-center p-0 h-auto font-semibold text-gray-800 hover:bg-transparent"
                            >
                              <span>Specialty</span>
                              {isSpecialtyOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-3">
                            <div className="flex flex-wrap gap-1">
                              {["All", "Anxiety", "Relationships", "Family"].map((filter) => (
                                <button
                                  key={filter}
                                  className={`text-xs px-2 py-1 h-auto rounded ${selectedSpecialty === filter ? "bg-peacock text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                                  onClick={() => setSelectedSpecialty(filter)}
                                >
                                  {filter}
                                </button>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                        {/* Language Filter */}
                        <Collapsible open={isLanguageOpen} onOpenChange={setIsLanguageOpen}>
                          <CollapsibleTrigger asChild>
                            <button
                              className="w-full flex justify-between items-center p-0 h-auto font-semibold text-gray-800 hover:bg-transparent"
                            >
                              <span>Language</span>
                              {isLanguageOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-3">
                            <div className="flex flex-wrap gap-1">
                              {["All", "English", "Hindi", "Gujarati", "Marathi", "Tamil", "Telugu", "Kannada", "Malayalam"].map((language) => (
                                <button
                                  key={language}
                                  className={`text-xs px-2 py-1 h-auto rounded ${selectedLanguage === language ? "bg-peacock text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                                  onClick={() => setSelectedLanguage(language)}
                                >
                                  {language}
                                </button>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                        {/* Region Filter */}
                        <Collapsible open={isRegionOpen} onOpenChange={setIsRegionOpen}>
                          <CollapsibleTrigger asChild>
                            <button
                              className="w-full flex justify-between items-center p-0 h-auto font-semibold text-gray-800 hover:bg-transparent"
                            >
                              <span>Region</span>
                              {isRegionOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-3">
                            <div className="flex flex-wrap gap-1">
                              {["All", "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune", "Ahmedabad", "Kolkata"].map((region) => (
                                <button
                                  key={region}
                                  className={`text-xs px-2 py-1 h-auto rounded ${selectedRegion === region ? "bg-peacock text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                                  onClick={() => setSelectedRegion(region)}
                                >
                                  {region}
                                </button>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                        {/* Cost Range Filter */}
                        <Collapsible open={isCostOpen} onOpenChange={setIsCostOpen}>
                          <CollapsibleTrigger asChild>
                            <button
                              className="w-full flex justify-between items-center p-0 h-auto font-semibold text-gray-800 hover:bg-transparent"
                            >
                              <span>Cost Range</span>
                              {isCostOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-3">
                            <div className="flex flex-wrap gap-1">
                              {[
                                { label: "All", min: 0, max: Infinity },
                                { label: "Under ₹500", min: 0, max: 500 },
                                { label: "₹500 - ₹1000", min: 500, max: 1000 },
                                { label: "₹1000 - ₹1500", min: 1000, max: 1500 },
                                { label: "Above ₹1500", min: 1500, max: Infinity }
                              ].map((range) => (
                                <button
                                  key={range.label}
                                  className={`text-xs px-2 py-1 h-auto rounded ${selectedCostRange === range.label ? "bg-peacock text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                                  onClick={() => setSelectedCostRange(range.label)}
                                >
                                  {range.label}
                                </button>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
                {/* Search Bar */}
                <Card className="animate-fade-in">
                  <CardContent className="p-4">
                    <div className="relative">
                      <Video className="absolute left-3 top-3 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Search by specialty, language..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 focus-peacock w-full border border-gray-200 rounded-md py-2 px-3 text-sm"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Active Filters Display */}
                {(selectedSpecialty !== "All" || selectedLanguage !== "All" || selectedRegion !== "All" || selectedCostRange !== "All" || searchQuery) && (
                  <div className="flex flex-wrap gap-2">
                    {selectedSpecialty !== "All" && (
                      <span className="bg-peacock-light text-peacock px-3 py-1 rounded flex items-center gap-1 text-xs">
                        <span>Specialty: {selectedSpecialty}</span>
                        <button onClick={() => setSelectedSpecialty("All")} className="hover:text-peacock-dark">✕</button>
                      </span>
                    )}
                    {selectedLanguage !== "All" && (
                      <span className="bg-peacock-light text-peacock px-3 py-1 rounded flex items-center gap-1 text-xs">
                        <span>Language: {selectedLanguage}</span>
                        <button onClick={() => setSelectedLanguage("All")} className="hover:text-peacock-dark">✕</button>
                      </span>
                    )}
                    {selectedRegion !== "All" && (
                      <span className="bg-peacock-light text-peacock px-3 py-1 rounded flex items-center gap-1 text-xs">
                        <span>Region: {selectedRegion}</span>
                        <button onClick={() => setSelectedRegion("All")} className="hover:text-peacock-dark">✕</button>
                      </span>
                    )}
                    {selectedCostRange !== "All" && (
                      <span className="bg-peacock-light text-peacock px-3 py-1 rounded flex items-center gap-1 text-xs">
                        <span>Cost: {selectedCostRange}</span>
                        <button onClick={() => setSelectedCostRange("All")} className="hover:text-peacock-dark">✕</button>
                      </span>
                    )}
                    {searchQuery && (
                      <span className="bg-peacock-light text-peacock px-3 py-1 rounded flex items-center gap-1 text-xs">
                        <span>Search: {searchQuery}</span>
                        <button onClick={() => setSearchQuery("")} className="hover:text-peacock-dark">✕</button>
                      </span>
                    )}
                  </div>
                )}

                {/* Therapist Cards - Segmented by search */}
                <div className="space-y-4">
                  {/* Memoized filtered therapists */}
                  {(() => {
                    // Filtering logic
                    let filtered = allTherapists;
                    if (selectedSpecialty !== "All") filtered = filtered.filter((t) => t.specialties?.includes(selectedSpecialty));
                    if (selectedLanguage !== "All") filtered = filtered.filter((t) => t.language === selectedLanguage);
                    if (selectedRegion !== "All") filtered = filtered.filter((t) => t.region === selectedRegion);
                    if (selectedCostRange !== "All") {
                      const costRanges = [
                        { label: "All", min: 0, max: Infinity },
                        { label: "Under ₹500", min: 0, max: 500 },
                        { label: "₹500 - ₹1000", min: 500, max: 1000 },
                        { label: "₹1000 - ₹1500", min: 1000, max: 1500 },
                        { label: "Above ₹1500", min: 1500, max: Infinity }
                      ];
                      const range = costRanges.find(r => r.label === selectedCostRange);
                      if (range) filtered = filtered.filter((t) => {
                        const fee = t.feePerSession / 100;
                        return fee >= range.min && fee <= range.max;
                      });
                    }
                    // Segmentation
                    if (searchQuery) {
                      const q = searchQuery.toLowerCase();
                      const resultsByName = filtered.filter((t) => t.name.toLowerCase().includes(q));
                      const resultsByCategory = filtered.filter((t) =>
                        !t.name.toLowerCase().includes(q) &&
                        t.specialties?.some((s: string) => s.toLowerCase().includes(q))
                      );
                      return (
                        <>
                          {resultsByName.length > 0 && (
                            <div className="space-y-2">
                              <h3 className="text-lg font-semibold text-gray-800">Results by name</h3>
                              {resultsByName.map((t, index) => (
                                <motion.div key={t.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                                  <Card key={t.id} className="animate-fade-in card-hover">
                                    <CardContent className="p-4">
                                      <div className="flex items-start space-x-4">
                                        <Avatar className="w-16 h-16">
                                          <AvatarImage src={t.imageUrl} alt={t.name} />
                                          <AvatarFallback>{t.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                          <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold text-gray-800">{t.name}</h3>
                                            <div className="flex items-center space-x-1">
                                              <Star className="text-yellow-500 fill-current" size={16} />
                                              <span className="text-sm text-gray-600">{(t.rating / 10).toFixed(1)}</span>
                                            </div>
                                          </div>
                                          <p className="text-sm text-gray-600 mb-2">
                                            Clinical Psychologist • {t.experience} years exp
                                          </p>
                                          <div className="flex items-center space-x-2 mb-3 flex-wrap">
                                            {t.specialties?.slice(0, 2).map((specialty: string) => (
                                              <span key={specialty} className="text-xs bg-peacock-light bg-opacity-20 text-peacock rounded px-2 py-1">{specialty}</span>
                                            ))}
                                          </div>
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                              <Shield className="text-peacock" size={16} />
                                              <span className="text-sm text-gray-600">Encrypted</span>
                                            </div>
                                            <span className="text-peacock font-semibold">
                                              ₹{(t.feePerSession / 100).toLocaleString()}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <button
                                        className="w-full mt-4 bg-peacock text-white rounded py-2 text-sm font-semibold hover:bg-peacock-dark transition"
                                        onClick={() => window.location.href = `/booking/${t.id}`}
                                      >
                                        Book Session
                                      </button>
                                    </CardContent>
                                  </Card>
                                </motion.div>
                              ))}
                            </div>
                          )}
                          {resultsByCategory.length > 0 && (
                            <div className="space-y-2">
                              <h3 className="text-lg font-semibold text-gray-800">Results by category</h3>
                              {resultsByCategory.map((t, index) => (
                                <motion.div key={t.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                                  <Card key={t.id} className="animate-fade-in card-hover">
                                    <CardContent className="p-4">
                                      <div className="flex items-start space-x-4">
                                        <Avatar className="w-16 h-16">
                                          <AvatarImage src={t.imageUrl} alt={t.name} />
                                          <AvatarFallback>{t.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                          <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold text-gray-800">{t.name}</h3>
                                            <div className="flex items-center space-x-1">
                                              <Star className="text-yellow-500 fill-current" size={16} />
                                              <span className="text-sm text-gray-600">{(t.rating / 10).toFixed(1)}</span>
                                            </div>
                                          </div>
                                          <p className="text-sm text-gray-600 mb-2">
                                            Clinical Psychologist • {t.experience} years exp
                                          </p>
                                          <div className="flex items-center space-x-2 mb-3 flex-wrap">
                                            {t.specialties?.slice(0, 2).map((specialty: string) => (
                                              <span key={specialty} className="text-xs bg-peacock-light bg-opacity-20 text-peacock rounded px-2 py-1">{specialty}</span>
                                            ))}
                                          </div>
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                              <Shield className="text-peacock" size={16} />
                                              <span className="text-sm text-gray-600">Encrypted</span>
                                            </div>
                                            <span className="text-peacock font-semibold">
                                              ₹{(t.feePerSession / 100).toLocaleString()}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <button
                                        className="w-full mt-4 bg-peacock text-white rounded py-2 text-sm font-semibold hover:bg-peacock-dark transition"
                                        onClick={() => window.location.href = `/booking/${t.id}`}
                                      >
                                        Book Session
                                      </button>
                                    </CardContent>
                                  </Card>
                                </motion.div>
                              ))}
                            </div>
                          )}
                          {resultsByName.length === 0 && resultsByCategory.length === 0 && (
                            <Card className="animate-fade-in">
                              <CardContent className="p-8 text-center">
                                <div className="text-gray-400 text-4xl mb-4">🔍</div>
                                <p className="text-gray-600">No therapists found matching your criteria</p>
                                <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filters</p>
                              </CardContent>
                            </Card>
                          )}
                        </>
                      );
                    }
                    // No search query: show all
                    return filtered.length === 0 ? (
                      <Card className="animate-fade-in">
                        <CardContent className="p-8 text-center">
                          <div className="text-gray-400 text-4xl mb-4">🔍</div>
                          <p className="text-gray-600">No therapists found matching your criteria</p>
                          <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filters</p>
                        </CardContent>
                      </Card>
                    ) : (
                      filtered.map((t, index) => (
                        <motion.div key={t.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                          <Card key={t.id} className="animate-fade-in card-hover">
                            <CardContent className="p-4">
                              <div className="flex items-start space-x-4">
                                <Avatar className="w-16 h-16">
                                  <AvatarImage src={t.imageUrl} alt={t.name} />
                                  <AvatarFallback>{t.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-gray-800">{t.name}</h3>
                                    <div className="flex items-center space-x-1">
                                      <Star className="text-yellow-500 fill-current" size={16} />
                                      <span className="text-sm text-gray-600">{(t.rating / 10).toFixed(1)}</span>
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">
                                    Clinical Psychologist • {t.experience} years exp
                                  </p>
                                  <div className="flex items-center space-x-2 mb-3 flex-wrap">
                                    {t.specialties?.slice(0, 2).map((specialty: string) => (
                                      <span key={specialty} className="text-xs bg-peacock-light bg-opacity-20 text-peacock rounded px-2 py-1">{specialty}</span>
                                    ))}
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <Shield className="text-peacock" size={16} />
                                      <span className="text-sm text-gray-600">Encrypted</span>
                                    </div>
                                    <span className="text-peacock font-semibold">
                                      ₹{(t.feePerSession / 100).toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <button
                                className="w-full mt-4 bg-peacock text-white rounded py-2 text-sm font-semibold hover:bg-peacock-dark transition"
                                onClick={() => window.location.href = `/booking/${t.id}`}
                              >
                                Book Session
                              </button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))
                    );
                  })()}
                </div>
              </motion.div>
            )}
          </TabsContent>
          <TabsContent value="workshops">
            {/* Search and Filter */}
            <div className="flex items-center justify-between mb-4">
              <div className="relative w-full max-w-xs">
                <input
                  type="text"
                  placeholder="Search workshops..."
                  value={workshopSearch}
                  onChange={e => setWorkshopSearch(e.target.value)}
                  className="pl-10 pr-3 py-2 rounded border border-gray-200 w-full focus-peacock text-sm"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
              <Sheet open={workshopFilterOpen} onOpenChange={setWorkshopFilterOpen}>
                <SheetTrigger asChild>
                  <button className="ml-2 flex items-center gap-2 px-3 py-1.5 rounded bg-peacock text-white text-sm font-medium hover:bg-peacock-dark transition" onClick={() => setWorkshopFilterOpen(true)}>
                    <Filter size={18} /> Filter
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] sm:w-[320px]">
                  <SheetHeader>
                    <SheetTitle className="flex items-center justify-between">
                      <span>Workshop Filters</span>
                      {(workshopHost !== "All" || workshopPrice !== "All") && (
                        <button
                          onClick={() => { setWorkshopHost("All"); setWorkshopPrice("All"); }}
                          className="text-sm text-peacock hover:text-peacock-dark px-2 py-1 h-auto"
                        >Clear All</button>
                      )}
                    </SheetTitle>
                  </SheetHeader>
                  <div className="space-y-4 mt-6">
                    {/* Host Filter */}
                    <Collapsible open={true}>
                      <CollapsibleTrigger asChild>
                        <button className="w-full flex justify-between items-center p-0 h-auto font-semibold text-gray-800 hover:bg-transparent">
                          <span>Host</span>
                          <ChevronDown size={16} />
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-3">
                        <div className="flex flex-wrap gap-1">
                          {workshopHosts.map(host => (
                            <button key={host} className={`text-xs px-2 py-1 h-auto rounded ${workshopHost === host ? "bg-peacock text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`} onClick={() => setWorkshopHost(host)}>{host}</button>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                    {/* Price Filter */}
                    <Collapsible open={true}>
                      <CollapsibleTrigger asChild>
                        <button className="w-full flex justify-between items-center p-0 h-auto font-semibold text-gray-800 hover:bg-transparent">
                          <span>Ticket Price</span>
                          <ChevronDown size={16} />
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-3">
                        <div className="flex flex-wrap gap-1">
                          {priceRanges.map(range => (
                            <button key={range.label} className={`text-xs px-2 py-1 h-auto rounded ${workshopPrice === range.label ? "bg-peacock text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`} onClick={() => setWorkshopPrice(range.label)}>{range.label}</button>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredWorkshops.map((w, index) => (
                <motion.div key={w.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                  <Card key={w.id} className="animate-fade-in card-hover">
                    <CardContent className="p-4 flex flex-col items-center">
                      <div className="w-full h-40 rounded-xl overflow-hidden bg-peacock bg-opacity-10 flex items-center justify-center mb-2 relative">
                        <img src={w.imageUrl} alt={w.title} className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 bg-white bg-opacity-80 rounded-full p-1">
                          <Users className="text-peacock" size={18} />
                        </div>
                        <div className="absolute bottom-2 right-2 bg-white bg-opacity-80 rounded-full p-1">
                          <Calendar className="text-peacock" size={16} />
                        </div>
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-1 text-center flex items-center justify-center gap-2">{w.title}</h4>
                      <p className="text-sm text-gray-600 mb-1 text-center">Host: {w.host}</p>
                      <p className="text-xs text-gray-500 mb-1 text-center">{w.date} • {w.time}</p>
                      <p className="text-sm text-gray-600 mb-1 text-center">{w.description}</p>
                      <span className="text-peacock font-semibold text-sm">Ticket: ₹{w.ticketPrice}</span>
                      {w.ticketPrice > 0 ? (
                        <button className="button-peacock mt-3 flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-white" onClick={() => handleBuyWorkshop(w)}>
                          <Ticket size={18} /> Buy Ticket
                        </button>
                      ) : (
                        <button className="button-peacock mt-3 flex items-center justify-center p-3 rounded-full" onClick={() => handlePlayWorkshop(w)}>
                          <Play size={20} />
                        </button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="videos">
            {/* Top icon and title */}
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="text-peacock" size={28} />
              <h3 className="text-lg font-semibold text-gray-800">Educational Videos</h3>
            </div>
            {/* Search and Filter */}
            <div className="flex items-center justify-between mb-4">
              <div className="relative w-full max-w-xs">
                <input
                  type="text"
                  placeholder="Search educational videos..."
                  value={videoSearch}
                  onChange={e => setVideoSearch(e.target.value)}
                  className="pl-10 pr-3 py-2 rounded border border-gray-200 w-full focus-peacock text-sm"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
              <Sheet open={videoFilterOpen} onOpenChange={setVideoFilterOpen}>
                <SheetTrigger asChild>
                  <button className="ml-2 flex items-center gap-2 px-3 py-1.5 rounded bg-peacock text-white text-sm font-medium hover:bg-peacock-dark transition" onClick={() => setVideoFilterOpen(true)}>
                    <Filter size={18} /> Filter
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] sm:w-[320px]">
                  <SheetHeader>
                    <SheetTitle className="flex items-center justify-between">
                      <span>Video Filters</span>
                      {(videoDoctor !== "All" || videoPrice !== "All") && (
                        <button
                          onClick={() => { setVideoDoctor("All"); setVideoPrice("All"); }}
                          className="text-sm text-peacock hover:text-peacock-dark px-2 py-1 h-auto"
                        >Clear All</button>
                      )}
                    </SheetTitle>
                  </SheetHeader>
                  <div className="space-y-4 mt-6">
                    {/* Doctor Filter */}
                    <Collapsible open={true}>
                      <CollapsibleTrigger asChild>
                        <button className="w-full flex justify-between items-center p-0 h-auto font-semibold text-gray-800 hover:bg-transparent">
                          <span>Doctor</span>
                          <ChevronDown size={16} />
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-3">
                        <div className="flex flex-wrap gap-1">
                          {videoDoctors.map(doctor => (
                            <button key={doctor} className={`text-xs px-2 py-1 h-auto rounded ${videoDoctor === doctor ? "bg-peacock text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`} onClick={() => setVideoDoctor(doctor)}>{doctor}</button>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                    {/* Price Filter */}
                    <Collapsible open={true}>
                      <CollapsibleTrigger asChild>
                        <button className="w-full flex justify-between items-center p-0 h-auto font-semibold text-gray-800 hover:bg-transparent">
                          <span>Ticket Price</span>
                          <ChevronDown size={16} />
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-3">
                        <div className="flex flex-wrap gap-1">
                          {priceRanges.map(range => (
                            <button key={range.label} className={`text-xs px-2 py-1 h-auto rounded ${videoPrice === range.label ? "bg-peacock text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`} onClick={() => setVideoPrice(range.label)}>{range.label}</button>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredVideos.map((v, index) => (
                <motion.div key={v.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                  <Card key={v.id} className="animate-fade-in card-hover">
                    <CardContent className="p-4 flex flex-col items-center">
                      <div className="w-full h-40 rounded-xl overflow-hidden bg-peacock bg-opacity-10 flex items-center justify-center mb-2 relative">
                        <img src={v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 bg-white bg-opacity-80 rounded-full p-1">
                          <BookOpen className="text-peacock" size={18} />
                        </div>
                        <div className="absolute bottom-2 right-2 bg-white bg-opacity-80 rounded-full p-1">
                          <PlayCircle className="text-peacock" size={18} />
                        </div>
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-1 text-center flex items-center justify-center gap-2">{v.title}</h4>
                      <p className="text-sm text-gray-600 mb-1 text-center">By: {v.doctor}</p>
                      <p className="text-sm text-gray-600 mb-1 text-center">{v.description}</p>
                      <div className="flex gap-2 mt-3">
                        <button className="button-peacock flex items-center justify-center p-3 rounded-full" onClick={() => handlePlayVideo(v)}>
                          <Play size={20} />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
} 