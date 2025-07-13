import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkle } from "lucide-react";
import ProgressBar from "@/components/ui/progress-bar";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useCapacitorBack } from "@/hooks/use-capacitor-back";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface Question {
  id: number;
  text: string;
  domain: number;
  reverse: boolean;
}

interface DomainScores {
  selfRecognition: number;
  selfRegulation: number;
  selfMotivation: number;
  empathy: number;
  handlingRelations: number;
  total: number;
}

interface AnalysisResults extends DomainScores {
  insights: string | null;
}

const QUESTIONS: Question[] = [
  { id: 1, text: "I take suggestions from others while selecting my personal belongings, shoes, ornaments, etc", domain: 1, reverse: true },
  { id: 2, text: "I don’t feel bad even when someone criticizes my choice, which I feel the best suited for me.", domain: 1, reverse: false },
  { id: 3, text: "Many times I feel confused about my choices.", domain: 1, reverse: true },
  { id: 4, text: "My self-assessment about my behaviour is always correct", domain: 1, reverse: false },
  { id: 5, text: "My mood is fluctuating so often", domain: 1, reverse: false },
  { id: 6, text: "I become emotional quickly", domain: 2, reverse: true },
  { id: 7, text: "I never spare people who made me angry", domain: 2, reverse: true },
  { id: 8, text: "I think speaking out is the best way of controlling emotions", domain: 2, reverse: true },
  { id: 9, text: "When somebody criticizes/under evaluate me I angrily argue with them", domain: 2, reverse: true },
  { id: 10, text: "When I am emotionally upset with my work I pass it to my home and vice versa", domain: 2, reverse: true },
  { id: 11, text: "When I receive news of failure, I tend to be cool and analyze the pros and cons", domain: 2, reverse: false },
  { id: 12, text: "I think destiny/fate rules human life.", domain: 3, reverse: true },
  { id: 13, text: "When I feel desperate I take advice and help from others.", domain: 3, reverse: true },
  { id: 14, text: "I don’t like being recommended for any favour.", domain: 3, reverse: false },
  { id: 15, text: "Many a times in my life I have come out of the problems on my own.", domain: 3, reverse: false },
  { id: 16, text: "When I finish a good work I expect recognition from my boss/colleagues.", domain: 3, reverse: true },
  { id: 17, text: "After meeting a failure it is very tough for me to make a fresh start.", domain: 3, reverse: true },
  { id: 18, text: "When I am delayed my promotion/recognition I become frustrated and bring out an issue out of it.", domain: 3, reverse: true },
  { id: 19, text: "When I am talking to others I don’t bother about their listening", domain: 4, reverse: true },
  { id: 20, text: "Many times I try to understand people from their point of view.", domain: 4, reverse: false },
  { id: 21, text: "In a conversation when I understand the other person has a different view I divert the point of discussion.", domain: 4, reverse: false },
  { id: 22, text: "When I want to talk to a person I always see that he is in proper mood to receive what I want to say.", domain: 4, reverse: false },
  { id: 23, text: "I observe people with minute details.(body language, tone, mood, etc.)", domain: 4, reverse: false },
  { id: 24, text: "I become angry when people don’t listen to my speech", domain: 4, reverse: true },
  { id: 25, text: "I believe that relationship is a matter of mutual understanding and acceptance", domain: 5, reverse: false },
  { id: 26, text: "During a heated argument in the office I’m the first person to diffuse myself and try to settle the issue amicably.", domain: 5, reverse: false },
  { id: 27, text: "I believe that for excellence in work interpersonal relationship is more important than job knowledge.", domain: 5, reverse: false },
  { id: 28, text: "By handling people tactfully everyone can be made our friend.", domain: 5, reverse: false },
  { id: 29, text: "Jealousy and enmity cannot be avoided in this competitive world", domain: 5, reverse: true },
  { id: 30, text: "It is tough for me to begin conversation with strangers.", domain: 5, reverse: true },
  { id: 31, text: "I have inhibition in expressing my appreciation to others", domain: 5, reverse: true },
  { id: 32, text: "I want to have good relationship with everyone I meet", domain: 5, reverse: false },
  { id: 33, text: "I think informal relationship with colleagues is the must for better team work", domain: 5, reverse: false },
];

const RATING_OPTIONS = [
  { label: "Strongly Agree", value: 5 },
  { label: "Agree", value: 4 },
  { label: "Neutral", value: 3 },
  { label: "Disagree", value: 2 },
  { label: "Strongly Disagree", value: 1 },
];

const DOMAIN_MAX = {
  selfRecognition: 25,
  selfRegulation: 30,
  selfMotivation: 35,
  empathy: 30,
  handlingRelations: 45,
};

function calculateResults(responses: Record<number, number>): DomainScores {
  const getScore = (id: number, value: number) => {
    const question = QUESTIONS.find((q) => q.id === id)!;
    return question.reverse ? 6 - value : value;
  };

  const sum = (ids: number[]) =>
    ids.reduce((acc, id) => acc + getScore(id, responses[id] ?? 0), 0);

  const selfRecognition = sum([1, 2, 3, 4, 5]);
  const selfRegulation = sum([6, 7, 8, 9, 10, 11]);
  const selfMotivation = sum([12, 13, 14, 15, 16, 17, 18]);
  const empathy = sum([19, 20, 21, 22, 23, 24]);
  const handlingRelations = sum([25, 26, 27, 28, 29, 30, 31, 32, 33]);

  const total =
    selfRecognition + selfRegulation + selfMotivation + empathy + handlingRelations;

  return {
    selfRecognition,
    selfRegulation,
    selfMotivation,
    empathy,
    handlingRelations,
    total,
  };
}

