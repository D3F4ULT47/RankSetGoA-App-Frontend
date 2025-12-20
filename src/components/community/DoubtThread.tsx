import { useState } from 'react';
import { ArrowLeft, Pin, Lock, Trash2, Star, Send, ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Doubt, DoubtReply, CURRENT_USER } from '@/types/community';
import DoubtTag from './DoubtTag';
import ModBadge from './ModBadge';

interface DoubtThreadProps {
  doubt: Doubt;
  onBack: () => void;
  onReplyAdd: (reply: DoubtReply) => void;
  onTogglePin?: () => void;
  onToggleLock?: () => void;
  onDelete?: () => void;
  onHighlightReply?: (replyId: string) => void;
}

const DoubtThread = ({
  doubt,
  onBack,
  onReplyAdd,
  onTogglePin,
  onToggleLock,
  onDelete,
  onHighlightReply,
}: DoubtThreadProps) => {
  const [replyContent, setReplyContent] = useState('');
  const isModerator = CURRENT_USER.role === 'moderator' || CURRENT_USER.role === 'admin';

  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleSubmitReply = () => {
    if (!replyContent.trim() || doubt.isLocked) return;

    const newReply: DoubtReply = {
      id: `reply-${Date.now()}`,
      doubtId: doubt.id,
      userId: CURRENT_USER.id,
      username: CURRENT_USER.username,
      userRole: CURRENT_USER.role,
      content: replyContent.trim(),
      timestamp: new Date(),
    };

    onReplyAdd(newReply);
    setReplyContent('');
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="font-semibold text-foreground text-sm line-clamp-1">{doubt.title}</h2>
            <p className="text-xs text-muted-foreground">
              {doubt.replies.length} {doubt.replies.length === 1 ? 'reply' : 'replies'}
            </p>
          </div>
        </div>

        {/* Mod Controls */}
        {isModerator && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onTogglePin}
              className={cn(doubt.isPinned && 'text-primary')}
              title={doubt.isPinned ? 'Unpin' : 'Pin'}
            >
              <Pin className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleLock}
              className={cn(doubt.isLocked && 'text-warning')}
              title={doubt.isLocked ? 'Unlock' : 'Lock'}
            >
              <Lock className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="text-destructive hover:text-destructive"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Thread Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Original Doubt */}
        <div className="p-4 border-b border-border bg-card/50">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-3">
            {doubt.isPinned && (
              <span className="inline-flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                <Pin className="h-3 w-3" /> Pinned
              </span>
            )}
            {doubt.isLocked && (
              <span className="inline-flex items-center gap-1 text-xs text-warning bg-warning/10 px-2 py-0.5 rounded-full">
                <Lock className="h-3 w-3" /> Locked
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-lg font-bold text-foreground mb-2">{doubt.title}</h1>

          {/* Author Info */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-medium text-primary">
                {doubt.authorUsername.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-foreground">{doubt.authorUsername}</span>
                {doubt.authorRole === 'moderator' && <ModBadge />}
              </div>
              <span className="text-xs text-muted-foreground">{formatDate(doubt.timestamp)}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-foreground/90 whitespace-pre-wrap mb-4">{doubt.description}</p>

          {/* Image */}
          {doubt.imageUrl && (
            <div className="mb-4">
              <img
                src={doubt.imageUrl}
                alt="Doubt attachment"
                className="max-w-full max-h-64 rounded-lg border border-border object-contain"
              />
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {doubt.tags.map((tag) => (
              <DoubtTag key={tag} tag={tag} />
            ))}
          </div>
        </div>

        {/* Replies */}
        <div className="p-4 space-y-4">
          <h3 className="font-semibold text-foreground text-sm">
            Replies ({doubt.replies.length})
          </h3>

          {doubt.replies.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No replies yet. Be the first to help!
            </p>
          ) : (
            doubt.replies.map((reply) => (
              <ReplyItem
                key={reply.id}
                reply={reply}
                formatDate={formatDate}
                isModerator={isModerator}
                onHighlight={() => onHighlightReply?.(reply.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Reply Input */}
      {!doubt.isLocked ? (
        <div className="p-4 border-t border-border bg-card">
          <div className="space-y-2">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply..."
              rows={3}
            />
            <div className="flex justify-between items-center">
              <Button variant="outline" size="sm">
                <ImagePlus className="h-4 w-4 mr-2" />
                Add Image
              </Button>
              <Button
                onClick={handleSubmitReply}
                disabled={!replyContent.trim()}
                size="sm"
              >
                <Send className="h-4 w-4 mr-2" />
                Reply
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 border-t border-border bg-warning/5 text-center">
          <p className="text-sm text-warning flex items-center justify-center gap-2">
            <Lock className="h-4 w-4" />
            This thread is locked. No new replies allowed.
          </p>
        </div>
      )}
    </div>
  );
};

interface ReplyItemProps {
  reply: DoubtReply;
  formatDate: (date: Date) => string;
  isModerator: boolean;
  onHighlight: () => void;
}

const ReplyItem = ({ reply, formatDate, isModerator, onHighlight }: ReplyItemProps) => {
  const initials = reply.username.slice(0, 2).toUpperCase();

  return (
    <div
      className={cn(
        'p-3 rounded-lg border transition-colors',
        reply.isHighlighted
          ? 'bg-success/5 border-success/30'
          : 'bg-card border-border'
      )}
    >
      {reply.isHighlighted && (
        <div className="flex items-center gap-1 text-xs text-success mb-2">
          <Star className="h-3 w-3 fill-success" />
          Highlighted Reply
        </div>
      )}

      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-medium text-primary">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-foreground text-sm">{reply.username}</span>
              {reply.userRole === 'moderator' && <ModBadge />}
            </div>
            {isModerator && !reply.isHighlighted && (
              <Button variant="ghost" size="sm" onClick={onHighlight} className="h-7 text-xs">
                <Star className="h-3 w-3 mr-1" />
                Highlight
              </Button>
            )}
          </div>
          <span className="text-xs text-muted-foreground">{formatDate(reply.timestamp)}</span>
          <p className="text-sm text-foreground/90 mt-2 whitespace-pre-wrap">{reply.content}</p>
          {reply.imageUrl && (
            <img
              src={reply.imageUrl}
              alt="Reply attachment"
              className="max-w-full max-h-48 rounded-lg border border-border mt-2 object-contain"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DoubtThread;
