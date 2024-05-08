export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  bio?: string | null;
  creator: boolean;
  premium: boolean;
  isVerified: boolean;
  planType?: String;
  expiryDate?: Date;
  verificationToken?: string | null;
  password: string;
  profileImage?: string | null;
  Audio: Audio[];
  liveTalks: LiveTalk[];
  liveTalkParticipants: LiveTalkParticipant[];
  Preferences: Preferences[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Preferences {
  id: string;
  languages: string[];
  genres: string[];
  userId: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface Audio {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  category: string;
  genres: string[];
  parts: any[];
  streams: number;
  userId: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface LiveTalk {
  id: string;
  status: boolean;
  title: string;
  roomId: string;
  genres: string[];
  record: boolean;
  views: number;
  userId: string;
  user: User;
  participants: LiveTalkParticipant[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LiveTalkParticipant {
  id: string;
  liveTalkId: string;
  userId: string;
  isHost: boolean;
  peerId?: string | null;
  roomId?: string | null;
  liveTalk: LiveTalk;
  participant: User;
  createdAt: Date;
  updatedAt: Date;
}
