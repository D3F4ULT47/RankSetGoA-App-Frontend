// Community Types

export type UserRole = 'member' | 'moderator' | 'admin';
export type UserType = 'aspirant';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  userType: UserType;
  collegeInterests?: string[];
}

export type ChannelType = 'chat' | 'doubt';

export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  icon: 'hash' | 'message-circle';
}

export interface ChatMessage {
  id: string;
  channelId: string;
  userId: string;
  username: string;
  userRole: UserRole;
  content: string;
  timestamp: Date;
}

export type DoubtTag = 
  | 'opening/closing'
  | 'fee'
  | 'general josaa'
  | 'IITs'
  | 'NITs'
  | 'IIITs/GFTIs'
  | 'Private Colleges';

export const DOUBT_TAGS: DoubtTag[] = [
  'opening/closing',
  'fee',
  'general josaa',
  'IITs',
  'NITs',
  'IIITs/GFTIs',
  'Private Colleges',
];

export const TAG_COLORS: Record<DoubtTag, string> = {
  'opening/closing': 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30',
  'fee': 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  'general josaa': 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30',
  'IITs': 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30',
  'NITs': 'bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30',
  'IIITs/GFTIs': 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30',
  'Private Colleges': 'bg-pink-500/20 text-pink-700 dark:text-pink-300 border-pink-500/30',
};

export interface Doubt {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  tags: DoubtTag[];
  authorId: string;
  authorUsername: string;
  authorRole: UserRole;
  timestamp: Date;
  isPinned?: boolean;
  isLocked?: boolean;
  replies: DoubtReply[];
}

export interface DoubtReply {
  id: string;
  doubtId: string;
  userId: string;
  username: string;
  userRole: UserRole;
  content: string;
  imageUrl?: string;
  timestamp: Date;
  isHighlighted?: boolean;
}

export const CHANNELS: Channel[] = [
  { id: 'general', name: 'General', type: 'chat', icon: 'hash' },
  { id: 'iits', name: 'IITs', type: 'chat', icon: 'hash' },
  { id: 'nits', name: 'NITs', type: 'chat', icon: 'hash' },
  { id: 'iiits-gftis', name: 'IIITs/GFTIs', type: 'chat', icon: 'hash' },
  { id: 'private', name: 'Private Colleges', type: 'chat', icon: 'hash' },
  { id: 'doubt', name: 'Doubt', type: 'doubt', icon: 'message-circle' },
];

// Mock current user
export const CURRENT_USER: User = {
  id: 'user-1',
  username: 'JEE_Aspirant_2025',
  role: 'member',
  userType: 'aspirant',
  collegeInterests: ['IIT Bombay', 'NIT Trichy'],
};
