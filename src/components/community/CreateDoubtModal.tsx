import { useState } from 'react';
import { X, ImagePlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { DoubtTag as DoubtTagType, DOUBT_TAGS, CURRENT_USER, Doubt } from '@/types/community';
import DoubtTag from './DoubtTag';

interface CreateDoubtModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (doubt: Doubt) => void;
}

const CreateDoubtModal = ({ isOpen, onClose, onSubmit }: CreateDoubtModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<DoubtTagType[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTagToggle = (tag: DoubtTagType) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || selectedTags.length === 0) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const newDoubt: Doubt = {
      id: `doubt-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      imageUrl: imageUrl || undefined,
      tags: selectedTags,
      authorId: CURRENT_USER.id,
      authorUsername: CURRENT_USER.username,
      authorRole: CURRENT_USER.role,
      timestamp: new Date(),
      replies: [],
    };

    onSubmit(newDoubt);
    setIsSubmitting(false);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedTags([]);
    setImageUrl('');
  };

  const isValid = title.trim() && description.trim() && selectedTags.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">New Doubt</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Title */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Title <span className="text-destructive">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your question about?"
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground mt-1">{title.length}/100</p>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Description <span className="text-destructive">*</span>
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide more details about your doubt..."
              rows={4}
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground mt-1">{description.length}/1000</p>
          </div>

          {/* Image URL (optional) */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Image URL <span className="text-muted-foreground">(optional)</span>
            </label>
            <div className="flex gap-2">
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.png"
                className="flex-1"
              />
              <Button variant="outline" size="icon" className="flex-shrink-0">
                <ImagePlus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Tags <span className="text-destructive">*</span>
              <span className="text-muted-foreground font-normal ml-1">(select at least one)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {DOUBT_TAGS.map((tag) => (
                <DoubtTag
                  key={tag}
                  tag={tag}
                  onClick={() => handleTagToggle(tag)}
                  isActive={selectedTags.includes(tag)}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!isValid || isSubmitting}
              className="gradient-primary"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                'Post Doubt'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDoubtModal;
