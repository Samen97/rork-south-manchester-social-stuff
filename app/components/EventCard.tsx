import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { GlassCard } from './GlassCard';
import { Avatar } from './Avatar';
import { Event } from '@/types/event';
import { Colors } from '@/constants/colors';
import { ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const handlePress = () => {
    router.push(`/event/${event.id}`);
  };

  return (
    <Pressable onPress={handlePress}>
      <GlassCard style={styles.card}>
        <View style={styles.content}>
          <Image
            source={{ uri: event.image }}
            style={styles.eventImage}
            contentFit="cover"
          />
          <View style={styles.details}>
            <Text style={styles.title}>{event.title}</Text>
            <Text style={styles.dateTime}>{event.date}</Text>
            <Text style={styles.location}>{event.time}</Text>
            
            <View style={styles.attendees}>
              {event.attendees.slice(0, 3).map((attendee, index) => (
                <Avatar
                  key={attendee.id}
                  uri={attendee.avatar}
                  size={24}
                  style={[styles.attendeeAvatar, { marginLeft: index > 0 ? -8 : 0 }]}
                />
              ))}
              {event.attendees.length > 3 && (
                <View style={styles.moreCount}>
                  <Text style={styles.moreText}>+{event.attendees.length - 3}</Text>
                </View>
              )}
            </View>
          </View>
          <ChevronRight color={Colors.text.secondary} size={20} />
        </View>
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  dateTime: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  location: {
    fontSize: 14,
    color: Colors.text.muted,
    marginBottom: 8,
  },
  attendees: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendeeAvatar: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  moreCount: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(131, 92, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  moreText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});