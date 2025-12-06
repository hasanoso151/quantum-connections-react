import { useState, useRef, useEffect, type FC } from 'react';
import { Fingerprint } from 'lucide-react';

interface SimulationProps {
  isApiReady: boolean;
  onComplete: () => void;
}

export const Simulation: FC<SimulationProps> = ({ isApiReady, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [message, setMessage] = useState("اضغط مع الاستمرار لبدء المسح");
  const requestRef = useRef<number>(0);
  const holdStartRef = useRef<number>(0);

  const startHold = () => {
    setIsHolding(true);
    holdStartRef.current = Date.now();
    setMessage("جاري محاذاة الأرواح...");
  };

  const endHold = () => {
    setIsHolding(false);
    // Only reset if not complete
    if (progress < 100) {
      setProgress(0);
      setMessage("تم قطع الاتصال. حاول مجدداً.");
      setTimeout(() => setMessage("اضغط مع الاستمرار لبدء المسح"), 1000);
    }
  };

  useEffect(() => {
    const updateProgress = () => {
      if (isHolding) {
        // Calculate progress over 3 seconds (3000ms)
        const elapsed = Date.now() - holdStartRef.current;
        const newProgress = Math.min((elapsed / 3000) * 100, 100);
        
        setProgress(newProgress);

        if (newProgress >= 100) {
          if (isApiReady) {
            onComplete();
          } else {
            setMessage("جاري استلام البيانات الكونية...");
            // Keep spinning at 100 until API is ready
          }
        } else {
           requestRef.current = requestAnimationFrame(updateProgress);
        }
      } else {
         if (progress < 100) {
           setProgress(0); // Instant reset on release
         }
      }
    };

    if (isHolding) {
      requestRef.current = requestAnimationFrame(updateProgress);
    } else {
      cancelAnimationFrame(requestRef.current);
    }

    return () => cancelAnimationFrame(requestRef.current);
  }, [isHolding, isApiReady, onComplete]); // Add dependencies carefully

  // Effect to trigger complete if we are holding at 100% and API becomes ready
  useEffect(() => {
    if (progress >= 100 && isApiReady) {
      onComplete();
    }
  }, [progress, isApiReady, onComplete]);


  return (
    <div className={`flex flex-col items-center justify-center h-screen w-full bg-black relative overflow-hidden transition-all duration-300 select-none ${isHolding ? 'scale-105' : ''}`} dir="rtl">
      
      {/* Dynamic Background */}
      <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-black to-black transition-opacity duration-1000 ${isHolding ? 'opacity-100' : 'opacity-50'}`}></div>
      
      <div className={`relative z-10 flex flex-col items-center gap-8 ${isHolding ? 'animate-shake' : ''}`}>
        
        {/* Progress Circle Container */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Background Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="#1e293b"
              strokeWidth="4"
            />
            {/* Progress Ring */}
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke={progress === 100 ? '#4ade80' : '#8b5cf6'}
              strokeWidth="6"
              strokeDasharray={553} // 2 * PI * 88
              strokeDashoffset={553 - (553 * progress) / 100}
              strokeLinecap="round"
              className="transition-all duration-75 ease-linear"
            />
          </svg>

          {/* Interaction Button */}
          <button
            onMouseDown={startHold}
            onMouseUp={endHold}
            onMouseLeave={endHold}
            onTouchStart={startHold}
            onTouchEnd={endHold}
            onContextMenu={(e) => e.preventDefault()}
            style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'none' }}
            className={`w-32 h-32 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-700 shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all duration-300 outline-none cursor-pointer select-none ${isHolding ? 'scale-90 brightness-125 shadow-[0_0_60px_rgba(139,92,246,0.8)]' : 'hover:scale-105 active:scale-95'}`}
          >
            <Fingerprint className={`w-16 h-16 text-white/80 pointer-events-none ${isHolding ? 'animate-pulse' : ''}`} />
          </button>
        </div>

        {/* Text Feedback */}
        <div className="text-center h-20 select-none">
          <h2 className="text-2xl font-bold font-['Cairo'] text-white mb-2 tracking-wide">
             {progress >= 100 && !isApiReady ? "جاري الاتصال..." : (progress >= 100 ? "اكتمل!" : "المسح الكوني")}
          </h2>
          <p className={`text-sm font-mono transition-colors duration-300 ${isHolding ? 'text-purple-300' : 'text-gray-500'}`}>
            {message}
          </p>
        </div>

      </div>

      {/* Decorative particles for visual noise */}
      {isHolding && (
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute top-1/2 left-1/2 w-full h-1 bg-purple-500/20 -translate-x-1/2 -translate-y-1/2 blur-xl animate-pulse"></div>
        </div>
      )}
    </div>
  );
};