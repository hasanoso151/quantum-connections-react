import React from 'react';

// ==========================================
// 1. كاشف الأخطاء (Error Boundary)
// وظيفته: إمساك الخطأ وعرضه على الشاشة
// ==========================================
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 m-4 bg-red-900/80 border-2 border-red-500 rounded-lg text-white dir-ltr text-left">
          <h3 className="font-bold text-lg mb-2">⚠️ Error Detected:</h3>
          <pre className="whitespace-pre-wrap text-sm font-mono bg-black/50 p-2 rounded">
            {this.state.error?.message}
          </pre>
          <p className="mt-2 text-xs text-gray-300">
            Take a screenshot of this error and show it to the developer.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

// ==========================================
// 2. الأيقونات المدمجة (SVGs)
// لتجنب مشاكل تحميل المكتبات
// ==========================================
const Icons = {
  Infinity: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4Z"/></svg>
  ),
  Sparkles: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M9 3v4"/><path d="M7 1v8"/></svg>
  ),
  Atom: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z"/><path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z"/></svg>
  ),
  Orbit: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.3 7.208a10 10 0 1 1-14.6 0"/><path d="M12 2v2"/></svg>
  )
};

// ==========================================
// 3. المكون الأساسي (Logic)
// ==========================================
const facts = [
  { iconKey: 'Infinity' as keyof typeof Icons, title: "التشابك الكمي", text: "في فيزياء الكم، عندما يتفاعل جسيمان، يصبحان مرتبطين للأبد." },
  { iconKey: 'Sparkles' as keyof typeof Icons, title: "غبار النجوم", text: "العناصر التي تكون أجسادنا خُلقت في قلوب النجوم المحتضرة." },
  { iconKey: 'Atom' as keyof typeof Icons, title: "تأثير المراقب", text: "الواقع ليس ثابتاً. مجرد ملاحظة الجسيمات تغير سلوكها." },
  { iconKey: 'Orbit' as keyof typeof Icons, title: "الرنين الكوني", text: "لكل شيء تردد اهتزازي. عندما يلتقي نظامان بتردد متقارب، تنتقل الطاقة." }
];

const CosmicInsightInternal = () => {
  // Safe Hook Usage
  const [fact, setFact] = React.useState(facts[0]);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    setFact(facts[Math.floor(Math.random() * facts.length)]);
    
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const IconSVG = Icons[fact.iconKey];

  return (
    <div className="w-full max-w-sm aspect-[4/3] relative mb-12 group select-none mx-auto">
      {/* Background */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md rounded-2xl border border-amber-500/20 shadow-[0_0_40px_rgba(217,119,6,0.1)] animate-pulse transition-all duration-[3000ms]"></div>
      
      {/* Content */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center p-8 text-center transition-all duration-1000 transform ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <div className="mb-5 p-3 bg-gradient-to-br from-amber-500/10 to-amber-900/10 rounded-full text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.15)] border border-amber-500/20">
          <IconSVG />
        </div>
        <h3 className="text-xl font-serif text-amber-200 mb-3">{fact.title}</h3>
        <p className="text-amber-100/80 text-sm leading-7 font-light" dir="rtl">"{fact.text}"</p>
      </div>
    </div>
  );
};

// ==========================================
// 4. التصدير النهائي (Wrapped)
// نغلف المكون بكاشف الأخطاء
// ==========================================
export const CosmicInsight = () => {
  return (
    <ErrorBoundary>
      <CosmicInsightInternal />
    </ErrorBoundary>
  );
};

// تصدير افتراضي احتياطي
export default CosmicInsight;