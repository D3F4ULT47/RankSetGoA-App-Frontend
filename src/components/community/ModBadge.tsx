import { cn } from '@/lib/utils';

interface ModBadgeProps {
  className?: string;
}

const ModBadge = ({ className }: ModBadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide',
        'bg-primary/20 text-primary border border-primary/30',
        className
      )}
    >
      MOD
    </span>
  );
};

export default ModBadge;
