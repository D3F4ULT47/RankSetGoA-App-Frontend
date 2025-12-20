import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Region,
  BranchPreference,
  FeeLevel,
  InstituteType,
  PersonalizationPreferences,
  ALL_BRANCHES,
} from '@/data/mockCollegeData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { isUserLoggedIn } from '@/components/Header';

interface PersonalizationWizardProps {
  onComplete: (preferences: PersonalizationPreferences) => void;
  onCancel: () => void;
}

interface Question {
  id: string;
  title: string;
  subtitle: string;
  type: 'single' | 'multi' | 'branch-select';
  options?: { value: string; label: string; description?: string }[];
}

const questions: Question[] = [
  {
    id: 'region',
    title: 'Preferred Region?',
    subtitle: 'Select your preferred location for college',
    type: 'single',
    options: [
      { value: 'North', label: 'North', description: 'Delhi, UP, Rajasthan, Punjab' },
      { value: 'South', label: 'South', description: 'Tamil Nadu, Karnataka, Kerala, Telangana' },
      { value: 'East', label: 'East', description: 'West Bengal, Odisha, Bihar, Jharkhand' },
      { value: 'West', label: 'West', description: 'Maharashtra, Gujarat, Goa' },
      { value: 'No preference', label: 'No Preference', description: 'Open to all regions' },
    ],
  },
  {
    id: 'branchPreference',
    title: 'Branch Preference?',
    subtitle: 'What type of engineering interests you?',
    type: 'single',
    options: [
      { value: 'Circuital', label: 'Circuital', description: 'CSE, ECE, EE, IT - High placement demand' },
      { value: 'Non-Circuital', label: 'Non-Circuital', description: 'Mechanical, Civil, Chemical, etc.' },
      { value: 'Specific', label: 'Specific Branch', description: 'Choose a specific branch' },
      { value: 'Any', label: 'Any Branch', description: 'Open to all branches' },
    ],
  },
  {
    id: 'specificBranch',
    title: 'Select Your Preferred Branch',
    subtitle: 'Choose the specific branch you want to pursue',
    type: 'branch-select',
  },
  {
    id: 'feeLevel',
    title: 'Fee Comfort Level?',
    subtitle: 'What is your budget for education?',
    type: 'single',
    options: [
      { value: 'Low', label: 'Low Budget', description: 'Government institutes only (₹1-2 LPA)' },
      { value: 'Moderate', label: 'Moderate', description: 'Semi-govt & some private (₹2-5 LPA)' },
      { value: 'High', label: 'High Budget', description: 'Premium private allowed (₹5+ LPA)' },
      { value: 'Any', label: 'Any Budget', description: 'Open to government, semi-private, and private institutes' },
    ],
  },
  {
    id: 'instituteTypes',
    title: 'Preferred Institute Types',
    subtitle: 'Select all that apply',
    type: 'multi',
    options: [
      { value: 'IIT', label: 'IITs', description: 'Indian Institutes of Technology' },
      { value: 'NIT', label: 'NITs', description: 'National Institutes of Technology' },
      { value: 'IIIT', label: 'IIITs', description: 'Indian Institutes of Information Technology' },
      { value: 'GFTI', label: 'GFTIs', description: 'Government Funded Technical Institutes' },
      { value: 'Private', label: 'Private', description: 'Private Universities' },
    ],
  },
  {
    id: 'locationPriority',
    title: 'Location Priority?',
    subtitle: 'Do you prefer metro cities or are you open to tier-2 locations?',
    type: 'single',
    options: [
      { value: 'Metro', label: 'Metro Cities', description: 'Delhi, Mumbai, Bangalore, Chennai, etc.' },
      { value: 'Tier-2', label: 'Tier-2 Cities', description: 'Smaller cities with good colleges' },
      { value: 'Any', label: 'No Preference', description: 'Open to any location' },
    ],
  },
  {
    id: 'focus',
    title: 'What matters most to you in a college?',
    subtitle: 'Select what you want to optimize for (you can refine later)',
    type: 'multi',
    options: [
      { value: 'Placements', label: 'Strong Placements', description: 'High average packages & recruiters' },
      { value: 'Research', label: 'Research & Higher Studies', description: 'Academia, MS/PhD pathways' },
      { value: 'Exposure', label: 'Exposure & Opportunities', description: 'Internships, competitions, industry exposure' },
      { value: 'Branch', label: 'Specific Branch Preference', description: 'Strong department reputation' },
      { value: 'Balanced', label: 'Balanced Experience', description: 'Academics + placements + campus life' },
    ],
  },
];

