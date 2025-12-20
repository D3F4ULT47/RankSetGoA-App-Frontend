import { Pin, Lock, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Doubt } from '@/types/community';
import DoubtTag from './DoubtTag';
import ModBadge from './ModBadge';

interface DoubtCardProps {
  doubt: Doubt;
  onClick: () => void;
  isActive?: boolean;
}

const DoubtCard = ({ doubt, onClick, isActive }: DoubtCardProps) => {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left p-4 rounded-lg border transition-all',
        isActive
          ? 'bg-primary/5 border-primary/30 shadow-sm'
          : 'bg-card border-border hover:bg-secondary/50 hover:border-border/80'
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-2 mb-2">
        {doubt.isPinned && (
          <Pin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
        )}
        {doubt.isLocked && (
          <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
        )}
        <h3 className="font-semibold text-foreground text-sm line-clamp-2 flex-1">
          {doubt.title}
        </h3>
      </div>

      {/* Description Preview */}
      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
        {doubt.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {doubt.tags.map((tag) => (
          <DoubtTag key={tag} tag={tag} className="text-[10px] px-1.5" />
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-foreground">{doubt.authorUsername}</span>
          {doubt.authorRole === 'moderator' && <ModBadge className="text-[8px] px-1" />}
          <span>• {formatDate(doubt.timestamp)}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageSquare className="h-3.5 w-3.5" />
          <span>{doubt.replies.length}</span>
        </div>
      </div>
    </button>
  );
};

export default DoubtCard;
