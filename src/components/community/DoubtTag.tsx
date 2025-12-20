import { cn } from '@/lib/utils';
import { DoubtTag as DoubtTagType, TAG_COLORS } from '@/types/community';

interface DoubtTagProps {
  tag: DoubtTagType;
  onClick?: () => void;
  isActive?: boolean;
  className?: string;
}

const DoubtTag = ({ tag, onClick, isActive, className }: DoubtTagProps) => {
  const colorClasses = TAG_COLORS[tag];

  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border transition-all',
        colorClasses,
        onClick && 'cursor-pointer hover:opacity-80',
        isActive && 'ring-2 ring-offset-1 ring-primary',
        !onClick && 'cursor-default',
        className
      )}
    >
      {tag}
    </button>
  );
};

export default DoubtTag;
