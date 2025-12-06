// @ts-nocheck
import { useRef, useState, useMemo, type FC } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Download, RefreshCw, Infinity as InfinityIcon, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import { SoulCore } from './ParticleScene';
import { RelationshipType, UserInput, SimulationResult } from '../types';

interface ResultViewProps {
  input: UserInput;
  result: SimulationResult;
  onReset: () => void;
}

const themeConfig = {
  [RelationshipType.LOVE]: {
    colors: ['#E11D48', '#F59E0B', '#FFF1F2'],
    accentColor: "text-[#E11D48]",
    borderColor: "border-[#E11D48]",
    glowColor: "shadow-[0_0_30px_rgba(225,29,72,0.6)]",
    cardBg: "from-[#2A0A10] via-black to-black",
    percentageColor: "text-white",
    textGlow: "0 0 10px rgba(225, 29, 72, 1), 0 0 20px rgba(225, 29, 72, 0.8), 0 0 40px rgba(225, 29, 72, 0.6)"
  },
  [RelationshipType.FRIENDSHIP]: {
    colors: ['#06B6D4', '#84CC16', '#F0F9FF'],
    accentColor: "text-[#06B6D4]",
    borderColor: "border-[#06B6D4]",
    glowColor: "shadow-[0_0_30px_rgba(6,182,212,0.6)]",
    cardBg: "from-[#082f36] via-black to-black",
    percentageColor: "text-white",
    textGlow: "0 0 10px rgba(6, 182, 212, 1), 0 0 20px rgba(6, 182, 212, 0.8), 0 0 40px rgba(6, 182, 212, 0.6)"
  },
  [RelationshipType.RIVALRY]: {
    colors: ['#F97316', '#94A3B8', '#1c1917'],
    accentColor: "text-[#F97316]",
    borderColor: "border-[#F97316]",
    glowColor: "shadow-[0_0_30px_rgba(249,115,22,0.6)]",
    cardBg: "from-[#2a1305] via-black to-black",
    percentageColor: "text-white",
    textGlow: "0 0 10px rgba(249, 115, 22, 1), 0 0 20px rgba(249, 115, 22, 0.8), 0 0 40px rgba(249, 115, 22, 0.6)"
  },
  [RelationshipType.FAMILY]: {
    colors: ['#10B981', '#D97706', '#ECFDF5'],
    accentColor: "text-[#10B981]",
    borderColor: "border-[#10B981]",
    glowColor: "shadow-[0_0_30px_rgba(16,185,129,0.6)]",
    cardBg: "from-[#022c1e] via-black to-black",
    percentageColor: "text-white",
    textGlow: "0 0 10px rgba(16, 185, 129, 1), 0 0 20px rgba(16, 185, 129, 0.8), 0 0 40px rgba(16, 185, 129, 0.6)"
  }
};

