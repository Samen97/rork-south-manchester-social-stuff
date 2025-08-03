import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { GradientBackground } from '@/components/GradientBackground';
import { GlassCard } from '@/components/GlassCard';
import { Avatar } from '@/components/Avatar';
import { Colors } from '@/constants/colors';
import { Bot, Send, Trash2, Settings } from 'lucide-react-native';

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
  lastMessage?: string;
  timestamp: Date;
};

export default function AIAssistantScreen() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSessions, setShowSessions] = useState<boolean>(true);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (currentSession && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [currentSession?.messages]);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      timestamp: new Date(),
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSession(newSession);
    setShowSessions(false);
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !currentSession) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, userMessage],
      lastMessage: inputText.trim(),
      title: currentSession.messages.length === 0 ? inputText.trim().slice(0, 30) + '...' : currentSession.title,
    };

    setCurrentSession(updatedSession);
    setSessions(prev => prev.map(s => s.id === currentSession.id ? updatedSession : s));
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are a helpful AI assistant. Be concise and friendly.' },
            ...updatedSession.messages.map(msg => ({
              role: msg.isUser ? 'user' : 'assistant',
              content: msg.text
            }))
          ]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.completion,
        isUser: false,
        timestamp: new Date(),
      };

      const finalSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, aiMessage],
        lastMessage: data.completion,
      };

      setCurrentSession(finalSession);
      setSessions(prev => prev.map(s => s.id === currentSession.id ? finalSession : s));
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to get AI response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSession = (sessionId: string) => {
    console.log('Attempting to delete session:', sessionId);
    console.log('Current sessions count:', sessions.length);
    
    const performDelete = () => {
      console.log('Performing delete for session:', sessionId);
      
      // Update sessions state
      setSessions(prevSessions => {
        const filtered = prevSessions.filter(s => s.id !== sessionId);
        console.log('Sessions after deletion:', filtered.length);
        return filtered;
      });
      
      // Reset current session if it was deleted
      if (currentSession?.id === sessionId) {
        console.log('Resetting current session');
        setCurrentSession(null);
        setShowSessions(true);
      }
    };
    
    if (Platform.OS === 'ios') {
      // Use iOS native alert for better reliability
      Alert.alert(
        'Delete Chat',
        'Are you sure you want to delete this chat session?',
        [
          { 
            text: 'Cancel', 
            style: 'cancel',
            onPress: () => console.log('Delete cancelled')
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              console.log('iOS delete confirmed');
              // Add small delay for iOS
              setTimeout(performDelete, 100);
            },
          },
        ],
        { cancelable: true }
      );
    } else {
      // Android/Web - direct execution
      Alert.alert(
        'Delete Chat',
        'Are you sure you want to delete this chat session?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: performDelete,
          },
        ]
      );
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (showSessions || !currentSession) {
    return (
      <GradientBackground>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>AI Assistant</Text>
            <TouchableOpacity style={styles.profileButton}>
              <Avatar uri="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" size={36} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.newChatButton} onPress={createNewSession}>
            <GlassCard style={styles.newChatCard}>
              <View style={styles.newChatContent}>
                <View style={styles.botIcon}>
                  <Bot color={Colors.primary} size={24} />
                </View>
                <Text style={styles.newChatText}>Start New Chat</Text>
              </View>
            </GlassCard>
          </TouchableOpacity>

          <ScrollView style={styles.sessionsList} showsVerticalScrollIndicator={false}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Chats</Text>
            </View>
            {sessions.map((session) => (
              <GlassCard key={session.id} style={styles.sessionCard}>
                <TouchableOpacity
                  style={styles.sessionContent}
                  onPress={() => {
                    setCurrentSession(session);
                    setShowSessions(false);
                  }}
                >
                  <View style={styles.sessionIcon}>
                    <Bot color={Colors.primary} size={20} />
                  </View>
                  <View style={styles.sessionDetails}>
                    <Text style={styles.sessionTitle} numberOfLines={1}>
                      {session.title}
                    </Text>
                    {session.lastMessage && (
                      <Text style={styles.sessionLastMessage} numberOfLines={2}>
                        {session.lastMessage}
                      </Text>
                    )}
                    <Text style={styles.sessionTime}>
                      {formatTime(session.timestamp)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      console.log('Delete button pressed for session:', session.id);
                      console.log('Session exists in array:', sessions.some(s => s.id === session.id));
                      deleteSession(session.id);
                    }}
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                    activeOpacity={0.6}
                    delayPressIn={0}
                    delayPressOut={0}
                  >
                    <Trash2 color={Colors.text.muted} size={18} />
                  </TouchableOpacity>
                </TouchableOpacity>
              </GlassCard>
            ))}
            {sessions.length === 0 && (
              <View style={styles.emptyState}>
                <Bot color={Colors.text.muted} size={48} />
                <Text style={styles.emptyStateText}>No chat sessions yet</Text>
                <Text style={styles.emptyStateSubtext}>Start a new chat to begin</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.chatHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setShowSessions(true)}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.chatTitle} numberOfLines={1}>
            {currentSession.title}
          </Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings color={Colors.text.secondary} size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          {currentSession.messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.isUser ? styles.userMessageContainer : styles.aiMessageContainer,
              ]}
            >
              <GlassCard
                style={[
                  styles.messageBubble,
                  message.isUser ? styles.userMessageBubble : styles.aiMessageBubble,
                ]}
              >
                {!message.isUser && (
                  <View style={styles.aiAvatar}>
                    <Bot color={Colors.primary} size={16} />
                  </View>
                )}
                <View style={message.isUser ? undefined : styles.aiMessageContent}>
                  <Text
                    style={[
                      styles.messageText,
                      message.isUser ? styles.userMessageText : styles.aiMessageText,
                    ]}
                  >
                    {message.text}
                  </Text>
                  <Text style={styles.messageTime}>
                    {formatTime(message.timestamp)}
                  </Text>
                </View>
                {message.isUser && (
                  <Text style={styles.messageTime}>
                    {formatTime(message.timestamp)}
                  </Text>
                )}
              </GlassCard>
            </View>
          ))}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <GlassCard style={styles.loadingBubble}>
                <View style={styles.aiAvatar}>
                  <Bot color={Colors.primary} size={16} />
                </View>
                <ActivityIndicator color={Colors.primary} size="small" />
                <Text style={styles.loadingText}>AI is thinking...</Text>
              </GlassCard>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <GlassCard style={styles.inputCard}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask me anything..."
              placeholderTextColor={Colors.text.muted}
              multiline
              maxLength={1000}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
              ]}
              onPress={sendMessage}
              disabled={!inputText.trim() || isLoading}
            >
              <Send 
                color={(!inputText.trim() || isLoading) ? Colors.text.muted : Colors.primary} 
                size={20} 
              />
            </TouchableOpacity>
          </GlassCard>
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  profileButton: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  tabContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 4,
  },
  tabs: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 16,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  activeTabText: {
    color: Colors.text.light,
  },
  content: {
    flex: 1,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  chatCard: {
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 16,
  },
  chatContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatAvatars: {
    flexDirection: 'row',
    marginRight: 16,
  },
  chatAvatar: {
    borderWidth: 2,
    borderColor: Colors.background.primary,
  },
  chatDetails: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  chatMembers: {
    fontSize: 12,
    color: Colors.text.muted,
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 20,
    alignItems: 'center',
  },
  unreadText: {
    color: Colors.text.light,
    fontSize: 12,
    fontWeight: '600',
  },
  groupCard: {
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 16,
  },
  groupContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.glass.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  groupDetails: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  memberCount: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  newChatButton: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  newChatCard: {
    padding: 20,
  },
  newChatContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.glass.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  newChatText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  sessionsList: {
    flex: 1,
  },
  sessionCard: {
    marginHorizontal: 20,
    marginVertical: 6,
    padding: 16,
  },
  sessionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.glass.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sessionDetails: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  sessionLastMessage: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  sessionTime: {
    fontSize: 12,
    color: Colors.text.muted,
  },
  deleteButton: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 40,
    minHeight: 40,
    zIndex: 10,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.text.muted,
    marginTop: 8,
    textAlign: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.glass.border,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  settingsButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
    paddingBottom: 100,
  },
  messageContainer: {
    marginVertical: 4,
    paddingHorizontal: 20,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  aiMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 16,
  },
  userMessageBubble: {
    backgroundColor: Colors.primary,
    padding: 12,
  },
  aiMessageBubble: {
    backgroundColor: Colors.glass.background,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
  },
  aiAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.glass.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: Colors.text.light,
  },
  aiMessageText: {
    color: Colors.text.primary,
    flex: 1,
  },
  aiMessageContent: {
    flex: 1,
  },
  messageTime: {
    fontSize: 11,
    color: Colors.text.muted,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  loadingContainer: {
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginVertical: 4,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    backgroundColor: Colors.glass.background,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 100,
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    minHeight: 56,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
    maxHeight: 120,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.glass.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});