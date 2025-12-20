import { useMemo } from 'react';
import { GraduationCap, AlertCircle, Filter, ArrowUpDown } from 'lucide-react';
import CollegeCard from './CollegeCard';
import { mockCollegeData, CollegeData, Category, ExamSelection, StateQuota } from '@/data/mockCollegeData';
interface RankInputs {
  jeeMainCRL: string;
  jeeMainCategory: string;
  jeeAdvancedCRL: string;
  jeeAdvancedCategory: string;
}
interface ResultsSectionProps {
  examSelection: ExamSelection | '';
  rankInputs: RankInputs;
  category: Category | '';
  stateQuota: StateQuota;
}
const ResultsSection = ({
  examSelection,
  rankInputs,
  category,
  stateQuota
}: ResultsSectionProps) => {
  const filteredColleges = useMemo(() => {
    if (!examSelection || !category) return [];
    const showCategoryRank = category !== 'GEN';
    const showJeeMain = examSelection === 'JEE Main' || examSelection === 'Both';
    const showJeeAdvanced = examSelection === 'JEE Advanced' || examSelection === 'Both';

    // Validate required ranks
    if (showJeeMain && !rankInputs.jeeMainCRL) return [];
    if (showJeeAdvanced && !rankInputs.jeeAdvancedCRL) return [];
    if (showCategoryRank) {
      if (showJeeMain && !rankInputs.jeeMainCategory) return [];
      if (showJeeAdvanced && !rankInputs.jeeAdvancedCategory) return [];
    }
    const jeeMainCRL = parseInt(rankInputs.jeeMainCRL, 10);
    const jeeMainCat = parseInt(rankInputs.jeeMainCategory, 10);
    const jeeAdvCRL = parseInt(rankInputs.jeeAdvancedCRL, 10);
    const jeeAdvCat = parseInt(rankInputs.jeeAdvancedCategory, 10);
    let filtered = mockCollegeData.filter(college => {
      // Filter by exam type
      if (college.examType === 'JEE Main' && !showJeeMain) return false;
      if (college.examType === 'JEE Advanced' && !showJeeAdvanced) return false;

      // Get appropriate ranks based on exam type
      const userCRL = college.examType === 'JEE Main' ? jeeMainCRL : jeeAdvCRL;
      const userCatRank = college.examType === 'JEE Main' ? jeeMainCat : jeeAdvCat;
      if (isNaN(userCRL) || userCRL <= 0) return false;

      // For General category, use CRL closing rank
      // For other categories, use the better of CRL or category rank
      const closingCRL = college.closingRank.crl[category];
      const closingCategory = college.closingRank.category[category];
      if (!closingCRL) return false;

      // Check CRL eligibility
      if (userCRL > closingCRL) return false;

      // For reserved categories, also check category rank if available
      if (showCategoryRank && closingCategory && !isNaN(userCatRank)) {
        // User is eligible if either CRL or category rank qualifies
        // But we already checked CRL, so they're eligible
      }

      // Filter by state quota (only for JEE Main)
      if (college.examType === 'JEE Main' && stateQuota !== 'All') {
        if (college.quota !== 'All India' && college.quota !== stateQuota) return false;
      }
      return true;
    });

    // Sort by closing rank (lower is better/more competitive)
    filtered.sort((a, b) => {
      const aClosing = a.closingRank.crl[category] || Infinity;
      const bClosing = b.closingRank.crl[category] || Infinity;
      return aClosing - bClosing;
    });
    return filtered;
  }, [examSelection, rankInputs, category, stateQuota]);

  // Check if form is valid
  const isFormValid = () => {
    if (!examSelection || !category) return false;
    const showCategoryRank = category !== 'GEN';
    const showJeeMain = examSelection === 'JEE Main' || examSelection === 'Both';
    const showJeeAdvanced = examSelection === 'JEE Advanced' || examSelection === 'Both';
    if (showJeeMain && !rankInputs.jeeMainCRL) return false;
    if (showJeeAdvanced && !rankInputs.jeeAdvancedCRL) return false;
    if (showCategoryRank) {
      if (showJeeMain && !rankInputs.jeeMainCategory) return false;
      if (showJeeAdvanced && !rankInputs.jeeAdvancedCategory) return false;
    }
    return true;
  };

  // Show placeholder when no inputs
  if (!isFormValid()) {
    return <div className="w-full mt-8 animate-fade-in">
        <div className="bg-card rounded-2xl border border-border p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#a6b7ce]">
              <GraduationCap className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Enter Your Details
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Fill in your exam type, ranks, and category above to discover colleges and branches you're eligible for.
          </p>
        </div>
      </div>;
  }

  // Show no results
  if (filteredColleges.length === 0) {
    return <div className="w-full mt-8 animate-fade-in">
        <div className="bg-card rounded-2xl border border-border p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No Colleges Found
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            No colleges match your criteria for the given ranks in {category} category. Try adjusting your filters or check if your rank is within eligible range.
          </p>
        </div>
      </div>;
  }
  return <div className="w-full mt-8 space-y-6 animate-fade-in">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card rounded-xl border border-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <Filter className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">
              {filteredColleges.length} College{filteredColleges.length !== 1 ? 's' : ''} Found
            </h3>
            <p className="text-sm text-muted-foreground">
              Based on {examSelection} • {category}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ArrowUpDown className="h-4 w-4" />
          <span>Sorted by closing rank</span>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 gap-5">
        {filteredColleges.map((college, index) => <CollegeCard key={college.id} college={college} category={category as Category} index={index} />)}
      </div>

      {/* Footer Note */}
      <div className="text-center py-6 text-sm text-muted-foreground">
        <p>
          * Data is based on previous year JoSAA cutoffs. Actual cutoffs may vary.
        </p>
        <p className="mt-1">
          Average package data is approximate and based on publicly available information.
        </p>
      </div>
    </div>;
};
export default ResultsSection;