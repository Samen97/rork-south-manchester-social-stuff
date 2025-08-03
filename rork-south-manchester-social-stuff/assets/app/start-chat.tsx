import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { router, Stack } from 'expo-router';
import { GradientBackground } from '@/components/GradientBackground';
import { GlassCard } from '@/components/GlassCard';
import { Avatar } from '@/components/Avatar';
import { Colors } from '@/constants/colors';
import { mockUsers, mockChats, Chat, addNewChat } from '@/data/mockData';
import { Search, ArrowLeft, Users, MessageCircle, User } from 'lucide-react-native';

export default function StartChatScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [chatType, setChatType] = useState<'direct' | 'group'>('direct');
  const [groupName, setGroupName] = useState('');

  // Filter users based on search and exclude current user (assuming user id '1' is current user)
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const notCurrentUser = user.id !== '1'; // Assuming current user has id '1'
    return matchesSearch && notCurrentUser;
  });

  const handleUserToggle = (userId: string) => {
    if (chatType === 'direct') {
      setSelectedUsers([userId]);
    } else {
      setSelectedUsers(prev => 
        prev.includes(userId) 
          ? prev.filter(id => id !== userId)
          : [...prev, userId]
      );
    }
  };

  const handleCreateChat = () => {
    if (selectedUsers.length === 0) {
      Alert.alert('Error', 'Please select at least one user to start a chat.');
      return;
    }

    if (chatType === 'group' && selectedUsers.length < 2) {
      Alert.alert('Error', 'Group chats require at least 2 other users.');
      return;
    }

    if (chatType === 'group' && !groupName.trim()) {
      Alert.alert('Error', 'Please enter a group name.');
      return;
    }

    // Generate new chat ID
    const newChatId = chatType === 'direct' ? `dm-${Date.now()}` : `group-${Date.now()}`;
    
    // For direct messages, check if chat already exists
    if (chatType === 'direct') {
      const existingChat = mockChats.find(chat => 
        chat.type === 'direct' && 
        chat.participants.some(p => p.id === selectedUsers[0])
      );
      
      if (existingChat) {
        router.push(`/chat/${existingChat.id}`);
        return;
      }
    }

    // Create new chat (in a real app, this would be saved to backend)
    const selectedUserObjects = mockUsers.filter(user => selectedUsers.includes(user.id));
    const currentUser = mockUsers.find(user => user.id === '1')!;
    
    const newChat: Chat = {
      id: newChatId,
      type: chatType,
      name: chatType === 'direct' ? selectedUserObjects[0].name : groupName,
      avatar: chatType === 'direct' ? selectedUserObjects[0].avatar : undefined,
      participants: [currentUser, ...selectedUserObjects],
      unreadCount: 0,
    };

    // Add to mock data (in a real app, this would be an API call)
    addNewChat(newChat);

    // Navigate to the new chat
    console.log('Navigating to new chat:', newChatId);
    router.replace(`/chat/${newChatId}`);
  };

  const renderUserItem = (user: any) => {
    const isSelected = selectedUsers.includes(user.id);
    
    return (
      <TouchableOpacity
        key={user.id}
        onPress={() => handleUserToggle(user.id)}
        testID={`user-item-${user.id}`}
      >
        <GlassCard style={[styles.userItem, isSelected && styles.selectedUserItem]}>
          <View style={styles.userContent}>
            <Avatar uri={user.avatar} size={48} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userStatus}>Available</Text>
            </View>
            {isSelected && (
              <View style={styles.selectedIndicator}>
                <Text style={styles.selectedText}>✓</Text>
              </View>
            )}
          </View>
        </GlassCard>
      </TouchableOpacity>
    );
  };

  return (
    <GradientBackground>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          title: 'Start New Chat',
          headerStyle: { backgroundColor: 'transparent' },
          headerTintColor: Colors.text.primary,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft color={Colors.text.primary} size={24} />
            </TouchableOpacity>
          ),
        }} 
      />
      <View style={styles.container}>
        {/* Chat Type Selector */}
        <View style={styles.chatTypeContainer}>
          <TouchableOpacity
            style={[styles.chatTypeButton, chatType === 'direct' && styles.activeChatType]}
            onPress={() => {
              setChatType('direct');
              setSelectedUsers([]);
              setGroupName('');
            }}
          >
            <MessageCircle color={chatType === 'direct' ? Colors.primary : Colors.text.muted} size={20} />
            <Text style={[styles.chatTypeText, chatType === 'direct' && styles.activeChatTypeText]}>
              Direct Message
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.chatTypeButton, chatType === 'group' && styles.activeChatType]}
            onPress={() => {
              setChatType('group');
              setSelectedUsers([]);
              setGroupName('');
            }}
          >
            <Users color={chatType === 'group' ? Colors.primary : Colors.text.muted} size={20} />
            <Text style={[styles.chatTypeText, chatType === 'group' && styles.activeChatTypeText]}>
              Group Chat
            </Text>
          </TouchableOpacity>
        </View>

        {/* Group Name Input */}
        {chatType === 'group' && (
          <GlassCard style={styles.groupNameContainer}>
            <TextInput
              style={styles.groupNameInput}
              placeholder="Enter group name..."
              placeholderTextColor={Colors.text.muted}
              value={groupName}
              onChangeText={setGroupName}
            />
          </GlassCard>
        )}

        {/* Search */}
        <GlassCard style={styles.searchContainer}>
          <Search color={Colors.text.muted} size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            placeholderTextColor={Colors.text.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </GlassCard>

        {/* Selected Users Count */}
        {selectedUsers.length > 0 && (
          <View style={styles.selectedCount}>
            <Text style={styles.selectedCountText}>
              {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
            </Text>
          </View>
        )}

        {/* Users List */}
        <ScrollView 
          style={styles.usersList} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.usersContent}
        >
          {filteredUsers.length > 0 ? (
            filteredUsers.map(renderUserItem)
          ) : (
            <View style={styles.emptyState}>
              <User color={Colors.text.muted} size={48} />
              <Text style={styles.emptyTitle}>No users found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery ? 'Try a different search term' : 'No users available'}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Create Chat Button */}
        {selectedUsers.length > 0 && (
          <TouchableOpacity 
            style={styles.createButton}
            onPress={handleCreateChat}
            testID="create-chat-button"
          >
            <Text style={styles.createButtonText}>
              {chatType === 'direct' ? 'Start Chat' : `Create Group (${selectedUsers.length + 1})`}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  backButton: {
    padding: 8,
  },
  chatTypeContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  chatTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    gap: 8,
  },
  activeChatType: {
    backgroundColor: `${Colors.primary}20`,
    borderColor: Colors.primary,
  },
  chatTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.muted,
  },
  activeChatTypeText: {
    color: Colors.primary,
  },
  groupNameContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  groupNameInput: {
    fontSize: 16,
    color: Colors.text.primary,
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
  selectedCount: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  selectedCountText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  usersList: {
    flex: 1,
  },
  usersContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    gap: 12,
  },
  userItem: {
    padding: 16,
  },
  selectedUserItem: {
    backgroundColor: `${Colors.primary}15`,
    borderColor: Colors.primary,
  },
  userContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  userStatus: {
    fontSize: 14,
    color: Colors.text.muted,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedText: {
    color: Colors.text.light,
    fontSize: 14,
    fontWeight: '600',
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
  createButton: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.light,
  },
});