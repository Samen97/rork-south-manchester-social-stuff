import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { GradientBackground } from '@/components/GradientBackground';
import { GlassCard } from '@/components/GlassCard';
import { Avatar } from '@/components/Avatar';
import { Colors } from '@/constants/colors';
import { Settings, Calendar, Users, MessageCircle, Bell, Shield, ChevronRight, Edit3 } from 'lucide-react-native';

export default function ProfileScreen() {
  const stats = [
    { label: 'Events Hosted', value: '12', icon: Calendar },
    { label: 'Days Active', value: '45', icon: Users },
    { label: 'Connections', value: '89', icon: MessageCircle },
  ];

  const menuItems = [
    { label: 'Edit Profile', icon: Edit3, action: () => router.push('/edit-profile') },
    { label: 'Notifications', icon: Bell, action: () => router.push('/notifications') },
    { label: 'Privacy & Safety', icon: Shield, action: () => router.push('/privacy-safety') },
    { label: 'Settings', icon: Settings, action: () => router.push('/settings') },
  ];

  return (
    <GradientBackground>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        <GlassCard style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Avatar 
                uri="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" 
                size={100} 
                showOnline={true}
              />
              <View style={styles.onlineRing} />
            </View>
            <Text style={styles.name}>David Chen</Text>
            <Text style={styles.location}>Chorlton, Manchester</Text>
            <Text style={styles.bio}>Love connecting with locals! Always up for a good chat over coffee ☕</Text>
          </View>
        </GlassCard>

        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <GlassCard key={index} style={styles.statCard}>
              <stat.icon color={Colors.primary} size={24} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </GlassCard>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} onPress={item.action}>
              <GlassCard style={styles.menuItem}>
                <View style={styles.menuContent}>
                  <View style={styles.menuLeft}>
                    <View style={styles.menuIcon}>
                      <item.icon color={Colors.primary} size={20} />
                    </View>
                    <Text style={styles.menuLabel}>{item.label}</Text>
                  </View>
                  <ChevronRight color={Colors.text.secondary} size={16} />
                </View>
              </GlassCard>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  profileCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 24,
  },
  profileHeader: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  onlineRing: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 54,
    borderWidth: 3,
    borderColor: Colors.primary,
    opacity: 0.4,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 32,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  menuItem: {
    marginBottom: 8,
    padding: 18,
  },
  menuContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.glass.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 16,
    color: Colors.text.primary,
    fontWeight: '500',
  },
});