export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  bio?: string;
  creator: boolean;
  premium: boolean;
  isVerified: boolean;
  verificationToken?: string;
  password: string;
  profileImage?: string;
  Audio: Audio[];
  liveTalks: LiveTalk[];
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
  userId: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
  participants: LiveTalkParticipant[];
}

export interface LiveTalkParticipant {
  id: string;
  liveTalkId: string;
  userId: string;
  isHost: boolean;
  peerId?: string;
  user: User;
  roomId?: string;
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
  keywords: string[];
  parts: any[];
  userId: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}
