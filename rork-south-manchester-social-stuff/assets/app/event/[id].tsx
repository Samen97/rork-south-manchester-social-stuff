import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Linking, Alert } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Image } from 'expo-image';
import { GradientBackground } from '@/components/GradientBackground';
import { GlassCard } from '@/components/GlassCard';
import { Avatar } from '@/components/Avatar';
import { Colors } from '@/constants/colors';
import { mockEvents, mockComments, toggleEventAttendance, addCommentToEvent } from '@/data/mockData';
import { ArrowLeft, Calendar, MapPin, Users, Send, MessageCircle, Check, Plus, CalendarPlus } from 'lucide-react-native';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const [comment, setComment] = useState('');
  const [isAttending, setIsAttending] = useState<boolean>(false);
  const [comments, setComments] = useState<any[]>([]);
  
  const event = mockEvents.find(e => e.id === id);
  
  React.useEffect(() => {
    if (event) {
      setIsAttending(event.isAttending || false);
      setComments(mockComments[event.id] || []);
    }
  }, [event]);
  
  if (!event) {
    return (
      <GradientBackground>
        <View style={styles.container}>
          <Text>Event not found</Text>
        </View>
      </GradientBackground>
    );
  }

  const handleBack = () => {
    router.back();
  };

  const handleSendComment = () => {
    if (comment.trim() && event) {
      const newComment = addCommentToEvent(event.id, comment.trim());
      setComments(prev => [...prev, newComment]);
      setComment('');
    }
  };

  const handleOpenChat = () => {
    router.push(`/chat/event-${event.id}`);
  };

  const handleToggleAttendance = () => {
    if (event) {
      const updatedEvent = toggleEventAttendance(event.id);
      if (updatedEvent) {
        setIsAttending(updatedEvent.isAttending || false);
      }
    }
  };

  const handleAddToCalendar = () => {
    if (!event || !event.startDateTime) {
      Alert.alert('Error', 'Event details are not available');
      return;
    }

    const startDate = new Date(event.startDateTime);
    const endDate = event.endDateTime ? new Date(event.endDateTime) : new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Default 2 hours
    
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(event.description);
    const location = encodeURIComponent(event.location);
    const startTime = formatDate(startDate);
    const endTime = formatDate(endDate);

    if (Platform.OS === 'ios') {
      // iOS Calendar
      const calendarUrl = `calshow:${startDate.getTime() / 1000}`;
      Linking.canOpenURL(calendarUrl).then(supported => {
        if (supported) {
          Linking.openURL(calendarUrl);
        } else {
          // Fallback to Google Calendar
          openGoogleCalendar();
        }
      });
    } else {
      // Android - try Google Calendar first
      openGoogleCalendar();
    }

    function openGoogleCalendar() {
      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}&location=${location}`;
      Linking.openURL(googleCalendarUrl).catch(() => {
        Alert.alert('Error', 'Unable to open calendar app');
      });
    }
  };

  return (
    <GradientBackground>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowLeft color={Colors.text.primary} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{event.title}</Text>
          <View style={styles.placeholder} />
        </View>

        <Image
          source={{ uri: event.image }}
          style={styles.heroImage}
          contentFit="cover"
        />

        <View style={styles.content}>
          <View style={styles.eventInfo}>
            <View style={styles.infoRow}>
              <Calendar color={Colors.primary} size={20} />
              <Text style={styles.infoText}>{event.date} • {event.time}</Text>
            </View>
            <View style={styles.infoRow}>
              <MapPin color={Colors.secondary} size={20} />
              <Text style={styles.infoText}>{event.location}</Text>
            </View>
          </View>

          <GlassCard style={styles.descriptionCard}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{event.description}</Text>
          </GlassCard>

          <View style={styles.actionButtons}>
            <TouchableOpacity 
              onPress={handleToggleAttendance} 
              style={[styles.attendButton, isAttending && styles.attendingButton]}
            >
              {isAttending ? (
                <Check color={Colors.background.primary} size={20} />
              ) : (
                <Plus color={Colors.background.primary} size={20} />
              )}
              <Text style={[styles.attendButtonText, isAttending && styles.attendingButtonText]}>
                {isAttending ? 'Attending' : 'Attend'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleAddToCalendar} style={styles.calendarButton}>
              <CalendarPlus color={Colors.primary} size={20} />
              <Text style={styles.calendarButtonText}>Add to Calendar</Text>
            </TouchableOpacity>
          </View>

          <GlassCard style={styles.attendeesCard}>
            <View style={styles.attendeesHeader}>
              <Text style={styles.sectionTitle}>Attendees</Text>
              <View style={styles.attendeesActions}>
                <TouchableOpacity onPress={handleOpenChat} style={styles.chatButton}>
                  <MessageCircle color={Colors.primary} size={16} />
                  <Text style={styles.chatButtonText}>Chat</Text>
                </TouchableOpacity>
                <View style={styles.attendeeCount}>
                  <Users color={Colors.primary} size={16} />
                  <Text style={styles.countText}>{event.attendees.length}</Text>
                </View>
              </View>
            </View>
            <View style={styles.attendeesList}>
              {event.attendees.map((attendee, index) => (
                <Avatar
                  key={attendee.id}
                  uri={attendee.avatar}
                  size={48}
                  style={[styles.attendeeAvatar, { marginLeft: index > 0 ? -12 : 0 }]}
                />
              ))}
              <View style={styles.moreAttendees}>
                <Text style={styles.moreText}>+12</Text>
              </View>
            </View>
          </GlassCard>

          <GlassCard style={styles.commentsCard}>
            <Text style={styles.sectionTitle}>Comments</Text>
            {comments.map((comment) => (
              <View key={comment.id} style={styles.comment}>
                <Avatar uri={comment.user.avatar} size={32} />
                <View style={styles.commentContent}>
                  <Text style={styles.commentText}>{comment.text}</Text>
                  <Text style={styles.commentTime}>{comment.timestamp}</Text>
                </View>
              </View>
            ))}
          </GlassCard>

          <GlassCard style={styles.commentInput}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Add a comment..."
                placeholderTextColor={Colors.text.muted}
                value={comment}
                onChangeText={setComment}
                multiline
              />
              <TouchableOpacity onPress={handleSendComment} style={styles.sendButton}>
                <Send color={Colors.primary} size={20} />
              </TouchableOpacity>
            </View>
          </GlassCard>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  heroImage: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  content: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  eventInfo: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 16,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  descriptionCard: {
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 24,
  },
  attendeesCard: {
    padding: 20,
    marginBottom: 20,
  },
  attendeesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  attendeesActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.primary,
    gap: 6,
  },
  chatButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  attendeeCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countText: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  attendeesList: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendeeAvatar: {
  },
  moreAttendees: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.glass.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -12,
  },
  moreText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  commentsCard: {
    padding: 20,
    marginBottom: 20,
  },
  comment: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentContent: {
    marginLeft: 12,
    flex: 1,
  },
  commentText: {
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  commentTime: {
    fontSize: 12,
    color: Colors.text.muted,
  },
  commentInput: {
    padding: 16,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
    paddingVertical: 8,
    paddingHorizontal: 0,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 12,
    padding: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  attendButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    gap: 8,
  },
  attendingButton: {
    backgroundColor: Colors.secondary,
  },
  attendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.background.primary,
  },
  attendingButtonText: {
    color: Colors.background.primary,
  },
  calendarButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.primary,
    gap: 8,
  },
  calendarButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
});