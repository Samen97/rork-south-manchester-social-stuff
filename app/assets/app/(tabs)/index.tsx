import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, RefreshControl, ActivityIndicator } from 'react-native';
import { GradientBackground } from '@/components/GradientBackground';
import { GlassCard } from '@/components/GlassCard';
import { EventCard } from '@/components/EventCard';
import { FloatingButton } from '@/components/FloatingButton';
import { Colors } from '@/constants/colors';
import { mockEvents } from '@/data/mockData';
import { Sparkles, MapPin, Search, X } from 'lucide-react-native';
import { router } from 'expo-router';
import useAppStore from '@/store/appStore';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const {
    events,
    fetchEvents,
    fetchMoreEvents,
    isLoadingMoreEvents,
    hasMoreEvents,
  } = useAppStore();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  }, [fetchEvents]);

  const handleLoadMore = () => {
    if (!isLoadingMoreEvents && hasMoreEvents) {
      fetchMoreEvents();
    }
  };

  const handleCreateEvent = () => {
    router.push('/create-event');
  };

  const handleSearch = () => {
    setShowSearchModal(true);
  };

  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return events;
    
    const query = searchQuery.toLowerCase();
    return events.filter(event => 
      event.title.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query) ||
      event.location.toLowerCase().includes(query) ||
      event.category.toLowerCase().includes(query)
    );
  }, [searchQuery, events]);

  const closeSearch = () => {
    setShowSearchModal(false);
    setSearchQuery('');
  };

  return (
    <GradientBackground>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
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
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good evening! 👋</Text>
            <Text style={styles.subtitle}>What&apos;s happening in South Manchester?</Text>
          </View>
          <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
            <Search color={Colors.primary} size={24} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push('/ai-chat')}>
          <GlassCard style={styles.aiCard}>
            <View style={styles.aiContent}>
              <Sparkles color={Colors.primary} size={24} />
              <View style={styles.aiText}>
                <Text style={styles.aiTitle}>Tonight near you</Text>
                <Text style={styles.aiSubtitle}>3 events happening within 2 miles</Text>
              </View>
            </View>
          </GlassCard>
        </TouchableOpacity>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Happening Soon</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
          {isLoadingMoreEvents && (
            <View style={styles.loadingMoreContainer}>
              <ActivityIndicator size="small" color={Colors.primary} />
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular in Chorlton</Text>
          </View>
          <GlassCard style={styles.locationCard}>
            <View style={styles.locationContent}>
              <MapPin color={Colors.secondary} size={20} />
              <Text style={styles.locationText}>5 events this week</Text>
            </View>
          </GlassCard>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <FloatingButton onPress={handleCreateEvent} />
      
      <Modal
        visible={showSearchModal}
        transparent
        animationType="fade"
        onRequestClose={closeSearch}
      >
        <View style={styles.searchModalOverlay}>
          <GlassCard style={styles.searchModal}>
            <View style={styles.searchHeader}>
              <View style={styles.searchInputContainer}>
                <Search color={Colors.primary} size={20} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search events, locations, categories..."
                  placeholderTextColor={Colors.text.muted}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
                />
              </View>
              <TouchableOpacity onPress={closeSearch} style={styles.searchCloseButton}>
                <X color={Colors.text.secondary} size={20} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.searchResults} showsVerticalScrollIndicator={false}>
              {searchQuery.trim() ? (
                filteredEvents.length > 0 ? (
                  <>
                    <Text style={styles.searchResultsTitle}>
                      {filteredEvents.length} result{filteredEvents.length !== 1 ? 's' : ''} found
                    </Text>
                    {filteredEvents.map((event) => (
                      <TouchableOpacity
                        key={event.id}
                        onPress={() => {
                          closeSearch();
                          router.push(`/event/${event.id}`);
                        }}
                      >
                        <EventCard event={event} />
                      </TouchableOpacity>
                    ))}
                  </>
                ) : (
                  <View style={styles.noResults}>
                    <Text style={styles.noResultsText}>No events found</Text>
                    <Text style={styles.noResultsSubtext}>Try searching for something else</Text>
                  </View>
                )
              ) : (
                <View style={styles.searchSuggestions}>
                  <Text style={styles.suggestionsTitle}>Popular searches</Text>
                  {['Games', 'Food', 'Outdoors', 'Music', 'Chorlton', 'Didsbury'].map((suggestion) => (
                    <TouchableOpacity
                      key={suggestion}
                      style={styles.suggestionItem}
                      onPress={() => setSearchQuery(suggestion)}
                    >
                      <Search color={Colors.text.secondary} size={16} />
                      <Text style={styles.suggestionText}>{suggestion}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </ScrollView>
          </GlassCard>
        </View>
      </Modal>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiCard: {
    marginHorizontal: 20,
    marginBottom: 32,
    padding: 20,
  },
  aiContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiText: {
    marginLeft: 16,
    flex: 1,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  aiSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  seeAll: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  locationCard: {
    marginHorizontal: 20,
    padding: 16,
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 12,
    fontSize: 16,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  searchModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  searchModal: {
    flex: 1,
    padding: 20,
    marginBottom: 40,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.glass.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
  },
  searchCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchResults: {
    flex: 1,
  },
  searchResultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  searchSuggestions: {
    paddingTop: 20,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.glass.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    marginBottom: 8,
    gap: 12,
  },
  suggestionText: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  loadingMoreContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});