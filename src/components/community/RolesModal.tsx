import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export type CounsellingInterest = 'JoSAA' | 'CSAB' | 'Other Counselling';
export type CollegeProbability = 'IITs' | 'NITs' | 'IIITs / GFTIs' | 'Private Universities';

export interface UserRoles {
  counsellingInterests: CounsellingInterest[];
  collegeProbabilities: CollegeProbability[];
}

interface RolesModalProps {
  isOpen: boolean;
  onClose: () => void;
  roles: UserRoles;
  onSave: (roles: UserRoles) => void;
}

const COUNSELLING_OPTIONS: { value: CounsellingInterest; label: string }[] = [
  { value: 'JoSAA', label: 'JoSAA' },
  { value: 'CSAB', label: 'CSAB' },
  { value: 'Other Counselling', label: 'Other Counselling' },
];

const COLLEGE_OPTIONS: { value: CollegeProbability; label: string }[] = [
  { value: 'IITs', label: 'IITs' },
  { value: 'NITs', label: 'NITs' },
  { value: 'IIITs / GFTIs', label: 'IIITs / GFTIs' },
  { value: 'Private Universities', label: 'Private Universities' },
];

const RolesModal = ({ isOpen, onClose, roles, onSave }: RolesModalProps) => {
  const [localRoles, setLocalRoles] = useState<UserRoles>(roles);

  const toggleCounselling = (value: CounsellingInterest) => {
    setLocalRoles((prev) => ({
      ...prev,
      counsellingInterests: prev.counsellingInterests.includes(value)
        ? prev.counsellingInterests.filter((v) => v !== value)
        : [...prev.counsellingInterests, value],
    }));
  };

  const toggleCollege = (value: CollegeProbability) => {
    setLocalRoles((prev) => ({
      ...prev,
      collegeProbabilities: prev.collegeProbabilities.includes(value)
        ? prev.collegeProbabilities.filter((v) => v !== value)
        : [...prev.collegeProbabilities, value],
    }));
  };

  const handleSave = () => {
    onSave(localRoles);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Customize Your Roles</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Question 1 */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">What are you interested in?</h4>
            <div className="flex flex-wrap gap-2">
              {COUNSELLING_OPTIONS.map((option) => {
                const isSelected = localRoles.counsellingInterests.includes(option.value);
                return (
                  <button
                    key={option.value}
                    onClick={() => toggleCounselling(option.value)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium transition-all',
                      isSelected
                        ? 'bg-primary/10 border-primary/30 text-primary'
                        : 'bg-secondary border-border text-muted-foreground hover:border-primary/30'
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question 2 */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Which college are you getting? (Probability)</h4>
            <div className="flex flex-wrap gap-2">
              {COLLEGE_OPTIONS.map((option) => {
                const isSelected = localRoles.collegeProbabilities.includes(option.value);
                return (
                  <button
                    key={option.value}
                    onClick={() => toggleCollege(option.value)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium transition-all',
                      isSelected
                        ? 'bg-primary/10 border-primary/30 text-primary'
                        : 'bg-secondary border-border text-muted-foreground hover:border-primary/30'
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="gradient-primary">
            Save Roles
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RolesModal;
