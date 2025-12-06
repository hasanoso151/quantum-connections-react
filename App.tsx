import { useState, type FC } from 'react';
import { Toaster, toast } from 'sonner';
import { UserInput, SimulationResult, AppStep } from './types';
import { InputForm } from './components/InputForm';
import { CosmicLoader } from './components/CosmicLoader';
import { ResultView } from './components/ResultView';
import { generateCosmicResonance } from './services/geminiService';

const App: FC = () => {
  const [step, setStep] = useState<AppStep>('INPUT');
  const [inputData, setInputData] = useState<UserInput | null>(null);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [apiLoading, setApiLoading] = useState(false);

  const handleInputSubmit = (data: UserInput) => {
    setInputData(data);
    setStep('SIMULATING');
    setApiLoading(true);

    generateCosmicResonance(data)
      .then((aiResult) => {
        setResult(aiResult);
      })
      .catch((error) => {
        console.error("Simulation failed", error);
        toast.error("حدث خطأ في الاتصال بالكون. يرجى المحاولة مرة أخرى.");
        setStep('INPUT');
      })
      .finally(() => {
        setApiLoading(false);
      });
  };

  const handleLoaderComplete = () => {
    if (result) {
      setStep('RESULT');
    } else {
      setStep('INPUT');
      toast.error("تعذر الاتصال بالكون. حاول مرة أخرى.");
    }
  };

  const handleReset = () => {
    setInputData(null);
    setResult(null);
    setStep('INPUT');
  };

  return (
    <div className="min-h-screen w-full bg-black text-white relative">
      <Toaster position="top-center" dir="rtl" />
      <main className="w-full h-full">
        {step === 'INPUT' && (
           <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5980?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center">
             <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
             <div className="relative z-10 w-full">
               <InputForm onSubmit={handleInputSubmit} />
             </div>
           </div>
        )}
        
        {step === 'SIMULATING' && (
          <CosmicLoader 
            isApiReady={!apiLoading && result !== null} 
            onComplete={handleLoaderComplete} 
          />
        )}
        
        {step === 'RESULT' && inputData && result && (
          <ResultView 
            input={inputData} 
            result={result} 
            onReset={handleReset} 
          />
        )}
      </main>
    </div>
  );
};

export default App;