const PersonalizationWizard = ({ onComplete, onCancel }: PersonalizationWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({
    region: '',
    branchPreference: '',
    specificBranch: '',
    feeLevel: '',
    instituteTypes: [],
    locationPriority: '',
    focus: [],
  });

  // Filter questions based on branch preference
  const activeQuestions = questions.filter((q) => {
    if (q.id === 'specificBranch') {
      return answers.branchPreference === 'Specific';
    }
    return true;
  });

  const currentQuestion = activeQuestions[currentStep];
  const progress = ((currentStep + 1) / activeQuestions.length) * 100;

  const handleSingleSelect = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleMultiSelect = (value: string) => {
    setAnswers((prev) => {
      const current = prev[currentQuestion.id] as string[];
      if (current.includes(value)) {
        return { ...prev, [currentQuestion.id]: current.filter((v) => v !== value) };
      }
      return { ...prev, [currentQuestion.id]: [...current, value] };
    });
  };

  const canProceed = () => {
    const answer = answers[currentQuestion.id];
    if (currentQuestion.type === 'multi') {
      return (answer as string[]).length > 0;
    }
    return !!answer;
  };

  const handleNext = () => {
    if (currentStep < activeQuestions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Complete the wizard
      const preferences: PersonalizationPreferences = {
        region: answers.region as Region,
        branchPreference: answers.branchPreference as BranchPreference,
        specificBranch: answers.specificBranch as string,
        feeLevel: answers.feeLevel as FeeLevel,
        instituteTypes: answers.instituteTypes as InstituteType[],
        locationPriority: answers.locationPriority as 'Metro' | 'Tier-2' | 'Any',
        focus: answers.focus as string[],
      };
      onComplete(preferences);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      onCancel();
    }
  };

  const navigate = useNavigate();

  // CHANGED: Added auth protection - redirect to sign in if not logged in
  useEffect(() => {
    if (!isUserLoggedIn()) {
      localStorage.setItem('ranksetgo_redirect', '/');
      localStorage.setItem('ranksetgo_action', 'personalize');
      navigate('/auth');
    }
  }, [navigate]);

  // Don't render if user is not logged in
  if (!isUserLoggedIn()) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Personalize Your Results</h1>
              <p className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {activeQuestions.length}
              </p>
            </div>
          </div>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-secondary h-1">
        <div
          className="h-full gradient-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-2xl mx-auto px-6 py-12">
          <div className="text-center mb-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {currentQuestion.title}
            </h2>
            <p className="text-muted-foreground">{currentQuestion.subtitle}</p>
          </div>

          {/* Options */}
          <div className="space-y-3 animate-fade-in">
            {currentQuestion.type === 'branch-select' ? (
              <Select
                value={answers.specificBranch as string}
                onValueChange={(value) => handleSingleSelect(value)}
              >
                <SelectTrigger className="w-full h-14 bg-card border-border">
                  <SelectValue placeholder="Select a branch" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border max-h-[300px]">
                  {ALL_BRANCHES.map((branch) => (
                    <SelectItem key={branch} value={branch}>
                      {branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              currentQuestion.options?.map((option) => {
                const isSelected =
                  currentQuestion.type === 'multi'
                    ? (answers[currentQuestion.id] as string[]).includes(option.value)
                    : answers[currentQuestion.id] === option.value;

                return (
                  <button
                    key={option.value}
                    onClick={() =>
                      currentQuestion.type === 'multi'
                        ? handleMultiSelect(option.value)
                        : handleSingleSelect(option.value)
                    }
                    className={cn(
                      'w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200',
                      'hover:border-primary/30 hover:bg-primary/3',
                      isSelected
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-card'
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                        isSelected
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground/30'
                      )}
                    >
                      {isSelected && <Check className="h-4 w-4 text-primary-foreground" />}
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-medium text-foreground">{option.label}</div>
                      {option.description && (
                        <div className="text-sm text-muted-foreground">{option.description}</div>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Button variant="outline" onClick={handleBack} className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            {currentStep === 0 ? 'Cancel' : 'Back'}
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="gap-2 gradient-primary text-primary-foreground hover:opacity-90"
          >
            {currentStep === activeQuestions.length - 1 ? (
              <>
                <Sparkles className="h-4 w-4" />
                Get Personalized Results
              </>
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PersonalizationWizard;
