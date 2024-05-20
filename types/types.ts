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
  password: string;
  profileImage?: string | null;
  Tokens: Tokens[];
  PlanData: PlanData[];
  Preferences: Preferences[];
  Audio: Audio[];
  liveTalks: LiveTalk[];
  liveTalkParticipants: LiveTalkParticipant[];
  following: Follower[];
  playlists: Playlist[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Tokens {
  id: string;
  userId: string;
  user: User;
  verificationToken: string;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlanData {
  id: string;
  userId: string;
  user: User;
  paymentStatus: boolean;
  method: string;
  amount: number;
  currency: string;
  category: string;
  type: string;
  expiryDate: Date;
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
  coverImage: string;
  category: string;
  genres: string[];
  parts: any[];
  streams: number;
  playlists: Playlist[];
  userId: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface TotalCounts {
  id: string;
  totalStreams: number;
  totalRevenue: number;
  monthlyIncome: string[];
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

export interface Follower {
  id: string;
  userId: string;
  followedId: string[];
  user: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface Playlist {
  id: string;
  name: string;
  userId: string;
  user: User;
  audios: Audio[];
  createdAt: Date;
  updatedAt: Date;
}
