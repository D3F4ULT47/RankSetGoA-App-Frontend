import { useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Filter, ArrowUpDown, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CollegeCard from './CollegeCard';
import {
  mockCollegeData,
  CollegeData,
  Category,
  ExamSelection,
  StateQuota,
  PersonalizationPreferences,
  ProbabilityTag,
  CIRCUITAL_BRANCHES,
} from '@/data/mockCollegeData';
import { isUserLoggedIn } from '@/components/Header';

interface RankInputs {
  jeeMainCRL: string;
  jeeMainCategory: string;
  jeeAdvancedCRL: string;
  jeeAdvancedCategory: string;
}

interface PersonalizedResultsProps {
  examSelection: ExamSelection;
  rankInputs: RankInputs;
  category: Category;
  stateQuota: StateQuota;
  preferences: PersonalizationPreferences;
  onBack: () => void;
}

interface ScoredCollege extends CollegeData {
  score: number;
  probability: ProbabilityTag;
}

const PersonalizedResults = ({
  examSelection,
  rankInputs,
  category,
  stateQuota,
  preferences,
  onBack,
}: PersonalizedResultsProps) => {
  const navigate = useNavigate();

  // CHANGED: Added auth protection - redirect to sign in if not logged in
  useEffect(() => {
    if (!isUserLoggedIn()) {
      localStorage.setItem('ranksetgo_redirect', '/');
      localStorage.setItem('ranksetgo_action', 'personalize');
      navigate('/auth');
    }
  }, [navigate]);

  const personalizedColleges = useMemo(() => {
    const showJeeMain = examSelection === 'JEE Main' || examSelection === 'Both';
    const showJeeAdvanced = examSelection === 'JEE Advanced' || examSelection === 'Both';

    const jeeMainCRL = parseInt(rankInputs.jeeMainCRL, 10);
    const jeeAdvCRL = parseInt(rankInputs.jeeAdvancedCRL, 10);

    // First, filter eligible colleges
    let eligible = mockCollegeData.filter((college) => {
      // Filter by exam type
      if (college.examType === 'JEE Main' && !showJeeMain) return false;
      if (college.examType === 'JEE Advanced' && !showJeeAdvanced) return false;

      const userCRL = college.examType === 'JEE Main' ? jeeMainCRL : jeeAdvCRL;
      if (isNaN(userCRL) || userCRL <= 0) return false;

      const closingCRL = college.closingRank.crl[category];
      if (!closingCRL) return false;

      // Expand eligibility to 150% of closing rank for "Low Chance" results
      if (userCRL > closingCRL * 1.5) return false;

      // Filter by state quota (only for JEE Main)
      if (college.examType === 'JEE Main' && stateQuota !== 'All') {
        if (college.quota !== 'All India' && college.quota !== stateQuota) return false;
      }

      // Filter by fee level (skip if 'Any')
      if (preferences.feeLevel !== 'Any') {
        if (preferences.feeLevel === 'Low' && college.feeRange !== 'Low') return false;
        if (preferences.feeLevel === 'Moderate' && college.feeRange === 'High') return false;
      }

      // Filter by institute type
      if (preferences.instituteTypes.length > 0) {
        if (!preferences.instituteTypes.includes(college.instituteType)) return false;
      }

      // Filter by branch preference
      if (preferences.branchPreference === 'Circuital') {
        if (college.branchCategory !== 'Circuital') return false;
      } else if (preferences.branchPreference === 'Non-Circuital') {
        if (college.branchCategory !== 'Non-Circuital') return false;
      } else if (preferences.branchPreference === 'Specific' && preferences.specificBranch) {
        if (!college.branch.toLowerCase().includes(preferences.specificBranch.toLowerCase().split(' ')[0])) {
          return false;
        }
      }

      return true;
    });

    // Score and rank colleges
    const scored: ScoredCollege[] = eligible.map((college) => {
      let score = 100;
      const userCRL = college.examType === 'JEE Main' ? jeeMainCRL : jeeAdvCRL;
      const closingCRL = college.closingRank.crl[category];
      const openingCRL = college.openingRank.crl[category];

      // Probability calculation
      let probability: ProbabilityTag = 'Low';
      const rankRatio = userCRL / closingCRL;

      if (rankRatio <= 0.7) {
        probability = 'High';
        score += 30;
      } else if (rankRatio <= 1.0) {
        probability = 'Medium';
        score += 15;
      } else {
        probability = 'Low';
        score -= 20;
      }

      // Region preference bonus
      if (preferences.region !== 'No preference' && college.region === preferences.region) {
        score += 15;
      }

      // Location calculation (used for multiple bonuses)
      const metroCities = ['Mumbai', 'New Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata'];
      const isMetro = metroCities.some((city) => college.city.includes(city));

      // Focus bonus - now handles array of focus values
      const focusValues = preferences.focus;
      if (focusValues.includes('Placements')) {
        score += college.averagePackage * 2;
      }
      if (focusValues.includes('Research')) {
        if (college.instituteType === 'IIT') score += 20;
        else if (college.instituteType === 'NIT') score += 10;
      }
      if (focusValues.includes('Exposure')) {
        if (isMetro) score += 15;
        if (college.instituteType === 'IIT' || college.instituteType === 'NIT') score += 10;
      }
      if (focusValues.includes('Branch')) {
        score += 10;
      }
      if (focusValues.includes('Balanced')) {
        score += college.averagePackage + 5;
        if (isMetro) score += 5;
      }

      // Location priority bonus
      if (preferences.locationPriority === 'Metro' && isMetro) {
        score += 10;
      } else if (preferences.locationPriority === 'Tier-2' && !isMetro) {
        score += 10;
      }

      // Institute type preference (already filtered, but add small bonus)
      if (preferences.instituteTypes.includes(college.instituteType)) {
        score += 5;
      }

      // Competitiveness bonus (lower closing rank = more competitive = higher score)
      score += Math.max(0, 50 - (closingCRL / 1000));

      return {
        ...college,
        score,
        probability,
      };
    });

    // Sort by score (descending)
    scored.sort((a, b) => b.score - a.score);

    return scored;
  }, [examSelection, rankInputs, category, stateQuota, preferences]);

  if (personalizedColleges.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
          <div className="container mx-auto px-4 py-4 flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">Personalized Results</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="bg-card rounded-2xl border border-border p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Matching Colleges Found
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              We couldn't find colleges matching your preferences. Try adjusting your criteria.
            </p>
            <Button onClick={onBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Go Back & Adjust
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const highChanceCount = personalizedColleges.filter((c) => c.probability === 'High').length;
  const mediumChanceCount = personalizedColleges.filter((c) => c.probability === 'Medium').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">Personalized Results</span>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Summary Card */}
        <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl border border-border p-6 mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">
                Your Personalized College List
              </h2>
              <p className="text-muted-foreground">
                Sorted based on your rank, preferences, and match score
              </p>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[hsl(var(--success))]">{highChanceCount}</div>
                <div className="text-xs text-muted-foreground">High Chance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[hsl(var(--warning))]">{mediumChanceCount}</div>
                <div className="text-xs text-muted-foreground">Medium Chance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{personalizedColleges.length}</div>
                <div className="text-xs text-muted-foreground">Total Options</div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card rounded-xl border border-border p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Filter className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">
                {personalizedColleges.length} Recommended College{personalizedColleges.length !== 1 ? 's' : ''}
              </h3>
              <p className="text-sm text-muted-foreground">
                {preferences.region !== 'No preference' && `${preferences.region} region • `}
                {preferences.branchPreference !== 'Any' && `${preferences.branchPreference} branches • `}
                {preferences.feeLevel} budget
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowUpDown className="h-4 w-4" />
            <span>Sorted by match score</span>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 gap-5">
          {personalizedColleges.map((college, index) => (
            <CollegeCard
              key={college.id}
              college={college}
              category={category}
              index={index}
              showProbability
              probability={college.probability}
            />
          ))}
        </div>

        {/* Footer Note */}
        <div className="text-center py-8 text-sm text-muted-foreground">
          <p>
            * Probability is calculated based on your rank vs previous year cutoffs.
          </p>
          <p className="mt-1">
            Results are personalized based on your preferences and may differ from raw cutoff data.
          </p>
        </div>
      </main>
    </div>
  );
};

export default PersonalizedResults;
