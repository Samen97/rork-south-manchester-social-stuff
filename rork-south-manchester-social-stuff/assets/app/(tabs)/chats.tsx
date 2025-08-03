import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, RefreshControl, ActivityIndicator } from 'react-native';
import { router, Stack } from 'expo-router';
import { GradientBackground } from '@/components/GradientBackground';
import { GlassCard } from '@/components/GlassCard';
import { Avatar } from '@/components/Avatar';
import { Colors } from '@/constants/colors';
import { Search, MessageCircle, Plus, Calendar } from 'lucide-react-native';
import useAppStore from '@/store/appStore';
import { Chat } from '@/types';

export default function ChatsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const {
    chats,
    fetchChats,
    fetchMoreChats,
    isLoadingMoreChats,
    hasMoreChats,
  } = useAppStore();

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchChats();
    setRefreshing(false);
  }, [fetchChats]);

  const handleLoadMore = () => {
    if (!isLoadingMoreChats && hasMoreChats) {
      fetchMoreChats();
    }
  };

  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleChatPress = (chat: Chat) => {
    if (chat.type === 'event' && chat.eventId) {
      router.push(`/chat/event-${chat.eventId}`);
    } else {
      router.push(`/chat/${chat.id}`);
    }
  };

  const renderChatItem = (chat: Chat) => {
    const isGroup = chat.type === 'group' || chat.type === 'event';
    const avatarSource = chat.avatar || (isGroup ? chat.participants[0]?.avatar : '') || '';
    
    return (
      <TouchableOpacity
        key={chat.id}
        onPress={() => handleChatPress(chat)}
        testID={`chat-item-${chat.id}`}
      >
        <GlassCard style={styles.chatItem}>
          <View style={styles.chatContent}>
            <View style={styles.avatarContainer}>
              {isGroup ? (
                <View style={styles.groupAvatarContainer}>
                  <Avatar uri={chat.participants[0]?.avatar} size={32} style={styles.groupAvatar1} />
                  {chat.participants[1] && (
                    <Avatar uri={chat.participants[1]?.avatar} size={32} style={styles.groupAvatar2} />
                  )}
                  {chat.type === 'event' && (
                    <View style={styles.eventBadge}>
                      <Calendar color={Colors.primary} size={12} />
                    </View>
                  )}
                </View>
              ) : (
                <View style={styles.directAvatarContainer}>
                  <Avatar uri={avatarSource ?? ''} size={48} />
                  {chat.isOnline && <View style={styles.onlineIndicator} />}
                </View>
              )}
            </View>
            
            <View style={styles.chatInfo}>
              <View style={styles.chatHeader}>
                <Text style={styles.chatName} numberOfLines={1}>
                  {chat.name}
                </Text>
                {chat.lastMessage && (
                  <Text style={styles.timestamp}>
                    {chat.lastMessage.timestamp}
                  </Text>
                )}
              </View>
              
              {chat.lastMessage && (
                <View style={styles.lastMessageContainer}>
                  <Text style={styles.lastMessage} numberOfLines={1}>
                    {chat.lastMessage.isOwn ? 'You: ' : ''}{chat.lastMessage.text}
                  </Text>
                  {chat.unreadCount && chat.unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadCount}>
                        {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                      </Text>
                    </View>
                  )}
                </View>
              )}
              
              {chat.type === 'group' && (
                <Text style={styles.participantCount}>
                  {chat.participants.length} members
                </Text>
              )}
            </View>
          </View>
        </GlassCard>
      </TouchableOpacity>
    );
  };

  return (
    <GradientBackground>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Chats</Text>
          <TouchableOpacity 
            style={styles.newChatButton}
            onPress={() => router.push('/start-chat')}
            testID="new-chat-button"
          >
            <Plus color={Colors.primary} size={24} />
          </TouchableOpacity>
        </View>

        <GlassCard style={styles.searchContainer}>
          <Search color={Colors.text.muted} size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search chats..."
            placeholderTextColor={Colors.text.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </GlassCard>



        <ScrollView 
          style={styles.chatsList} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.chatsContent}
          onScroll={({ nativeEvent }) => {
            if (isCloseToBottom(nativeEvent)) {
              handleLoadMore();
            }
          }}
          scrollEventThrottle={400}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
          }
        >
          {filteredChats.length > 0 ? (
            filteredChats.map(renderChatItem)
          ) : (
            <View style={styles.emptyState}>
              <MessageCircle color={Colors.text.muted} size={48} />
              <Text style={styles.emptyTitle}>No chats found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery ? 'Try a different search term' : 'Start a conversation!'}
              </Text>
            </View>
          )}
          {isLoadingMoreChats && (
            <View style={styles.loadingMoreContainer}>
              <ActivityIndicator size="small" color={Colors.primary} />
            </View>
          )}
        </ScrollView>
      </View>
    </GradientBackground>
  );
}

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }: any) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  newChatButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: Colors.text.primary,
  },

  chatsList: {
    flex: 1,
  },
  chatsContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 12,
  },
  chatItem: {
    padding: 16,
  },
  chatContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 12,
  },
  groupAvatarContainer: {
    width: 48,
    height: 48,
    position: 'relative',
  },
  groupAvatar1: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderWidth: 2,
    borderColor: Colors.background.primary as string,
  },
  groupAvatar2: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: Colors.background.primary as string,
  },
  eventBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.background.primary as string,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  directAvatarContainer: {
    position: 'relative',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4ADE80',
    borderWidth: 2,
    borderColor: Colors.background.primary as string,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.text.muted,
    marginLeft: 8,
  },
  lastMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: Colors.text.secondary,
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.light,
  },
  participantCount: {
    fontSize: 12,
    color: Colors.text.muted,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.text.muted,
    textAlign: 'center',
  },
  loadingMoreContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});