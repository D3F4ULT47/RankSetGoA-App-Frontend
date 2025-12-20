import { Search, Sparkles } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Category, ExamSelection, Gender, StateQuota } from '@/data/mockCollegeData';

interface RankInputs {
  jeeMainCRL: string;
  jeeMainCategory: string;
  jeeAdvancedCRL: string;
  jeeAdvancedCategory: string;
}

interface InputPanelProps {
  examSelection: ExamSelection | '';
  setExamSelection: (value: ExamSelection | '') => void;
  rankInputs: RankInputs;
  setRankInputs: (value: RankInputs) => void;
  category: Category | '';
  setCategory: (value: Category | '') => void;
  gender: Gender;
  setGender: (value: Gender) => void;
  stateQuota: StateQuota;
  setStateQuota: (value: StateQuota) => void;
  onPersonalize?: () => void;
}

const InputPanel = ({
  examSelection,
  setExamSelection,
  rankInputs,
  setRankInputs,
  category,
  setCategory,
  gender,
  setGender,
  stateQuota,
  setStateQuota,
  onPersonalize,
}: InputPanelProps) => {
  const showCategoryRank = category !== '' && category !== 'GEN';
  const showJeeMain = examSelection === 'JEE Main' || examSelection === 'Both';
  const showJeeAdvanced = examSelection === 'JEE Advanced' || examSelection === 'Both';

  const handleRankChange = (field: keyof RankInputs, value: string) => {
    setRankInputs({ ...rankInputs, [field]: value });
  };

  const isFormValid = () => {
    if (!examSelection || !category) return false;
    
    if (showJeeMain && !rankInputs.jeeMainCRL) return false;
    if (showJeeAdvanced && !rankInputs.jeeAdvancedCRL) return false;
    
    if (showCategoryRank) {
      if (showJeeMain && !rankInputs.jeeMainCategory) return false;
      if (showJeeAdvanced && !rankInputs.jeeAdvancedCategory) return false;
    }
    
    return true;
  };

  return (
    <div className="w-full bg-card rounded-2xl shadow-card border border-border p-6 lg:p-8 animate-scale-in">
      {/* Header with Personalize Button */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
            <Search className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Rank & Category Details</h2>
            <p className="text-sm text-muted-foreground">
              Enter your details to discover eligible colleges
            </p>
          </div>
        </div>
        
        {onPersonalize && (
          <Button
            onClick={onPersonalize}
            className="gradient-primary text-primary-foreground hover:opacity-95 transition-opacity gap-2 h-10 px-4 text-sm shrink-0"
          >
            <Sparkles className="h-4 w-4" />
            Personalize Results ✨
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Exam Selection */}
        <div className="space-y-2">
          <Label htmlFor="examSelection" className="text-sm font-medium text-foreground">
            Exam Type <span className="text-destructive">*</span>
          </Label>
          <Select value={examSelection} onValueChange={(value) => setExamSelection(value as ExamSelection)}>
            <SelectTrigger id="examSelection" className="w-full h-12 bg-background border-border">
              <SelectValue placeholder="Select exam type" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="JEE Main">JEE Main</SelectItem>
              <SelectItem value="JEE Advanced">JEE Advanced</SelectItem>
              <SelectItem value="Both">Both (JEE Main + Advanced)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-medium text-foreground">
            Category <span className="text-destructive">*</span>
          </Label>
          <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
            <SelectTrigger id="category" className="w-full h-12 bg-background border-border">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="GEN">General (GEN)</SelectItem>
              <SelectItem value="EWS">EWS</SelectItem>
              <SelectItem value="OBC-NCL">OBC-NCL</SelectItem>
              <SelectItem value="SC">SC</SelectItem>
              <SelectItem value="ST">ST</SelectItem>
              <SelectItem value="PwD">PwD (Persons with Disability)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label htmlFor="gender" className="text-sm font-medium text-foreground">
            Gender <span className="text-muted-foreground text-xs">(Optional)</span>
          </Label>
          <Select value={gender} onValueChange={(value) => setGender(value as Gender)}>
            <SelectTrigger id="gender" className="w-full h-12 bg-background border-border">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Gender-neutral">Gender-neutral</SelectItem>
              <SelectItem value="Female-only">Female-only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* State Quota - Only for JEE Main */}
        {showJeeMain && (
          <div className="space-y-2">
            <Label htmlFor="stateQuota" className="text-sm font-medium text-foreground">
              State Quota <span className="text-muted-foreground text-xs">(Optional)</span>
            </Label>
            <Select value={stateQuota} onValueChange={(value) => setStateQuota(value as StateQuota)}>
              <SelectTrigger id="stateQuota" className="w-full h-12 bg-background border-border">
                <SelectValue placeholder="Select quota" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Home State">Home State</SelectItem>
                <SelectItem value="Other State">Other State</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Rank Inputs Section */}
      {examSelection && (
        <div className="mt-6 pt-6 border-t border-border">
          <h3 className="text-sm font-semibold text-foreground mb-4">Enter Your Ranks</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {/* JEE Main Ranks */}
            {showJeeMain && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="jeeMainCRL" className="text-sm font-medium text-foreground">
                    JEE Main CRL Rank <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="jeeMainCRL"
                    type="number"
                    placeholder="Enter CRL rank"
                    value={rankInputs.jeeMainCRL}
                    onChange={(e) => handleRankChange('jeeMainCRL', e.target.value)}
                    className="h-12 bg-background border-border"
                    min={1}
                  />
                </div>
                {showCategoryRank && (
                  <div className="space-y-2">
                    <Label htmlFor="jeeMainCategory" className="text-sm font-medium text-foreground">
                      JEE Main {category} Rank <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="jeeMainCategory"
                      type="number"
                      placeholder={`Enter ${category} rank`}
                      value={rankInputs.jeeMainCategory}
                      onChange={(e) => handleRankChange('jeeMainCategory', e.target.value)}
                      className="h-12 bg-background border-border"
                      min={1}
                    />
                  </div>
                )}
              </>
            )}

            {/* JEE Advanced Ranks */}
            {showJeeAdvanced && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="jeeAdvancedCRL" className="text-sm font-medium text-foreground">
                    JEE Advanced CRL Rank <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="jeeAdvancedCRL"
                    type="number"
                    placeholder="Enter CRL rank"
                    value={rankInputs.jeeAdvancedCRL}
                    onChange={(e) => handleRankChange('jeeAdvancedCRL', e.target.value)}
                    className="h-12 bg-background border-border"
                    min={1}
                  />
                </div>
                {showCategoryRank && (
                  <div className="space-y-2">
                    <Label htmlFor="jeeAdvancedCategory" className="text-sm font-medium text-foreground">
                      JEE Advanced {category} Rank <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="jeeAdvancedCategory"
                      type="number"
                      placeholder={`Enter ${category} rank`}
                      value={rankInputs.jeeAdvancedCategory}
                      onChange={(e) => handleRankChange('jeeAdvancedCategory', e.target.value)}
                      className="h-12 bg-background border-border"
                      min={1}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Status indicator */}
      <div className="mt-6 flex items-center gap-2 text-sm">
        {isFormValid() ? (
          <div className="flex items-center gap-2 text-accent">
            <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="font-medium">Showing results based on your ranks</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-muted-foreground/50" />
            <span>Fill all required fields to see results</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputPanel;