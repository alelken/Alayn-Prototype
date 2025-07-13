import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkle } from "lucide-react";
import { cn } from "@/lib/utils";
import ProgressBar from "@/components/ui/progress-bar";
import { motion } from "framer-motion";
import { useCapacitorBack } from "@/hooks/use-capacitor-back";

interface Question {
  id: number;
  question: string;
  options: string[];
}

interface PersonalityResults {
  mindfulnessScore: number;
  emotionalIntelligenceScore: number;
  stressManagementScore: number;
  insights: string[];
  recommendations: string[];
}

function calculateResults(responses: Record<number, number>): PersonalityResults {
  // Simple scoring: higher option index = better score
  const total = Object.values(responses).reduce((a, b) => a + b, 0);
  const max = sampleQuestions.length * 3;
  const percent = (score: number) => Math.round((score / max) * 100);

  // For demo, split scores by question index
  const mindfulnessScore = percent((responses[1] ?? 0) + (responses[4] ?? 0));
  const emotionalIntelligenceScore = percent((responses[2] ?? 0) + (responses[3] ?? 0));
  const stressManagementScore = percent((responses[5] ?? 0) + (responses[2] ?? 0));

  // Mock insights and recommendations
  const insights = [
    mindfulnessScore > 60 ? "You are mindful and self-aware." : "You could benefit from more mindfulness.",
    emotionalIntelligenceScore > 60 ? "You express emotions well." : "Try to open up emotionally.",
    stressManagementScore > 60 ? "You manage stress effectively." : "Consider stress management techniques.",
  ];
  const recommendations = [
    "Practice daily gratitude journaling.",
    "Try a 5-minute breathing exercise.",
    "Reflect on your emotions each evening.",
  ];

  return {
    mindfulnessScore,
    emotionalIntelligenceScore,
    stressManagementScore,
    insights,
    recommendations,
  };
}

// Sample questions for personality analysis
const sampleQuestions: Question[] = [
  {
    id: 1,
    question: "How often do you take time to reflect on your thoughts and feelings?",
    options: ["Rarely", "Sometimes", "Often", "Always"],
  },
  {
    id: 2,
    question: "How do you usually respond to stressful situations?",
    options: ["Get overwhelmed", "Try to cope", "Stay calm", "Help others cope"],
  },
  {
    id: 3,
    question: "How comfortable are you expressing your emotions?",
    options: ["Not at all", "A little", "Comfortable", "Very comfortable"],
  },
  {
    id: 4,
    question: "How often do you practice gratitude or mindfulness?",
    options: ["Never", "Occasionally", "Regularly", "Daily"],
  },
  {
    id: 5,
    question: "How well do you manage conflicts in relationships?",
    options: ["Poorly", "Okay", "Well", "Very well"],
  },
];

export default function PersonalityAnalysis() {
  const [, setLocation] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<PersonalityResults | null>(null);

  // Use the centralized back button hook
  useCapacitorBack();

  const questions = sampleQuestions;
  const isLoading = false;

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleNext = () => {
    if (selectedOption !== null) {
      const newResponses = { ...responses, [questions[currentQuestion].id]: selectedOption };
      setResponses(newResponses);
      setSelectedOption(null);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Calculate results
        const results = calculateResults(newResponses);
        setAnalysisResults(results);
        setShowResults(true);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(responses[questions[currentQuestion - 1].id] ?? null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-soft-gray flex items-center justify-center">
        <div className="loading-spinner w-8 h-8" />
      </div>
    );
  }

  if (showResults && analysisResults) {
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
            <h2 className="text-xl font-bold text-gray-800">Analysis Results</h2>
            <div></div>
          </div>
        </header>

        <main className="pb-20 p-4 space-y-6">
          <motion.div className="animate-fade-in" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkle className="text-peacock" size={24} />
                  Your AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Mindfulness</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-peacock h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${analysisResults.mindfulnessScore}%` }}
                        />
                      </div>
                      <span className="text-peacock font-medium">{analysisResults.mindfulnessScore}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Emotional Intelligence</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-peacock h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${analysisResults.emotionalIntelligenceScore}%` }}
                        />
                      </div>
                      <span className="text-peacock font-medium">{analysisResults.emotionalIntelligenceScore}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Stress Management</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-peacock h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${analysisResults.stressManagementScore}%` }}
                        />
                      </div>
                      <span className="text-peacock font-medium">{analysisResults.stressManagementScore}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <motion.div className="animate-fade-in" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Key Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysisResults.insights.map((insight, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-peacock rounded-full mt-2 flex-shrink-0" />
                        <p className="text-gray-700">{insight}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div className="animate-fade-in" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysisResults.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                        <p className="text-gray-700">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <Button 
              className="w-full button-peacock"
              onClick={() => setLocation("/exercises")}
            >
              Get Personalized Recommendations
            </Button>
          </motion.div>
        </main>
      </div>
    );
  }

  const currentQ = questions?.[currentQuestion];
  if (!currentQ) return null;

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
          <h2 className="text-xl font-bold text-gray-800">AI Analysis</h2>
          <div></div>
        </div>
      </header>

      <main className="pb-20 p-4 space-y-6">
        {/* Progress Bar */}
        <Card className="animate-fade-in">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-medium text-peacock">
                {currentQuestion + 1}/{questions.length}
              </span>
            </div>
            <ProgressBar current={currentQuestion + 1} total={questions.length} />
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card className="animate-fade-in">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {currentQ.question}
            </h3>
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={cn(
                    "w-full text-left p-4 h-auto justify-start border-gray-200 hover:border-peacock hover:bg-peacock hover:bg-opacity-5 transition-colors",
                    selectedOption === index && "border-peacock bg-peacock bg-opacity-5"
                  )}
                  onClick={() => handleOptionSelect(index)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "w-5 h-5 border-2 rounded-full transition-colors",
                      selectedOption === index ? "border-peacock bg-peacock" : "border-gray-300"
                    )}>
                      {selectedOption === index && (
                        <div className="w-full h-full bg-white rounded-full scale-50" />
                      )}
                    </div>
                    <span className="text-gray-700">{option}</span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="button-peacock-outline"
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={selectedOption === null}
            className="button-peacock"
          >
            {currentQuestion === questions.length - 1 ? "Complete" : "Next"}
          </Button>
        </div>
      </main>
    </div>
  );
}
