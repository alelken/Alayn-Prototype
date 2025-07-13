interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.therapy": "Therapy",
    "nav.exercises": "Exercises",
    "nav.library": "Library",
    "nav.profile": "Profile",
    
    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.cancel": "Cancel",
    "common.continue": "Continue",
    "common.back": "Back",
    "common.next": "Next",
    "common.previous": "Previous",
    "common.complete": "Complete",
    "common.save": "Save",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.all": "All",
    "common.free": "Free",
    "common.premium": "Premium",
    
    // Home
    "home.greeting": "Hello, {{name}}!",
    "home.mood.question": "How are you feeling today?",
    "home.mood.great": "Great",
    "home.mood.okay": "Okay",
    "home.mood.low": "Low",
    "home.daily_tip": "Daily Tip",
    "home.quick_actions": "Quick Actions",
    "home.recommendations": "Recommended for You",
    "home.progress": "Your Progress",
    
    // Personality Analysis
    "personality.title": "Personality Analysis",
    "personality.progress": "Progress",
    "personality.results": "Analysis Results",
    "personality.insights": "Your Personality Insights",
    "personality.recommendations": "Recommendations",
    
    // Therapy
    "therapy.title": "Find Therapist",
    "therapy.search": "Search by specialty, language...",
    "therapy.book_session": "Book Session",
    "therapy.encrypted": "Encrypted",
    "therapy.years_exp": "years exp",
    
    // Exercises
    "exercises.title": "Mindful Exercises",
    "exercises.categories": "Categories",
    "exercises.breathing": "Breathing",
    "exercises.yoga": "Yoga",
    "exercises.meditation": "Meditation",
    "exercises.sleep": "Sleep",
    "exercises.start": "Start",
    "exercises.beginner": "Beginner",
    "exercises.intermediate": "Intermediate",
    "exercises.advanced": "Advanced",
    
    // Library
    "library.title": "Media Library",
    "library.search": "Search content...",
    "library.featured": "Featured Content",
    "library.videos": "Videos",
    "library.audio": "Audio",
    "library.articles": "Articles",
    "library.watch": "Watch",
    "library.listen": "Listen",
    "library.read": "Read",
    
    // Profile
    "profile.title": "Profile",
    "profile.edit": "Edit Profile",
    "profile.subscription": "Subscription",
    "profile.settings": "Settings",
    "profile.notifications": "Notifications",
    "profile.dark_mode": "Dark Mode",
    "profile.language": "Language",
    "profile.help": "Help & Support",
    "profile.privacy": "Privacy Policy",
    "profile.rate": "Rate App",
    "profile.sign_out": "Sign Out",
    
    // Workshops
    "workshops.title": "Workshops",
    "workshops.upcoming": "Upcoming Workshops",
    "workshops.my_workshops": "My Workshops",
    "workshops.join": "Join Workshop",
    "workshops.registered": "Registered",
    
    // Languages
    "lang.english": "English",
    "lang.hindi": "हिंदी",
    "lang.tamil": "தமிழ்",
    "lang.telugu": "తెలుగు",
  },
  
  hi: {
    // Navigation
    "nav.home": "मुख्य",
    "nav.therapy": "चिकित्सा",
    "nav.exercises": "अभ्यास",
    "nav.library": "पुस्तकालय",
    "nav.profile": "प्रोफाइल",
    
    // Common
    "common.loading": "लोड हो रहा है...",
    "common.error": "त्रुटि",
    "common.success": "सफलता",
    "common.cancel": "रद्द करें",
    "common.continue": "जारी रखें",
    "common.back": "वापस",
    "common.next": "अगला",
    "common.previous": "पिछला",
    "common.complete": "पूर्ण",
    "common.save": "सेव करें",
    "common.edit": "संपादित करें",
    "common.delete": "हटाएं",
    "common.search": "खोजें",
    "common.filter": "फ़िल्टर",
    "common.all": "सभी",
    "common.free": "मुफ्त",
    "common.premium": "प्रीमियम",
    
    // Home
    "home.greeting": "नमस्ते, {{name}}!",
    "home.mood.question": "आज आप कैसा महसूस कर रहे हैं?",
    "home.mood.great": "बहुत अच्छा",
    "home.mood.okay": "ठीक है",
    "home.mood.low": "उदास",
    "home.daily_tip": "दैनिक सुझाव",
    "home.quick_actions": "त्वरित कार्य",
    "home.recommendations": "आपके लिए सुझाव",
    "home.progress": "आपकी प्रगति",
  },
  
  ta: {
    // Navigation
    "nav.home": "முகப்பு",
    "nav.therapy": "சிகிச்சை",
    "nav.exercises": "பயிற்சிகள்",
    "nav.library": "நூலகம்",
    "nav.profile": "சுயவிவரம்",
    
    // Common
    "common.loading": "ஏற்றுகிறது...",
    "common.error": "பிழை",
    "common.success": "வெற்றி",
    "common.cancel": "ரத்து",
    "common.continue": "தொடர்",
    "common.back": "பின்",
    "common.next": "அடுத்து",
    "common.previous": "முந்தைய",
    "common.complete": "முடிவு",
    "common.save": "சேமி",
    "common.edit": "திருத்து",
    "common.delete": "நீக்கு",
    "common.search": "தேடு",
    "common.filter": "வடிகட்டு",
    "common.all": "அனைத்தும்",
    "common.free": "இலவசம்",
    "common.premium": "பிரீமியம்",
    
    // Home
    "home.greeting": "வணக்கம், {{name}}!",
    "home.mood.question": "இன்று நீங்கள் எப்படி உணர்கிறீர்கள்?",
    "home.mood.great": "மிகவும் நன்றாக",
    "home.mood.okay": "சரி",
    "home.mood.low": "குறைவாக",
    "home.daily_tip": "தினசரி குறிப்பு",
    "home.quick_actions": "விரைவு செயல்கள்",
    "home.recommendations": "உங்களுக்கான பரிந்துரைகள்",
    "home.progress": "உங்கள் முன்னேற்றம்",
  },
  
  te: {
    // Navigation
    "nav.home": "హోమ్",
    "nav.therapy": "చికిత్స",
    "nav.exercises": "వ్యాయామాలు",
    "nav.library": "లైబ్రరీ",
    "nav.profile": "ప్రొఫైల్",
    
    // Common
    "common.loading": "లోడ్ అవుతోంది...",
    "common.error": "లోపం",
    "common.success": "విజయం",
    "common.cancel": "రద్దు",
    "common.continue": "కొనసాగు",
    "common.back": "వెనుక",
    "common.next": "తరువాత",
    "common.previous": "మునుపటి",
    "common.complete": "పూర్తి",
    "common.save": "సేవ్",
    "common.edit": "సవరించు",
    "common.delete": "తొలగించు",
    "common.search": "వెతుకు",
    "common.filter": "ఫిల్టర్",
    "common.all": "అన్నీ",
    "common.free": "ఉచితం",
    "common.premium": "ప్రీమియం",
    
    // Home
    "home.greeting": "నమస్కారం, {{name}}!",
    "home.mood.question": "ఈ రోజు మీరు ఎలా అనుభవిస్తున్నారు?",
    "home.mood.great": "చాలా బాగా",
    "home.mood.okay": "బాగానే",
    "home.mood.low": "తక్కువ",
    "home.daily_tip": "రోజువారీ చిట్కా",
    "home.quick_actions": "త్వరిత చర్యలు",
    "home.recommendations": "మీ కోసం సిఫార్సులు",
    "home.progress": "మీ పురోగతి",
  },
};

let currentLanguage = "en";

export function setLanguage(lang: string) {
  if (translations[lang]) {
    currentLanguage = lang;
  }
}

export function getCurrentLanguage() {
  return currentLanguage;
}

export function t(key: string, params?: Record<string, string>): string {
  const translation = translations[currentLanguage]?.[key] || translations.en[key] || key;
  
  if (!params) {
    return translation;
  }
  
  return Object.entries(params).reduce((str, [key, value]) => {
    return str.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }, translation);
}

export function getAvailableLanguages() {
  return [
    { code: "en", name: "English", nativeName: "English" },
    { code: "hi", name: "Hindi", nativeName: "हिंदी" },
    { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
    { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  ];
}