async function fetchGeminiInsights(scores: DomainScores): Promise<string | null> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return null;
  try {
    const genAI = new GoogleGenerativeAI(apiKey as string);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Provide a brief emotional intelligence assessment based on the following domain scores:\n
Self Recognition: ${scores.selfRecognition}/${DOMAIN_MAX.selfRecognition}\nSelf Regulation: ${scores.selfRegulation}/${DOMAIN_MAX.selfRegulation}\nSelf Motivation: ${scores.selfMotivation}/${DOMAIN_MAX.selfMotivation}\nEmpathy: ${scores.empathy}/${DOMAIN_MAX.empathy}\nHandling Relations: ${scores.handlingRelations}/${DOMAIN_MAX.handlingRelations}`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error(err);
    return null;
  }
}

export default function SelfAnalysis() {
  const [, setLocation] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  useCapacitorBack();

  const handleOptionSelect = (value: number) => {
    setSelectedOption(value);
  };

  const handleNext = async () => {
    if (selectedOption == null) return;
    const newResponses = { ...responses, [QUESTIONS[currentQuestion].id]: selectedOption };
    setResponses(newResponses);
    setSelectedOption(null);

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const scores = calculateResults(newResponses);
      setLoadingInsights(true);
      const insights = await fetchGeminiInsights(scores);
      setLoadingInsights(false);
      setResults({ ...scores, insights });
    }
  };

  const handlePrevious = () => {
    if (currentQuestion === 0) return;
    setCurrentQuestion(currentQuestion - 1);
    setSelectedOption(responses[QUESTIONS[currentQuestion - 1].id] ?? null);
  };

  if (results) {
    const percent = (score: number, max: number) => Math.round((score / max) * 100);
    return (
      <div className="min-h-screen bg-soft-gray">
        <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
          <div className="flex items-center justify-between p-4">
            <Button variant="ghost" size="sm" onClick={() => setLocation("/")} className="text-peacock">
              <ArrowLeft size={20} />
            </Button>
            <h2 className="text-xl font-bold text-gray-800">Analysis Results</h2>
            <div></div>
          </div>
        </header>
        <main className="pb-20 p-4 space-y-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkle className="text-peacock" size={24} /> Emotional Intelligence Scores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Self Recognition</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-peacock h-2 rounded-full" style={{ width: `${percent(results.selfRecognition, DOMAIN_MAX.selfRecognition)}%` }} />
                      </div>
                      <span className="text-peacock font-medium">{percent(results.selfRecognition, DOMAIN_MAX.selfRecognition)}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Self Regulation</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-peacock h-2 rounded-full" style={{ width: `${percent(results.selfRegulation, DOMAIN_MAX.selfRegulation)}%` }} />
                      </div>
                      <span className="text-peacock font-medium">{percent(results.selfRegulation, DOMAIN_MAX.selfRegulation)}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Self Motivation</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-peacock h-2 rounded-full" style={{ width: `${percent(results.selfMotivation, DOMAIN_MAX.selfMotivation)}%` }} />
                      </div>
                      <span className="text-peacock font-medium">{percent(results.selfMotivation, DOMAIN_MAX.selfMotivation)}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Empathy</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-peacock h-2 rounded-full" style={{ width: `${percent(results.empathy, DOMAIN_MAX.empathy)}%` }} />
                      </div>
                      <span className="text-peacock font-medium">{percent(results.empathy, DOMAIN_MAX.empathy)}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Handling Relations</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-peacock h-2 rounded-full" style={{ width: `${percent(results.handlingRelations, DOMAIN_MAX.handlingRelations)}%` }} />
                      </div>
                      <span className="text-peacock font-medium">{percent(results.handlingRelations, DOMAIN_MAX.handlingRelations)}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {results.insights && (
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Your AI Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-line">{results.insights}</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </main>
      </div>
    );
  }

  const currentQ = QUESTIONS[currentQuestion];
  return (
    <div className="min-h-screen bg-soft-gray">
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/")} className="text-peacock">
            <ArrowLeft size={20} />
          </Button>
          <h2 className="text-xl font-bold text-gray-800">Self Analysis</h2>
          <div></div>
        </div>
      </header>
      <main className="pb-20 p-4 space-y-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-medium text-peacock">
                {currentQuestion + 1}/{QUESTIONS.length}
              </span>
            </div>
            <ProgressBar current={currentQuestion + 1} total={QUESTIONS.length} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{currentQ.text}</h3>
            <div className="space-y-3">
              {RATING_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  variant="outline"
                  className={cn(
                    "w-full text-left p-4 h-auto justify-start border-gray-200 hover:border-peacock hover:bg-peacock hover:bg-opacity-5 transition-colors",
                    selectedOption === option.value && "border-peacock bg-peacock bg-opacity-5"
                  )}
                  onClick={() => handleOptionSelect(option.value)}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={cn(
                        "w-5 h-5 border-2 rounded-full transition-colors",
                        selectedOption === option.value ? "border-peacock bg-peacock" : "border-gray-300"
                      )}
                    >
                      {selectedOption === option.value && <div className="w-full h-full bg-white rounded-full scale-50" />}
                    </div>
                    <span className="text-gray-700">{option.label}</span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0} className="button-peacock-outline">
            Previous
          </Button>
          <Button onClick={handleNext} disabled={selectedOption === null || loadingInsights} className="button-peacock">
            {currentQuestion === QUESTIONS.length - 1 ? (loadingInsights ? "Loading" : "Complete") : "Next"}
          </Button>
        </div>
      </main>
    </div>
  );
}
