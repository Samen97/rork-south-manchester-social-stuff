import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { router, Stack } from 'expo-router';
import { GradientBackground } from '@/components/GradientBackground';
import { GlassCard } from '@/components/GlassCard';
import { Avatar } from '@/components/Avatar';
import { Colors } from '@/constants/colors';
import { ArrowLeft, Send, Sparkles } from 'lucide-react-native';
import { OPENROUTER_API_URL, OPENROUTER_API_KEY } from '@/config/api';

const promptSuggestions = [
  "What's happening tonight?",
  "Find a family-friendly event this weekend.",
  "Suggest a good place for live music.",
  "I'm looking for something to do in Chorlton.",
];

export default function AIChatScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    setMessages([
      {
        id: '1',
        user: { id: 'ai', name: 'AI Assistant', avatar: '🤖' },
        text: "Hello! I'm your friendly AI assistant. How can I help you find the perfect event in South Manchester today?",
        isOwn: false,
      },
    ]);
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleSend = async () => {
    if (message.trim()) {
      const userMessage = {
        id: Date.now().toString(),
        user: { id: '1', name: 'You', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' },
        text: message.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
      };
      
      setMessages(prev => [...prev, userMessage]);
      setMessage('');
      setIsLoading(true);

      try {
        const response = await fetch(OPENROUTER_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`
          },
          body: JSON.stringify({
            model: "openai/gpt-3.5-turbo",
            messages: [
              { role: 'system', content: 'You are a helpful and friendly AI assistant for the South Manchester Social app. Your goal is to help users find events. Be concise and conversational.' },
              ...messages.map(m => ({ role: m.isOwn ? 'user' : 'assistant', content: m.text })),
              { role: 'user', content: message.trim() }
            ]
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get response from AI');
        }

        const data = await response.json();
        const aiMessage = {
          id: Date.now().toString() + 'ai',
          user: { id: 'ai', name: 'AI Assistant', avatar: '🤖' },
          text: data.choices[0].message.content.trim(),
          isOwn: false,
        };
        setMessages(prev => [...prev, aiMessage]);

      } catch (error) {
        console.error('Error fetching AI response:', error);
        const errorMessage = {
          id: Date.now().toString() + 'error',
          user: { id: 'ai', name: 'AI Assistant', avatar: '🤖' },
          text: "Sorry, I'm having a little trouble connecting right now. Please try again later.",
          isOwn: false,
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
      
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
            <Sparkles color={Colors.primary} size={24} />
            <Text style={styles.headerTitle}>AI Assistant</Text>
          </View>
        </View>

        <ScrollView 
          ref={scrollViewRef}
          style={styles.messages} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map((msg, index) => (
            <View key={msg.id} style={[
              styles.messageContainer,
              msg.isOwn ? styles.ownMessage : styles.otherMessage
            ]}>
              {!msg.isOwn && (
                <View style={styles.avatarContainer}>
                  <Text style={styles.aiAvatar}>{msg.user.avatar}</Text>
                </View>
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
            </View>
          ))}
          {isLoading && (
            <View style={[styles.messageContainer, styles.otherMessage]}>
              <View style={styles.avatarContainer}>
                <Text style={styles.aiAvatar}>🤖</Text>
              </View>
              <GlassCard style={[styles.messageBubble, styles.otherBubble]}>
                <ActivityIndicator size="small" color={Colors.primary} />
              </GlassCard>
            </View>
          )}
        </ScrollView>

        <View style={styles.suggestionContainer}>
          {promptSuggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionChip}
              onPress={() => setMessage(suggestion)}
            >
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <GlassCard style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask about events, places, or ideas..."
            placeholderTextColor={Colors.text.muted}
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity 
            onPress={handleSend} 
            style={[
              styles.sendButton,
              message.trim() && styles.sendButtonActive
            ]}
            disabled={!message.trim() || isLoading}
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
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
    maxWidth: '85%',
  },
  ownMessage: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  aiAvatar: {
    fontSize: 24,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    margin: 20,
    padding: 12,
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
  suggestionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 8,
  },
  suggestionChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.glass.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.glass.border,
  },
  suggestionText: {
    color: Colors.text.primary,
    fontSize: 12,
  },
}); 