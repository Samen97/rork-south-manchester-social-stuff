import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { GradientBackground } from '@/components/GradientBackground';
import { GlassCard } from '@/components/GlassCard';
import { Avatar } from '@/components/Avatar';
import { Colors } from '@/constants/colors';
import { mockGroups, mockMessages, mockChats, mockEventMessages, mockDirectMessages, mockEvents, mockGroupMessages } from '@/data/mockData';
import { ArrowLeft, Send, Smile, Phone, Video, MoreVertical, Calendar, Users } from 'lucide-react-native';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Find chat data
  const chatId = Array.isArray(id) ? id[0] : id;
  console.log('Chat ID:', chatId);
  
  const chat = mockChats.find(c => c.id === chatId);
  const group = mockGroups.find(g => g.id === chatId);
  const isEventChat = typeof chatId === 'string' && chatId.startsWith('event-');
  const eventId = isEventChat ? chatId.replace('event-', '') : null;
  const event = eventId ? mockEvents.find(e => e.id === eventId) : null;
  
  console.log('Found chat:', chat);
  console.log('Is event chat:', isEventChat, 'Event ID:', eventId);
  
  useEffect(() => {
    console.log('Loading messages for:', { chatId, chatType: chat?.type, isEventChat, eventId });
    // Load messages based on chat type
    if (isEventChat && eventId) {
      const eventMessages = mockEventMessages[eventId] || [];
      console.log('Loading event messages:', eventMessages.length);
      setMessages(eventMessages);
    } else if (chat?.type === 'direct') {
      const directMessages = mockDirectMessages[chatId] || [];
      console.log('Loading direct messages for', chatId, ':', directMessages.length);
      setMessages(directMessages);
    } else if (chat?.type === 'group') {
      const groupMessages = mockGroupMessages[chatId] || mockMessages;
      console.log('Loading group messages for', chatId, ':', groupMessages.length);
      setMessages(groupMessages);
    } else {
      console.log('No messages found for chat');
      setMessages([]);
    }
  }, [chatId, chat, isEventChat, eventId]);
  
  // Determine chat info
  const chatInfo = chat || (isEventChat && event ? {
    name: `${event.title} Chat`,
    participants: event.attendees,
    type: 'event' as const
  } : group ? {
    name: group.name,
    participants: group.members,
    type: 'group' as const
  } : null);
  
  console.log('Chat info:', chatInfo);
  
  if (!chatInfo) {
    return (
      <GradientBackground>
        <View style={styles.container}>
          <Text style={styles.errorText}>Chat not found</Text>
        </View>
      </GradientBackground>
    );
  }

  const handleBack = () => {
    router.back();
  };

  const handleSend = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        user: { id: '1', name: 'You', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' },
        text: message.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
      };
      
      // Add to local state
      setMessages(prev => [...prev, newMessage]);
      
      // Add to mock data for persistence
      if (isEventChat && eventId) {
        if (!mockEventMessages[eventId]) {
          mockEventMessages[eventId] = [];
        }
        mockEventMessages[eventId].push(newMessage);
      } else if (chat?.type === 'direct') {
        if (!mockDirectMessages[chatId]) {
          mockDirectMessages[chatId] = [];
        }
        mockDirectMessages[chatId].push(newMessage);
      } else if (chat?.type === 'group') {
        if (!mockGroupMessages[chatId]) {
          mockGroupMessages[chatId] = [];
        }
        mockGroupMessages[chatId].push(newMessage);
      }
      
      setMessage('');
      
      // Auto-scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  return (
    <GradientBackground>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowLeft color={Colors.text.primary} size={24} />
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>{chatInfo.name}</Text>
              {chat?.type === 'event' && (
                <View style={styles.eventBadge}>
                  <Calendar color={Colors.primary} size={12} />
                </View>
              )}
              {chat?.type === 'group' && (
                <View style={styles.groupBadge}>
                  <Users color={Colors.primary} size={12} />
                </View>
              )}
            </View>
            <Text style={styles.headerSubtitle}>
              {chat?.type === 'direct' && chat.isOnline ? 'Online' : 
               chat?.type === 'event' ? `${chatInfo.participants.length} attendees` :
               `${chatInfo.participants.length} members`}
            </Text>
          </View>
          
          <View style={styles.headerActions}>
            {chat?.type === 'direct' && (
              <>
                <TouchableOpacity style={styles.actionButton}>
                  <Phone color={Colors.text.primary} size={20} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Video color={Colors.text.primary} size={20} />
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity style={styles.actionButton}>
              <MoreVertical color={Colors.text.primary} size={20} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          ref={scrollViewRef}
          style={styles.messages} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.length > 0 ? messages.map((msg, index) => {
            const showAvatar = !msg.isOwn && (index === 0 || messages[index - 1]?.user.id !== msg.user.id);
            const showName = !msg.isOwn && showAvatar && (chat?.type === 'group' || chat?.type === 'event');
            
            return (
              <View key={msg.id} style={[
                styles.messageContainer,
                msg.isOwn ? styles.ownMessage : styles.otherMessage
              ]}>
                {!msg.isOwn && (
                  <View style={styles.avatarContainer}>
                    {showAvatar ? (
                      <Avatar uri={msg.user.avatar} size={32} style={styles.messageAvatar} />
                    ) : (
                      <View style={styles.avatarSpacer} />
                    )}
                  </View>
                )}
                <View style={styles.messageBubbleContainer}>
                  {showName && (
                    <Text style={styles.senderName}>{msg.user.name}</Text>
                  )}
                  <GlassCard style={[
                    styles.messageBubble,
                    msg.isOwn ? styles.ownBubble : styles.otherBubble
                  ]}>
                    <Text style={[
                      styles.messageText,
                      msg.isOwn ? styles.ownText : styles.otherText
                    ]}>
                      {msg.text}
                    </Text>
                  </GlassCard>
                  <Text style={[
                    styles.messageTimestamp,
                    msg.isOwn ? styles.ownTimestamp : styles.otherTimestamp
                  ]}>
                    {msg.timestamp}
                  </Text>
                </View>
                {msg.isOwn && (
                  <Avatar uri={msg.user.avatar} size={32} style={styles.messageAvatar} />
                )}
              </View>
            );
          }) : (
            <View style={styles.emptyMessages}>
              <Text style={styles.emptyText}>No messages yet</Text>
              <Text style={styles.emptySubtext}>Start the conversation!</Text>
            </View>
          )}
        </ScrollView>

        <GlassCard style={styles.inputContainer}>
          <TouchableOpacity style={styles.emojiButton}>
            <Smile color={Colors.text.muted} size={24} />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            placeholder={`Message ${chatInfo.name}...`}
            placeholderTextColor={Colors.text.muted}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity 
            onPress={handleSend} 
            style={[
              styles.sendButton,
              message.trim() && styles.sendButtonActive
            ]}
            disabled={!message.trim()}
          >
            <Send color={message.trim() ? Colors.text.light : Colors.text.muted} size={20} />
          </TouchableOpacity>
        </GlassCard>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.glass.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
    marginHorizontal: 12,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  messages: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  avatarContainer: {
    width: 40,
  },
  avatarSpacer: {
    width: 32,
    height: 32,
  },
  ownMessage: {
    justifyContent: 'flex-end',
  },
  otherMessage: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    marginRight: 8,
  },
  messageBubbleContainer: {
    flex: 1,
    maxWidth: '75%',
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: 4,
    marginLeft: 4,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    marginBottom: 4,
  },
  ownBubble: {
    backgroundColor: Colors.primary,
  },
  otherBubble: {
    backgroundColor: Colors.glass.background,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  ownText: {
    color: Colors.text.light,
  },
  otherText: {
    color: Colors.text.primary,
  },
  messageTimestamp: {
    fontSize: 11,
    color: Colors.text.muted,
    marginHorizontal: 4,
  },
  ownTimestamp: {
    textAlign: 'right',
  },
  otherTimestamp: {
    textAlign: 'left',
  },
  emptyMessages: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.text.muted,
  },
  errorText: {
    fontSize: 16,
    color: Colors.text.primary,
    textAlign: 'center',
    marginTop: 100,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    margin: 20,
    padding: 12,
  },
  emojiButton: {
    padding: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    maxHeight: 100,
  },
  sendButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.glass.border,
  },
  sendButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
});