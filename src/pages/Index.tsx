import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import InputPanel from '@/components/InputPanel';
import ResultsSection from '@/components/ResultsSection';
import PersonalizationWizard from '@/components/PersonalizationWizard';
import AILoadingScreen from '@/components/AILoadingScreen';
import PersonalizedResults from '@/components/PersonalizedResults';
import { isUserLoggedIn } from '@/components/Header';
import { Category, ExamSelection, Gender, StateQuota, PersonalizationPreferences } from '@/data/mockCollegeData';

interface RankInputs {
  jeeMainCRL: string;
  jeeMainCategory: string;
  jeeAdvancedCRL: string;
  jeeAdvancedCategory: string;
}

type ViewMode = 'basic' | 'wizard' | 'loading' | 'personalized';

const Index = () => {
  const navigate = useNavigate();
  const [examSelection, setExamSelection] = useState<ExamSelection | ''>('');
  const [rankInputs, setRankInputs] = useState<RankInputs>({
    jeeMainCRL: '',
    jeeMainCategory: '',
    jeeAdvancedCRL: '',
    jeeAdvancedCategory: ''
  });
  const [category, setCategory] = useState<Category | ''>('');
  const [gender, setGender] = useState<Gender>('All');
  const [stateQuota, setStateQuota] = useState<StateQuota>('All');
  const [viewMode, setViewMode] = useState<ViewMode>('basic');
  const [preferences, setPreferences] = useState<PersonalizationPreferences | null>(null);

  // CHANGED: Enhanced personalization protection - checks auth before proceeding
  const handlePersonalize = () => {
    if (!isUserLoggedIn()) {
      // Store redirect info and action, then redirect to auth page
      localStorage.setItem('ranksetgo_redirect', '/');
      localStorage.setItem('ranksetgo_action', 'personalize');
      navigate('/auth');
      return;
    }
    // Only proceed to wizard if user is logged in
    setViewMode('wizard');
  };

  const handleWizardComplete = (prefs: PersonalizationPreferences) => {
    setPreferences(prefs);
    setViewMode('loading');
  };

  const handleWizardCancel = () => {
    setViewMode('basic');
  };

  const handleLoadingComplete = () => {
    setViewMode('personalized');
  };

  const handleBackToBasic = () => {
    setViewMode('basic');
    setPreferences(null);
  };

  // Check if returning from auth with personalize action
  useEffect(() => {
    const action = localStorage.getItem('ranksetgo_action');
    if (action === 'personalize' && isUserLoggedIn()) {
      localStorage.removeItem('ranksetgo_action');
      setViewMode('wizard');
    }
  }, []);

  // CHANGED: Added auth protection for personalization views
  // Protect wizard, loading, and personalized views - redirect to auth if not logged in
  useEffect(() => {
    if ((viewMode === 'wizard' || viewMode === 'loading' || viewMode === 'personalized') && !isUserLoggedIn()) {
      localStorage.setItem('ranksetgo_redirect', '/');
      localStorage.setItem('ranksetgo_action', 'personalize');
      navigate('/auth');
      setViewMode('basic');
    }
  }, [viewMode, navigate]);

  // Show wizard - only if logged in
  if (viewMode === 'wizard') {
    if (!isUserLoggedIn()) {
      // This should not happen due to useEffect above, but adding safety check
      navigate('/auth');
      return null;
    }
    return <PersonalizationWizard onComplete={handleWizardComplete} onCancel={handleWizardCancel} />;
  }

  // Show loading - only if logged in
  if (viewMode === 'loading') {
    if (!isUserLoggedIn()) {
      // This should not happen due to useEffect above, but adding safety check
      navigate('/auth');
      return null;
    }
    return <AILoadingScreen onComplete={handleLoadingComplete} />;
  }

  // Show personalized results - only if logged in
  if (viewMode === 'personalized' && preferences && examSelection && category) {
    if (!isUserLoggedIn()) {
      // This should not happen due to useEffect above, but adding safety check
      navigate('/auth');
      return null;
    }
    return <PersonalizedResults examSelection={examSelection as ExamSelection} rankInputs={rankInputs} category={category as Category} stateQuota={stateQuota} preferences={preferences} onBack={handleBackToBasic} />;
  }

  // Default: Basic mode
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 lg:py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-8 lg:mb-12 animate-fade-in">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">
            Find Your Perfect College
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover eligible colleges and branches based on your JEE rank, category, and preferences. Get insights from previous year cutoffs and average placement packages.
          </p>
        </div>

        {/* Input Panel */}
        <InputPanel
          examSelection={examSelection}
          setExamSelection={setExamSelection}
          rankInputs={rankInputs}
          setRankInputs={setRankInputs}
          category={category}
          setCategory={setCategory}
          gender={gender}
          setGender={setGender}
          stateQuota={stateQuota}
          setStateQuota={setStateQuota}
          onPersonalize={handlePersonalize}
        />

        {/* Results Section */}
        <ResultsSection examSelection={examSelection} rankInputs={rankInputs} category={category} stateQuota={stateQuota} />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>© 2024 RankSetGo. All rights reserved.</p>
          <p className="mt-1">
            Helping JEE aspirants make informed decisions about their future.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;