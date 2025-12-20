import { useState, useRef, useEffect } from 'react';
import { Hash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatMessage, CURRENT_USER, CHANNELS } from '@/types/community';
import { generateMockMessages } from '@/data/mockCommunityData';
import ModBadge from './ModBadge';
import MessageInput from './MessageInput';
import MessageActions from './MessageActions';
import UserProfilePopup from './UserProfilePopup';
import { toast } from 'sonner';

interface ChatChannelProps {
  channelId: string;
}

const ChatChannel = ({ channelId }: ChatChannelProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channel = CHANNELS.find(c => c.id === channelId);

  useEffect(() => {
    setMessages(generateMockMessages(channelId));
  }, [channelId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (content: string, imageUrl?: string) => {
    if (!content.trim() && !imageUrl) return;

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      channelId,
      userId: CURRENT_USER.id,
      username: CURRENT_USER.username,
      userRole: CURRENT_USER.role,
      content: replyingTo ? `@${replyingTo.username} ${content}` : content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, message]);
    setReplyingTo(null);
  };

  const handleEditMessage = (messageId: string) => {
    const msg = messages.find(m => m.id === messageId);
    if (msg) {
      setEditingMessageId(messageId);
      setEditContent(msg.content);
    }
  };

  const handleSaveEdit = (messageId: string) => {
    setMessages(prev =>
      prev.map(m => (m.id === messageId ? { ...m, content: editContent } : m))
    );
    setEditingMessageId(null);
    setEditContent('');
    toast.success('Message edited');
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(m => m.id !== messageId));
    toast.success('Message deleted');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Channel Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-card">
        <Hash className="h-5 w-5 text-muted-foreground" />
        <h2 className="font-semibold text-foreground">{channel?.name || 'Channel'}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Hash className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Welcome to #{channel?.name}</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              This is the start of the #{channel?.name} channel. Be the first to send a message!
            </p>
          </div>
        ) : (
          messages.map((message, index) => {
            const showDateSeparator = index === 0 || 
              formatDate(messages[index - 1].timestamp) !== formatDate(message.timestamp);
            const isOwn = message.userId === CURRENT_USER.id;
            const isEditing = editingMessageId === message.id;

            return (
              <div key={message.id}>
                {showDateSeparator && (
                  <div className="flex items-center gap-4 my-4">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs font-medium text-muted-foreground">
                      {formatDate(message.timestamp)}
                    </span>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                )}
                <div className="flex gap-3 hover:bg-secondary/30 rounded-lg px-2 py-1 -mx-2 transition-colors group">
                  <UserProfilePopup username={message.username} userRole={message.userRole}>
                    <button className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 hover:ring-2 hover:ring-primary/30 transition-all">
                      <span className="text-sm font-medium text-primary">
                        {message.username.slice(0, 2).toUpperCase()}
                      </span>
                    </button>
                  </UserProfilePopup>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <UserProfilePopup username={message.username} userRole={message.userRole}>
                        <button className="font-semibold text-foreground text-sm hover:underline">
                          {message.username}
                        </button>
                      </UserProfilePopup>
                      {message.userRole === 'moderator' && <ModBadge />}
                      <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                      <MessageActions
                        isOwn={isOwn}
                        onReply={() => setReplyingTo(message)}
                        onEdit={isOwn ? () => handleEditMessage(message.id) : undefined}
                        onDelete={isOwn ? () => handleDeleteMessage(message.id) : undefined}
                      />
                    </div>
                    {isEditing ? (
                      <div className="flex gap-2 mt-1">
                        <input
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="flex-1 text-sm bg-secondary px-2 py-1 rounded border border-border"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit(message.id);
                            if (e.key === 'Escape') setEditingMessageId(null);
                          }}
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveEdit(message.id)}
                          className="text-xs text-primary hover:underline"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingMessageId(null)}
                          className="text-xs text-muted-foreground hover:underline"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-foreground/90 mt-0.5 break-words">{message.content}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply indicator */}
      {replyingTo && (
        <div className="px-4 py-2 bg-secondary/50 border-t border-border flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Replying to <span className="font-medium text-foreground">{replyingTo.username}</span>
          </span>
          <button
            onClick={() => setReplyingTo(null)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-card">
        <MessageInput
          placeholder={`Message #${channel?.name || 'channel'}...`}
          onSend={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default ChatChannel;
