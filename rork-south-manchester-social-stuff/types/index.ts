export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Message {
  id: string;
  user: User;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

export interface Event {
  id:string;
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
  isAttending: boolean;
  startDateTime: string;
  endDateTime: string;
}

export interface Chat {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'event';
  avatar?: string;
  lastMessage?: Message;
  unreadCount?: number;
  participants: User[];
  isOnline?: boolean;
  eventId?: string;
}

export interface Group {
  id: string;
  name: string;
  members: User[];
  avatar: string;
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  timestamp: string;
} 