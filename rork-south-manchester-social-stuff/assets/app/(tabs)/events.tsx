import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { GradientBackground } from '@/components/GradientBackground';
import { EventCard } from '@/components/EventCard';
import { FloatingButton } from '@/components/FloatingButton';
import { Colors } from '@/constants/colors';
import { mockEvents } from '@/data/mockData';
import { router } from 'expo-router';

export default function EventsScreen() {
  const handleCreateEvent = () => {
    router.push('/create-event');
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <ScrollView style={styles.eventsList} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          {mockEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
          <View style={{ height: 120 }} />
        </ScrollView>

        <FloatingButton onPress={handleCreateEvent} />
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  eventsList: {
    flex: 1,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.primary,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
});