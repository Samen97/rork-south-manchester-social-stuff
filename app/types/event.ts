export interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline?: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  attendees: User[];
  maxAttendees?: number;
  host: User;
  category: string;
  price?: number;
  isAttending?: boolean;
  startDateTime?: string;
  endDateTime?: string;
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  timestamp: string;
}

export interface Message {
  id: string;
  user: User;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

export interface Group {
  id: string;
  name: string;
  members: User[];
  lastMessage?: Message;
  unreadCount?: number;
}