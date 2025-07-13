import { useState, useEffect, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ArrowLeft, Search, Filter, Shield, Star, X, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useCapacitorBack } from "@/hooks/use-capacitor-back";

const specialtyFilters = ["All", "Anxiety", "Relationships", "Family"];

// Filter options
const languageOptions = ["All", "English", "Hindi", "Gujarati", "Marathi", "Tamil", "Telugu", "Kannada", "Malayalam"];
const regionOptions = ["All", "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune", "Ahmedabad", "Kolkata"];
const costRanges = [
  { label: "All", min: 0, max: Infinity },
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 - ₹1000", min: 500, max: 1000 },
  { label: "₹1000 - ₹1500", min: 1000, max: 1500 },
  { label: "Above ₹1500", min: 1500, max: Infinity }
];

export default function Therapy() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [allTherapists, setAllTherapists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use the centralized back button hook
  useCapacitorBack();

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedCostRange, setSelectedCostRange] = useState("All");

  // Collapsible states
  const [isSpecialtyOpen, setIsSpecialtyOpen] = useState(true);
  const [isLanguageOpen, setIsLanguageOpen] = useState(true);
  const [isRegionOpen, setIsRegionOpen] = useState(true);
  const [isCostOpen, setIsCostOpen] = useState(true);

  useEffect(() => {
    async function fetchTherapists() {
      setIsLoading(true);
      const querySnapshot = await getDocs(collection(db, "therapists"));
      setAllTherapists(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsLoading(false);
    }
    fetchTherapists();
  }, []);

  // Memoize filtered therapists to avoid unnecessary re-renders
  const filteredTherapists = useMemo(() => {
    let filtered = allTherapists;
    
    // Filter by specialty
    if (selectedSpecialty !== "All") {
      filtered = filtered.filter((t: any) => t.specialties?.includes(selectedSpecialty));
    }
    
    // Filter by language
    if (selectedLanguage !== "All") {
      filtered = filtered.filter((t: any) => t.language === selectedLanguage);
    }
    
    // Filter by region
    if (selectedRegion !== "All") {
      filtered = filtered.filter((t: any) => t.region === selectedRegion);
    }
    
    // Filter by cost range
    if (selectedCostRange !== "All") {
      const costRange = costRanges.find(range => range.label === selectedCostRange);
      if (costRange) {
        filtered = filtered.filter((t: any) => {
          const fee = t.feePerSession / 100; // Convert from paise to rupees
          return fee >= costRange.min && fee <= costRange.max;
        });
      }
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((t: any) => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.specialties?.some((specialty: string) => specialty.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    return filtered;
  }, [allTherapists, selectedSpecialty, selectedLanguage, selectedRegion, selectedCostRange, searchQuery]);

  // Separate results by name and category matches
  const resultsByName = useMemo(() => {
    if (!searchQuery) return [];
    return filteredTherapists.filter((t: any) => 
      t.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [filteredTherapists, searchQuery]);

  const resultsByCategory = useMemo(() => {
    if (!searchQuery) return [];
    return filteredTherapists.filter((t: any) => 
      !t.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      t.specialties?.some((specialty: string) => specialty.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [filteredTherapists, searchQuery]);

  // Show all therapists when no search query
  const allResults = useMemo(() => {
    if (!searchQuery) return filteredTherapists;
    return [];
  }, [filteredTherapists, searchQuery]);

  const handleBookSession = (therapistId: number) => {
    setLocation(`/booking/${therapistId}`);
  };

  const clearAllFilters = () => {
    setSelectedSpecialty("All");
    setSelectedLanguage("All");
    setSelectedRegion("All");
    setSelectedCostRange("All");
    setSearchQuery("");
  };

  const hasActiveFilters = selectedSpecialty !== "All" || selectedLanguage !== "All" || selectedRegion !== "All" || selectedCostRange !== "All" || searchQuery;

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
          <h2 className="text-xl font-bold text-gray-800">Find Therapist</h2>
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="text-peacock">
            <Filter size={20} />
          </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <SheetHeader>
                <SheetTitle className="flex items-center justify-between">
                  <span>Filters</span>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-sm text-peacock hover:text-peacock-dark px-2 py-1 h-auto"
                    >
                      Clear All
                    </Button>
                  )}
                </SheetTitle>
              </SheetHeader>
              
              <div className="space-y-4 mt-6">
                {/* Specialty Filter */}
                <Collapsible open={isSpecialtyOpen} onOpenChange={setIsSpecialtyOpen}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto font-semibold text-gray-800 hover:bg-transparent"
                    >
                      <span>Specialty</span>
                      {isSpecialtyOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3">
                    <div className="flex flex-wrap gap-1">
                      {specialtyFilters.map((filter) => (
                        <Button
                          key={filter}
                          variant={selectedSpecialty === filter ? "default" : "secondary"}
                          size="sm"
                          className={cn(
                            "text-xs px-2 py-1 h-auto",
                            selectedSpecialty === filter ? "button-peacock" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          )}
                          onClick={() => setSelectedSpecialty(filter)}
                        >
                          {filter}
                        </Button>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Language Filter */}
                <Collapsible open={isLanguageOpen} onOpenChange={setIsLanguageOpen}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto font-semibold text-gray-800 hover:bg-transparent"
                    >
                      <span>Language</span>
                      {isLanguageOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3">
                    <div className="flex flex-wrap gap-1">
                      {languageOptions.map((language) => (
                        <Button
                          key={language}
                          variant={selectedLanguage === language ? "default" : "secondary"}
                          size="sm"
                          className={cn(
                            "text-xs px-2 py-1 h-auto",
                            selectedLanguage === language ? "button-peacock" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          )}
                          onClick={() => setSelectedLanguage(language)}
                        >
                          {language}
                        </Button>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Region Filter */}
                <Collapsible open={isRegionOpen} onOpenChange={setIsRegionOpen}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto font-semibold text-gray-800 hover:bg-transparent"
                    >
                      <span>Region</span>
                      {isRegionOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3">
                    <div className="flex flex-wrap gap-1">
                      {regionOptions.map((region) => (
                        <Button
                          key={region}
                          variant={selectedRegion === region ? "default" : "secondary"}
                          size="sm"
                          className={cn(
                            "text-xs px-2 py-1 h-auto",
                            selectedRegion === region ? "button-peacock" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          )}
                          onClick={() => setSelectedRegion(region)}
                        >
                          {region}
                        </Button>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Cost Range Filter */}
                <Collapsible open={isCostOpen} onOpenChange={setIsCostOpen}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto font-semibold text-gray-800 hover:bg-transparent"
                    >
                      <span>Cost Range</span>
                      {isCostOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3">
                    <div className="flex flex-wrap gap-1">
                      {costRanges.map((range) => (
                        <Button
                          key={range.label}
                          variant={selectedCostRange === range.label ? "default" : "secondary"}
                          size="sm"
                          className={cn(
                            "text-xs px-2 py-1 h-auto",
                            selectedCostRange === range.label ? "button-peacock" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          )}
                          onClick={() => setSelectedCostRange(range.label)}
                        >
                          {range.label}
                        </Button>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="pb-20 p-4 space-y-6">
        {/* Search Bar */}
        <Card className="animate-fade-in">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search by specialty, language..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 focus-peacock"
              />
            </div>
          </CardContent>
        </Card>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {selectedSpecialty !== "All" && (
              <Badge variant="secondary" className="bg-peacock-light text-peacock px-3 py-1 flex items-center gap-1">
                <span>Specialty: {selectedSpecialty}</span>
                <X 
                  size={14} 
                  className="cursor-pointer hover:text-peacock-dark transition-colors" 
                  onClick={() => setSelectedSpecialty("All")}
                />
              </Badge>
            )}
            {selectedLanguage !== "All" && (
              <Badge variant="secondary" className="bg-peacock-light text-peacock px-3 py-1 flex items-center gap-1">
                <span>Language: {selectedLanguage}</span>
                <X 
                  size={14} 
                  className="cursor-pointer hover:text-peacock-dark transition-colors" 
                  onClick={() => setSelectedLanguage("All")}
                />
              </Badge>
            )}
            {selectedRegion !== "All" && (
              <Badge variant="secondary" className="bg-peacock-light text-peacock px-3 py-1 flex items-center gap-1">
                <span>Region: {selectedRegion}</span>
                <X 
                  size={14} 
                  className="cursor-pointer hover:text-peacock-dark transition-colors" 
                  onClick={() => setSelectedRegion("All")}
                />
              </Badge>
            )}
            {selectedCostRange !== "All" && (
              <Badge variant="secondary" className="bg-peacock-light text-peacock px-3 py-1 flex items-center gap-1">
                <span>Cost: {selectedCostRange}</span>
                <X 
                  size={14} 
                  className="cursor-pointer hover:text-peacock-dark transition-colors" 
                  onClick={() => setSelectedCostRange("All")}
                />
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="secondary" className="bg-peacock-light text-peacock px-3 py-1 flex items-center gap-1">
                <span>Search: {searchQuery}</span>
                <X 
                  size={14} 
                  className="cursor-pointer hover:text-peacock-dark transition-colors" 
                  onClick={() => setSearchQuery("")}
                />
              </Badge>
            )}
          </div>
        )}

        {/* Filters */}
        <div className="flex space-x-3 overflow-x-auto pb-2 hide-scrollbar">
          {specialtyFilters.map((filter) => (
            <Button
              key={filter}
              variant={selectedSpecialty === filter ? "default" : "secondary"}
              size="sm"
              className={cn(
                "whitespace-nowrap transition-all",
                selectedSpecialty === filter ? "button-peacock" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
              onClick={() => setSelectedSpecialty(filter)}
            >
              {filter}
            </Button>
          ))}
        </div>

        {/* Therapist Cards */}
        <div className="space-y-6">
          {/* Show all results when no search query */}
          {!searchQuery && (
            <div className="space-y-4">
              {allResults?.map((therapist, index) => (
                <motion.div key={therapist.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                  <Card key={therapist.id} className="animate-fade-in card-hover">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={therapist.imageUrl} alt={therapist.name} />
                          <AvatarFallback>{therapist.name.split(' ').map((n: any) => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-800">{therapist.name}</h3>
                            <div className="flex items-center space-x-1">
                              <Star className="text-yellow-500 fill-current" size={16} />
                              <span className="text-sm text-gray-600">{(therapist.rating / 10).toFixed(1)}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            Clinical Psychologist • {therapist.experience} years exp
                          </p>
                          <div className="flex items-center space-x-2 mb-3 flex-wrap">
                            {therapist.specialties?.slice(0, 2).map((specialty: any) => (
                              <Badge key={specialty} variant="secondary" className="text-xs bg-peacock-light bg-opacity-20 text-peacock">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Shield className="text-peacock" size={16} />
                              <span className="text-sm text-gray-600">Encrypted</span>
                            </div>
                            <span className="text-peacock font-semibold">
                              ₹{(therapist.feePerSession / 100).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        className="w-full mt-4 button-peacock"
                        onClick={() => handleBookSession(therapist.id)}
                      >
                        Book Session
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Show segmented results when there's a search query */}
          {searchQuery && (
            <>
              {/* Results by name */}
              {resultsByName.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Results by name</h3>
                  {resultsByName.map((therapist, index) => (
                    <motion.div key={therapist.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                      <Card key={therapist.id} className="animate-fade-in card-hover">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-4">
                            <Avatar className="w-16 h-16">
                              <AvatarImage src={therapist.imageUrl} alt={therapist.name} />
                              <AvatarFallback>{therapist.name.split(' ').map((n: any) => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-gray-800">{therapist.name}</h3>
                                <div className="flex items-center space-x-1">
                                  <Star className="text-yellow-500 fill-current" size={16} />
                                  <span className="text-sm text-gray-600">{(therapist.rating / 10).toFixed(1)}</span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                Clinical Psychologist • {therapist.experience} years exp
                              </p>
                              <div className="flex items-center space-x-2 mb-3 flex-wrap">
                                {therapist.specialties?.slice(0, 2).map((specialty: any) => (
                                  <Badge key={specialty} variant="secondary" className="text-xs bg-peacock-light bg-opacity-20 text-peacock">
                                    {specialty}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Shield className="text-peacock" size={16} />
                                  <span className="text-sm text-gray-600">Encrypted</span>
                                </div>
                                <span className="text-peacock font-semibold">
                                  ₹{(therapist.feePerSession / 100).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            className="w-full mt-4 button-peacock"
                            onClick={() => handleBookSession(therapist.id)}
                          >
                            Book Session
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Results by category */}
              {resultsByCategory.length > 0 && (
        <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Results by category</h3>
                  {resultsByCategory.map((therapist, index) => (
            <motion.div key={therapist.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card key={therapist.id} className="animate-fade-in card-hover">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={therapist.imageUrl} alt={therapist.name} />
                              <AvatarFallback>{therapist.name.split(' ').map((n: any) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-800">{therapist.name}</h3>
                        <div className="flex items-center space-x-1">
                          <Star className="text-yellow-500 fill-current" size={16} />
                          <span className="text-sm text-gray-600">{(therapist.rating / 10).toFixed(1)}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Clinical Psychologist • {therapist.experience} years exp
                      </p>
                      <div className="flex items-center space-x-2 mb-3 flex-wrap">
                                {therapist.specialties?.slice(0, 2).map((specialty: any) => (
                        <Badge key={specialty} variant="secondary" className="text-xs bg-peacock-light bg-opacity-20 text-peacock">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Shield className="text-peacock" size={16} />
                        <span className="text-sm text-gray-600">Encrypted</span>
                      </div>
                      <span className="text-peacock font-semibold">
                        ₹{(therapist.feePerSession / 100).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  className="w-full mt-4 button-peacock"
                  onClick={() => handleBookSession(therapist.id)}
                >
                  Book Session
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          ))}
                </div>
              )}
            </>
          )}
        </div>

        {filteredTherapists?.length === 0 && (
          <Card className="animate-fade-in">
            <CardContent className="p-8 text-center">
              <div className="text-gray-400 text-4xl mb-4">🔍</div>
              <p className="text-gray-600">No therapists found matching your criteria</p>
              <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
