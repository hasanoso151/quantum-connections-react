import { useState, useEffect, type FC } from 'react';
import { CosmicInsight } from './CosmicInsight';

// Loading messages based on the "Cosmic Story" theme
const loadingMessages = [
  "جاري مسح ترددات الأرواح...",       // Scanning soul frequencies
  "تتم الآن محاذاة المدارات الكونية...", // Aligning cosmic orbits
  "تحليل كيمياء المشاعر...",          // Analyzing emotional chemistry
  "فك تشفير لغة الصمت بينكما...",     // Decoding the language of silence
  "جاري صياغة وثيقة القدر..."         // Drafting the destiny document
];

interface CosmicLoaderProps {
  isApiReady: boolean;
  onComplete: () => void;
}

export const CosmicLoader: FC<CosmicLoaderProps> = ({ isApiReady, onComplete }) => {
  const [msgIndex, setMsgIndex] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    // 1. Cycle through messages every 1.5 seconds with simple fade effect
    const textInterval = setInterval(() => {
      setOpacity(0); // Fade out
      setTimeout(() => {
        setMsgIndex((prev) => (prev + 1) % loadingMessages.length);
        setOpacity(1); // Fade in
      }, 300);
    }, 1500);

    // 2. Finish loading after 6 seconds (simulated delay for Insight view)
    const completeTimeout = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 6000);

    return () => {
      clearInterval(textInterval);
      clearTimeout(completeTimeout);
    };
  }, []);

  // Check both conditions: Minimum time elapsed AND API has returned a result
  useEffect(() => {
    if (minTimeElapsed && isApiReady) {
      onComplete();
    }
  }, [minTimeElapsed, isApiReady, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md p-6" dir="rtl">
      
      {/* 1. COSMIC INSIGHT (Replaces Ad Space) */}
      <CosmicInsight />

      {/* 2. COSMIC TEXT (Fade Effect) */}
      <div className="h-16 flex items-center justify-center">
        <p
          className="text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-purple-200 font-medium tracking-wide text-center transition-opacity duration-300"
          style={{ opacity: opacity }}
        >
          {loadingMessages[msgIndex]}
        </p>
      </div>

      {/* 3. LOADING INDICATOR */}
      <div className="mt-8 flex gap-2">
        <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
      </div>

    </div>
  );
};