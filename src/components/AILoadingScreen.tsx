import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Brain, BarChart3, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isUserLoggedIn } from '@/components/Header';

interface AILoadingScreenProps {
  onComplete: () => void;
}

const loadingSteps = [
  { icon: Brain, text: 'Analyzing your rank and category...' },
  { icon: BarChart3, text: 'Processing preference data...' },
  { icon: Target, text: 'Matching colleges to your profile...' },
  { icon: Sparkles, text: 'Optimizing recommendations using AI...' },
];

const AILoadingScreen = ({ onComplete }: AILoadingScreenProps) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  // CHANGED: Added auth protection - redirect to sign in if not logged in
  useEffect(() => {
    if (!isUserLoggedIn()) {
      localStorage.setItem('ranksetgo_redirect', '/');
      localStorage.setItem('ranksetgo_action', 'personalize');
      navigate('/auth');
    }
  }, [navigate]);

  useEffect(() => {
    const stepDuration = 1000; // 1 second per step
    const totalDuration = loadingSteps.length * stepDuration;
    const progressInterval = 50;
    
    let elapsed = 0;
    const progressTimer = setInterval(() => {
      elapsed += progressInterval;
      setProgress((elapsed / totalDuration) * 100);
      
      const newStep = Math.min(
        Math.floor(elapsed / stepDuration),
        loadingSteps.length - 1
      );
      setCurrentStep(newStep);
      
      if (elapsed >= totalDuration) {
        clearInterval(progressTimer);
        setTimeout(onComplete, 500);
      }
    }, progressInterval);

    return () => clearInterval(progressTimer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
      <div className="max-w-md w-full px-6 text-center">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-32 w-32 rounded-full bg-primary/20 animate-ping" />
          </div>
          <div className="relative flex items-center justify-center">
            <div className="h-24 w-24 rounded-full gradient-primary flex items-center justify-center shadow-lg animate-pulse">
              <Sparkles className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl font-bold text-foreground mb-4 animate-fade-in">
          Personalizing Your Results
        </h2>

        {/* Steps */}
        <div className="space-y-3 mb-8">
          {loadingSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isComplete = index < currentStep;

            return (
              <div
                key={index}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg transition-all duration-300',
                  isActive && 'bg-primary/10',
                  isComplete && 'opacity-50'
                )}
              >
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors',
                    isActive ? 'gradient-primary' : 'bg-secondary',
                    isComplete && 'bg-success'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-4 w-4',
                      isActive || isComplete ? 'text-primary-foreground' : 'text-muted-foreground'
                    )}
                  />
                </div>
                <span
                  className={cn(
                    'text-sm transition-colors',
                    isActive ? 'text-foreground font-medium' : 'text-muted-foreground'
                  )}
                >
                  {step.text}
                </span>
                {isActive && (
                  <div className="ml-auto">
                    <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
          <div
            className="h-full gradient-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-sm text-muted-foreground mt-4">
          This won't take long...
        </p>
      </div>
    </div>
  );
};

export default AILoadingScreen;