export const ResultView: FC<ResultViewProps> = ({ input, result, onReset }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<any>(null);

  const theme = themeConfig[input.relationship] || themeConfig[RelationshipType.LOVE];

  // Calculate a consistent "match" percentage based on names or random for demo
  const matchPercentage = useMemo(() => {
    return Math.floor(Math.random() * (99 - 85 + 1)) + 85;
  }, [input.name1, input.name2]);

  const handleShare = async () => {
    if (!cardRef.current) return;

    setIsCapturing(true);
    const toastId = toast.loading("جاري تجهيز بطاقة الرابطة...");

    try {
      // 1. Reset Camera to perfect angle
      if (controlsRef.current) {
        controlsRef.current.autoRotate = false;
        controlsRef.current.reset();
        // Wait for renderer to update the frame
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // 2. Capture the card as an image
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2, // Higher quality
        logging: false,
        useCORS: true
      });

      // 3. Trigger Download
      const link = document.createElement('a');
      link.download = `Quantum-Connection-${input.relationship}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      // 4. Copy Site URL
      await navigator.clipboard.writeText(window.location.origin);

      toast.dismiss(toastId);
      toast.success("تم حفظ الصورة ونسخ الرابط! شاركهما مع أصدقائك ليعيشوا التجربة ✨", {
        duration: 5000
      });

    } catch (error) {
      console.error("Capture failed:", error);
      toast.error("حدث خطأ أثناء حفظ الصورة");
    } finally {
      // Restore rotation
      if (controlsRef.current) {
        controlsRef.current.autoRotate = true;
      }
      setIsCapturing(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">

      {/* Ambient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black opacity-80"></div>

      {/* Main Card Container */}
      <div
        ref={cardRef}
        className={`
        relative w-full max-w-[400px] h-[800px] max-h-[90vh] 
        rounded-[40px] border-2 ${theme.borderColor} ${theme.glowColor}
        bg-gradient-to-b ${theme.cardBg} via-black/80 to-black 
        flex flex-col items-center overflow-hidden
        transition-all duration-700
      `}>

        {/* Top Decorative Border Inner Line */}
        <div className={`absolute top-4 left-4 right-4 bottom-4 rounded-[32px] border border-white/5 pointer-events-none z-20`}></div>

        {/* Content Layer */}
        <div className="relative z-10 w-full h-full flex flex-col pt-12 pb-8 px-6">

          {/* Header Section */}
          <div className="text-center space-y-2 animate-fade-in-down">
            <div className="flex items-center justify-center gap-2 mb-1 opacity-80">
              <span className="text-sm font-['Cairo'] text-white/60">بين</span>
            </div>

            <h1 className="text-4xl font-['Rakkas'] text-white" style={{ textShadow: theme.textGlow }}>
              {input.name1}
            </h1>

            <div className={`flex justify-center py-1 ${theme.accentColor}`}>
              <InfinityIcon size={24} strokeWidth={1.5} />
            </div>

            <h1 className="text-4xl font-['Rakkas'] text-white" style={{ textShadow: theme.textGlow }}>
              {input.name2}
            </h1>

            <p className="text-lg font-['Cairo'] text-white mt-2" style={{ textShadow: theme.textGlow }}>
              {result.archetypeTitle}
            </p>
          </div>

          {/* 3D Visualization Area */}
          <div className="flex-1 w-full relative -my-4">
            <Canvas
              gl={{ antialias: false, stencil: false, depth: false, alpha: true, preserveDrawingBuffer: true }}
              dpr={[1, 1.5]}
              camera={{ position: [0, 0, 5.5], fov: 50 }}
              className="pointer-events-auto"
            >
              <OrbitControls
                ref={controlsRef}
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.8}
              />
              <SoulCore
                colors={theme.colors}
                type={input.relationship}
                qShape={input.qShape}
                qMotion={input.qMotion}
              />
              {/* @ts-ignore */}
              <EffectComposer disableNormalPass>
                {/* @ts-ignore */}
                <Bloom luminanceThreshold={0.2} mipmapBlur intensity={0.8} radius={0.4} />
              </EffectComposer>
            </Canvas>

            {/* Percentage Overlay - Centered over the 3D core if desired, or slightly below */}
            <div className="absolute top-[75%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <span
                className={`text-5xl font-bold font-['IBM_Plex_Mono'] ${theme.percentageColor}`}
                style={{ textShadow: theme.textGlow }}
              >
                {matchPercentage}%
              </span>
            </div>
          </div>

          {/* Footer Section: Insight & Quote */}
          <div className="text-center space-y-6 relative z-30">
            <div className="space-y-3">
              <p
                className="text-white text-sm font-['Cairo'] leading-relaxed px-2 dir-rtl"
                style={{ textShadow: theme.textGlow }}
              >
                {result.insight}
              </p>

              <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

              <p
                className="text-white text-xs font-['Cairo'] italic"
                style={{ textShadow: theme.textGlow }}
              >
                "{result.quote || "حين تلتقي روحان، لا يعود للحدود معنى ولا للخوف وجود"}"
              </p>
            </div>

            {/* Action Buttons */}
            {/* Action Buttons */}
            {/* We use opacity-0 to hide them from the screenshot without removing them from DOM (fixing layout shift/disappearance bugs) */}
            <div className={`flex gap-3 justify-center items-center pt-2 transition-opacity duration-300 ${isCapturing ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <button
                onClick={onReset}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all hover:rotate-180 duration-500"
              >
                <RefreshCw size={18} />
              </button>

              <button
                onClick={handleShare}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-white transition-all shadow-lg active:scale-95 border border-white/10 ${input.relationship === RelationshipType.LOVE ? 'bg-gradient-to-r from-rose-600 to-amber-600' :
                  input.relationship === RelationshipType.FRIENDSHIP ? 'bg-gradient-to-r from-cyan-600 to-lime-600' :
                    input.relationship === RelationshipType.RIVALRY ? 'bg-gradient-to-r from-orange-600 to-stone-600' :
                      'bg-gradient-to-r from-emerald-600 to-teal-600'
                  }`}
              >
                <Download size={18} />
                <span className="font-['Cairo']">حفظ النتيجة والمشاركة</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};