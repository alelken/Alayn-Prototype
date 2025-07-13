import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  User, 
  Crown, 
  Flame, 
  Bell, 
  Moon, 
  Globe, 
  HelpCircle, 
  Shield, 
  Star, 
  LogOut 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCapacitorBack } from "@/hooks/use-capacitor-back";

export default function Profile() {
  const [, setLocation] = useLocation();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const { toast } = useToast();

  // Use the centralized back button hook
  useCapacitorBack();

  // Mock user data - in a real app this would come from authentication
  const currentUser = {
    id: 1,
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    subscriptionTier: "premium",
    subscriptionExpiry: "2025-01-12",
    avatar: null,
  };

  const { data: streak } = useQuery<any>({
    queryKey: ["/api/user-progress/1/streak"],
  });

  const handleSignOut = () => {
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully.",
    });
    setLocation("/");
  };

  const handleEditProfile = () => {
    toast({
      title: "Coming Soon",
      description: "Profile editing will be available soon.",
    });
  };

  const handleManageSubscription = () => {
    toast({
      title: "Subscription Management",
      description: "Redirecting to subscription management...",
    });
  };

  const handleHelpSupport = () => {
    toast({
      title: "Help & Support",
      description: "Opening help center...",
    });
  };

  const handlePrivacyPolicy = () => {
    toast({
      title: "Privacy Policy",
      description: "Opening privacy policy...",
    });
  };

  const handleRateApp = () => {
    toast({
      title: "Rate Alayn",
      description: "Thank you for your feedback!",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
          <h2 className="text-xl font-bold text-gray-800">Profile</h2>
          <div></div>
        </div>
      </header>

      <motion.div className="main-content" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        {/* User Profile Card */}
        <Card className="animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-20 h-20 bg-peacock bg-opacity-10 rounded-full flex items-center justify-center">
                <User className="text-peacock" size={32} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{currentUser.name}</h3>
                <p className="text-gray-600">{currentUser.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Crown className="mr-1" size={12} />
                    Premium
                  </Badge>
                  <Badge className="bg-peacock-light bg-opacity-20 text-peacock">
                    <Flame className="mr-1" size={12} />
                    {streak?.streak || 0} day streak
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              className="w-full bg-peacock bg-opacity-10 text-peacock hover:bg-peacock hover:text-white"
              onClick={handleEditProfile}
            >
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Subscription Info */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Current Plan</span>
                <span className="text-peacock font-semibold">Monthly Premium</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Next Billing</span>
                <span className="text-gray-800">{formatDate(currentUser.subscriptionExpiry)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount</span>
                <span className="text-gray-800 font-semibold">₹499/month</span>
              </div>
            </div>
            <Button
              className="w-full mt-4 button-peacock"
              onClick={handleManageSubscription}
            >
              Manage Subscription
            </Button>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="text-gray-600" size={20} />
                  <span className="text-gray-700">Notifications</span>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                  className="data-[state=checked]:bg-peacock"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Moon className="text-gray-600" size={20} />
                  <span className="text-gray-700">Dark Mode</span>
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                  className="data-[state=checked]:bg-peacock"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Globe className="text-gray-600" size={20} />
                  <span className="text-gray-700">Language</span>
                </div>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                    <SelectItem value="ta">Tamil</SelectItem>
                    <SelectItem value="te">Telugu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="animate-fade-in">
          <CardContent className="p-4">
            <div className="space-y-3">
              <Button
                variant="ghost"
                className="w-full justify-start py-3 px-4 hover:bg-gray-50"
                onClick={handleHelpSupport}
              >
                <HelpCircle className="mr-3 text-gray-600" size={20} />
                <span className="text-gray-700">Help & Support</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start py-3 px-4 hover:bg-gray-50"
                onClick={handlePrivacyPolicy}
              >
                <Shield className="mr-3 text-gray-600" size={20} />
                <span className="text-gray-700">Privacy Policy</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start py-3 px-4 hover:bg-gray-50"
                onClick={handleRateApp}
              >
                <Star className="mr-3 text-gray-600" size={20} />
                <span className="text-gray-700">Rate App</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start py-3 px-4 hover:bg-red-50 text-red-600"
                onClick={handleSignOut}
              >
                <LogOut className="mr-3 text-red-600" size={20} />
                <span>Sign Out</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
