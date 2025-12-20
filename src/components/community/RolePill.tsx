import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RolePillProps {
  label: string;
  onRemove?: () => void;
  variant?: 'counselling' | 'college';
  className?: string;
}

const RolePill = ({ label, onRemove, variant = 'counselling', className }: RolePillProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors',
        variant === 'counselling'
          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        className
      )}
    >
      {label}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 hover:bg-foreground/10 rounded-full p-0.5 transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
};

export default RolePill;
