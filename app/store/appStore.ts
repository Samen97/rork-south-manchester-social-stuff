import { create } from 'zustand';
import { Event, Chat } from '@/types';
import { supabase } from '@/config/supabase';
import { Session } from '@supabase/supabase-js';

interface AppState {
  session: Session | null;
  events: Event[];
  chats: Chat[];
  fetchEvents: () => Promise<void>;
  fetchChats: () => Promise<void>;
  addEvent: (event: Omit<Event, 'id' | 'created_at' | 'host_id'>) => Promise<void>;
  setSession: (session: Session | null) => void;
  signOut: () => Promise<void>;
}

const useAppStore = create<AppState>((set, get) => ({
  session: null,
  events: [],
  chats: [],

  fetchEvents: async () => {
    const { data, error } = await supabase.from('events').select('*');
    if (error) console.error('Error fetching events:', error);
    else set({ events: data || [] });
  },

  fetchChats: async () => {
    const { data, error } = await supabase.from('chats').select('*');
    if (error) console.error('Error fetching chats:', error);
    else set({ chats: data || [] });
  },

  addEvent: async (event) => {
    const { session } = get();
    if (!session) return;

    const { data, error } = await supabase.from('events').insert([
      { ...event, host_id: session.user.id }
    ]).select();

    if (error) console.error('Error adding event:', error);
    else if (data) {
      set(state => ({
        events: [data[0], ...state.events]
      }));
    }
  },

  setSession: (session) => {
    set({ session });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null });
  },
}));

supabase.auth.onAuthStateChange((_event, session) => {
  useAppStore.getState().setSession(session);
});

export default useAppStore; 