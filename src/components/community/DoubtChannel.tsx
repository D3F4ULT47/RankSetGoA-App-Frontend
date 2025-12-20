import { useState, useMemo } from 'react';
import { Search, Plus, MessageCircle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Doubt, DoubtReply, DoubtTag as DoubtTagType, DOUBT_TAGS } from '@/types/community';
import { generateMockDoubts } from '@/data/mockCommunityData';
import DoubtCard from './DoubtCard';
import DoubtThread from './DoubtThread';
import DoubtTag from './DoubtTag';
import CreateDoubtModal from './CreateDoubtModal';

const DoubtChannel = () => {
  const [doubts, setDoubts] = useState<Doubt[]>(generateMockDoubts());
  const [selectedDoubt, setSelectedDoubt] = useState<Doubt | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<DoubtTagType[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filteredDoubts = useMemo(() => {
    let filtered = [...doubts];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.title.toLowerCase().includes(query) ||
          d.description.toLowerCase().includes(query) ||
          d.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((d) =>
        selectedTags.some((tag) => d.tags.includes(tag))
      );
    }

    // Sort: pinned first, then by date
    filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.timestamp.getTime() - a.timestamp.getTime();
    });

    return filtered;
  }, [doubts, searchQuery, selectedTags]);

  const handleTagToggle = (tag: DoubtTagType) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleCreateDoubt = (newDoubt: Doubt) => {
    setDoubts((prev) => [newDoubt, ...prev]);
  };

  const handleReplyAdd = (reply: DoubtReply) => {
    setDoubts((prev) =>
      prev.map((d) =>
        d.id === reply.doubtId ? { ...d, replies: [...d.replies, reply] } : d
      )
    );
    if (selectedDoubt && selectedDoubt.id === reply.doubtId) {
      setSelectedDoubt((prev) =>
        prev ? { ...prev, replies: [...prev.replies, reply] } : null
      );
    }
  };

  const handleTogglePin = () => {
    if (!selectedDoubt) return;
    const updated = { ...selectedDoubt, isPinned: !selectedDoubt.isPinned };
    setDoubts((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    setSelectedDoubt(updated);
  };

  const handleToggleLock = () => {
    if (!selectedDoubt) return;
    const updated = { ...selectedDoubt, isLocked: !selectedDoubt.isLocked };
    setDoubts((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    setSelectedDoubt(updated);
  };

  const handleDelete = () => {
    if (!selectedDoubt) return;
    setDoubts((prev) => prev.filter((d) => d.id !== selectedDoubt.id));
    setSelectedDoubt(null);
  };

  const handleHighlightReply = (replyId: string) => {
    if (!selectedDoubt) return;
    const updatedReplies = selectedDoubt.replies.map((r) =>
      r.id === replyId ? { ...r, isHighlighted: true } : r
    );
    const updated = { ...selectedDoubt, replies: updatedReplies };
    setDoubts((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    setSelectedDoubt(updated);
  };

  // Thread View
  if (selectedDoubt) {
    return (
      <DoubtThread
        doubt={selectedDoubt}
        onBack={() => setSelectedDoubt(null)}
        onReplyAdd={handleReplyAdd}
        onTogglePin={handleTogglePin}
        onToggleLock={handleToggleLock}
        onDelete={handleDelete}
        onHighlightReply={handleHighlightReply}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-muted-foreground" />
          <h2 className="font-semibold text-foreground">Doubt</h2>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} size="sm" className="gradient-primary">
          <Plus className="h-4 w-4 mr-1" />
          New Doubt
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="p-4 border-b border-border bg-card/50 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search doubts..."
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(showFilters && 'bg-primary/10 border-primary/30')}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Tag Filters */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 animate-fade-in">
            {DOUBT_TAGS.map((tag) => (
              <DoubtTag
                key={tag}
                tag={tag}
                onClick={() => handleTagToggle(tag)}
                isActive={selectedTags.includes(tag)}
              />
            ))}
            {selectedTags.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTags([])}
                className="text-xs h-6"
              >
                Clear all
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Doubt List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredDoubts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">No doubts found</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-4">
              {searchQuery || selectedTags.length > 0
                ? 'Try adjusting your search or filters'
                : 'Be the first to ask a question!'}
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)} className="gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Ask a Doubt
            </Button>
          </div>
        ) : (
          filteredDoubts.map((doubt) => (
            <DoubtCard
              key={doubt.id}
              doubt={doubt}
              onClick={() => setSelectedDoubt(doubt)}
              isActive={selectedDoubt?.id === doubt.id}
            />
          ))
        )}
      </div>

      {/* Create Modal */}
      <CreateDoubtModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateDoubt}
      />
    </div>
  );
};

export default DoubtChannel;
