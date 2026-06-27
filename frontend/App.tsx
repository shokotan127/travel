import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { AreaInput } from './components/AreaInput';
import { InspirationView } from './components/InspirationView';
import { DurationSelector } from './components/DurationSelector';
import { PlanView } from './components/PlanView';
import { LoadingSpinner } from './components/LoadingSpinner';
import { getAreaInspiration, getDayPlan } from './services/geminiService';
import { fetchVideosForQueries } from './services/youtubeService';
import { AppStep, InspirationResponse, PlanResponse, Duration, YouTubeVideo } from './types';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('input');
  const [area, setArea] = useState<string>('');
  const [inspirationData, setInspirationData] = useState<InspirationResponse | null>(null);
  const [youtubeData, setYoutubeData] = useState<Record<string, YouTubeVideo[]>>({});
  const [selectedDirection, setSelectedDirection] = useState<string>('');
  const [planData, setPlanData] = useState<PlanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAreaSubmit = useCallback(async (submittedArea: string) => {
    setArea(submittedArea);
    setStep('loading_inspiration');
    setError(null);
    setYoutubeData({});
    try {
      const data = await getAreaInspiration(submittedArea);
      setInspirationData(data);
      setStep('inspiration');
      
      // Fetch YouTube videos asynchronously to not block the UI
      fetchVideosForQueries(data.youtubeSearches).then(setYoutubeData);
    } catch (err: any) {
      console.error("Inspiration Error:", err);
      setError(`Error: ${err.message || 'Failed to gather inspiration. Please try again.'}`);
      setStep('input');
    }
  }, []);

  const handleDirectionSelect = useCallback((direction: string) => {
    setSelectedDirection(direction);
  }, []);

  const handleDurationSelect = useCallback(async (duration: Duration) => {
    if (!inspirationData || !area || !selectedDirection) return;
    
    setStep('loading_plan');
    setError(null);
    try {
      const plan = await getDayPlan(
        area,
        selectedDirection,
        duration,
        inspirationData.weatherSummary
      );
      setPlanData(plan);
      setStep('plan');
    } catch (err: any) {
      console.error("Plan Error:", err);
      setError(`Error: ${err.message || 'Failed to generate the plan. Please try again.'}`);
      setStep('inspiration');
      setSelectedDirection(''); 
    }
  }, [area, inspirationData, selectedDirection]);

  const handleReset = useCallback(() => {
    setStep('input');
    setArea('');
    setInspirationData(null);
    setYoutubeData({});
    setSelectedDirection('');
    setPlanData(null);
    setError(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="break-words">{error}</p>
          </div>
        )}

        {step === 'input' && (
          <AreaInput onSubmit={handleAreaSubmit} />
        )}

        {step === 'loading_inspiration' && (
          <LoadingSpinner message={`Gathering inspiration for ${area}...`} />
        )}

        {step === 'inspiration' && inspirationData && !selectedDirection && (
          <InspirationView 
            area={area} 
            data={inspirationData} 
            youtubeData={youtubeData}
            onSelectDirection={handleDirectionSelect} 
          />
        )}

        {step === 'inspiration' && inspirationData && selectedDirection && (
          <DurationSelector 
            direction={selectedDirection}
            onSelect={handleDurationSelect}
            onBack={() => setSelectedDirection('')}
          />
        )}

        {step === 'loading_plan' && (
          <LoadingSpinner message="Crafting your perfect itinerary..." />
        )}

        {step === 'plan' && planData && (
          <PlanView 
            area={area}
            plan={planData}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
};

export default App;
