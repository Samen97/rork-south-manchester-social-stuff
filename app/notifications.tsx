import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { router, Stack } from 'expo-router';
import { GradientBackground } from '@/components/GradientBackground';
import { GlassCard } from '@/components/GlassCard';
import { Colors } from '@/constants/colors';
import { Bell, MessageCircle, Calendar, Users, Volume2, Smartphone, Mail, ArrowLeft } from 'lucide-react-native';

export default function NotificationsScreen() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);

  const [eventReminders, setEventReminders] = useState(true);
  const [newMessages, setNewMessages] = useState(true);
  const [eventUpdates, setEventUpdates] = useState(true);
  const [groupInvites, setGroupInvites] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  const notificationTypes = [
    {
      title: 'Event Reminders',
      description: 'Get notified before events you&apos;re attending',
      icon: Calendar,
      value: eventReminders,
      onToggle: setEventReminders,
    },
    {
      title: 'New Messages',
      description: 'Notifications for new chat messages',
      icon: MessageCircle,
      value: newMessages,
      onToggle: setNewMessages,
    },
    {
      title: 'Event Updates',
      description: 'Changes to events you&apos;re attending',
      icon: Bell,
      value: eventUpdates,
      onToggle: setEventUpdates,
    },
    {
      title: 'Group Invites',
      description: 'Invitations to join new groups',
      icon: Users,
      value: groupInvites,
      onToggle: setGroupInvites,
    },
  ];

  const deliveryMethods = [
    {
      title: 'Push Notifications',
      description: 'Receive notifications on your device',
      icon: Smartphone,
      value: pushEnabled,
      onToggle: setPushEnabled,
    },
    {
      title: 'Email',
      description: 'Get updates via email',
      icon: Mail,
      value: emailEnabled,
      onToggle: setEmailEnabled,
    },
  ];

  const soundSettings = [
    {
      title: 'Sound',
      description: 'Play notification sounds',
      icon: Volume2,
      value: soundEnabled,
      onToggle: setSoundEnabled,
    },
    {
      title: 'Vibration',
      description: 'Vibrate for notifications',
      icon: Smartphone,
      value: vibrationEnabled,
      onToggle: setVibrationEnabled,
    },
  ];

  return (
    <GradientBackground>
      <Stack.Screen 
        options={{
          title: 'Notifications',
          headerStyle: { backgroundColor: 'transparent' },
          headerTintColor: Colors.text.primary,
          headerTitleStyle: { fontWeight: '700' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft color={Colors.text.primary} size={24} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Types</Text>
          <Text style={styles.sectionDescription}>
            Choose what you&apos;d like to be notified about
          </Text>
          
          {notificationTypes.map((item, index) => (
            <GlassCard key={index} style={styles.settingCard}>
              <View style={styles.settingContent}>
                <View style={styles.settingLeft}>
                  <View style={styles.settingIcon}>
                    <item.icon color={Colors.primary} size={20} />
                  </View>
                  <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>{item.title}</Text>
                    <Text style={styles.settingDescription}>{item.description}</Text>
                  </View>
                </View>
                <Switch
                  value={item.value}
                  onValueChange={item.onToggle}
                  trackColor={{ false: Colors.glass.border, true: Colors.primary }}
                  thumbColor={Colors.background.primary}
                  ios_backgroundColor={Colors.glass.border}
                />
              </View>
            </GlassCard>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Methods</Text>
          <Text style={styles.sectionDescription}>
            How would you like to receive notifications?
          </Text>
          
          {deliveryMethods.map((item, index) => (
            <GlassCard key={index} style={styles.settingCard}>
              <View style={styles.settingContent}>
                <View style={styles.settingLeft}>
                  <View style={styles.settingIcon}>
                    <item.icon color={Colors.primary} size={20} />
                  </View>
                  <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>{item.title}</Text>
                    <Text style={styles.settingDescription}>{item.description}</Text>
                  </View>
                </View>
                <Switch
                  value={item.value}
                  onValueChange={item.onToggle}
                  trackColor={{ false: Colors.glass.border, true: Colors.primary }}
                  thumbColor={Colors.background.primary}
                  ios_backgroundColor={Colors.glass.border}
                />
              </View>
            </GlassCard>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sound & Vibration</Text>
          <Text style={styles.sectionDescription}>
            Customize notification alerts
          </Text>
          
          {soundSettings.map((item, index) => (
            <GlassCard key={index} style={styles.settingCard}>
              <View style={styles.settingContent}>
                <View style={styles.settingLeft}>
                  <View style={styles.settingIcon}>
                    <item.icon color={Colors.primary} size={20} />
                  </View>
                  <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>{item.title}</Text>
                    <Text style={styles.settingDescription}>{item.description}</Text>
                  </View>
                </View>
                <Switch
                  value={item.value}
                  onValueChange={item.onToggle}
                  trackColor={{ false: Colors.glass.border, true: Colors.primary }}
                  thumbColor={Colors.background.primary}
                  ios_backgroundColor={Colors.glass.border}
                />
              </View>
            </GlassCard>
          ))}
        </View>

        <GlassCard style={styles.infoCard}>
          <View style={styles.infoContent}>
            <Bell color={Colors.primary} size={24} />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Quiet Hours</Text>
              <Text style={styles.infoDescription}>
                Notifications are automatically muted between 10 PM and 8 AM to respect your sleep schedule.
              </Text>
            </View>
          </View>
        </GlassCard>

        <View style={{ height: 100 }} />
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  settingCard: {
    marginBottom: 8,
    padding: 18,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.glass.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: Colors.text.primary,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
  infoCard: {
    marginHorizontal: 20,
    padding: 18,
    marginBottom: 24,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    color: Colors.text.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
});