import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center animate-fade-in">
      <div className="text-center animate-scale-in">
        <div className="mb-4 animate-pulse-subtle flex items-center justify-center">
          <img src="/icon.png" alt="Alayn Logo" className="w-24 h-24 mx-auto rounded-full shadow-lg" />
        </div>
        <h1 className="text-4xl font-bold mb-2" style={{ color: '#00916E' }}>Alayn</h1>
        <p className="text-lg opacity-90" style={{ color: '#00916E' }}>Align your life</p>
        <div className="mt-8">
          <div className="w-16 h-1 rounded-full mx-auto animate-pulse" style={{ background: '#00916E' }}></div>
        </div>
      </div>
    </div>
  );
}
