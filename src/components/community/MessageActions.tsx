import { useState } from 'react';
import { MoreHorizontal, Reply, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MessageActionsProps {
  isOwn: boolean;
  onReply: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const MessageActions = ({ isOwn, onReply, onEdit, onDelete }: MessageActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={onReply} className="gap-2">
          <Reply className="h-4 w-4" />
          Reply
        </DropdownMenuItem>
        {isOwn && onEdit && (
          <DropdownMenuItem onClick={onEdit} className="gap-2">
            <Pencil className="h-4 w-4" />
            Edit
          </DropdownMenuItem>
        )}
        {isOwn && onDelete && (
          <DropdownMenuItem onClick={onDelete} className="gap-2 text-destructive">
            <Trash2 className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MessageActions;
