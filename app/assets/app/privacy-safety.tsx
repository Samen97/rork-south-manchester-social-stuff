import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { router, Stack } from 'expo-router';
import { GradientBackground } from '@/components/GradientBackground';
import { GlassCard } from '@/components/GlassCard';
import { Colors } from '@/constants/colors';
import { Shield, Eye, EyeOff, Lock, UserX, AlertTriangle, ArrowLeft, ChevronRight } from 'lucide-react-native';

export default function PrivacySafetyScreen() {
  const [profileVisible, setProfileVisible] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [messageRequests, setMessageRequests] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const privacySettings = [
    {
      title: 'Profile Visibility',
      description: 'Allow others to find and view your profile',
      icon: profileVisible ? Eye : EyeOff,
      value: profileVisible,
      onToggle: setProfileVisible,
    },
    {
      title: 'Location Sharing',
      description: 'Share your location with nearby events',
      icon: Shield,
      value: locationSharing,
      onToggle: setLocationSharing,
    },
    {
      title: 'Message Requests',
      description: 'Allow messages from people you haven\'t connected with',
      icon: Shield,
      value: messageRequests,
      onToggle: setMessageRequests,
    },
  ];

  const securitySettings = [
    {
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security to your account',
      icon: Lock,
      value: twoFactorAuth,
      onToggle: setTwoFactorAuth,
    },
  ];

  const safetyActions = [
    {
      title: 'Block & Report',
      description: 'Manage blocked users and report issues',
      icon: UserX,
      action: () => Alert.alert('Block & Report', 'This feature helps you manage blocked users and report inappropriate behavior.'),
    },
    {
      title: 'Safety Tips',
      description: 'Learn how to stay safe while meeting new people',
      icon: AlertTriangle,
      action: () => Alert.alert('Safety Tips', 'Always meet in public places, trust your instincts, and let someone know where you\'re going.'),
    },
  ];

  return (
    <GradientBackground>
      <Stack.Screen 
        options={{
          title: 'Privacy & Safety',
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
          <Text style={styles.sectionTitle}>Privacy Settings</Text>
          <Text style={styles.sectionDescription}>
            Control who can see your information and interact with you
          </Text>
          
          {privacySettings.map((item, index) => (
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
          <Text style={styles.sectionTitle}>Security</Text>
          <Text style={styles.sectionDescription}>
            Keep your account secure with additional protection
          </Text>
          
          {securitySettings.map((item, index) => (
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
          <Text style={styles.sectionTitle}>Safety Tools</Text>
          <Text style={styles.sectionDescription}>
            Tools to help you stay safe and report issues
          </Text>
          
          {safetyActions.map((item, index) => (
            <TouchableOpacity key={index} onPress={item.action}>
              <GlassCard style={styles.actionCard}>
                <View style={styles.actionContent}>
                  <View style={styles.actionLeft}>
                    <View style={styles.actionIcon}>
                      <item.icon color={Colors.primary} size={20} />
                    </View>
                    <View style={styles.actionText}>
                      <Text style={styles.actionTitle}>{item.title}</Text>
                      <Text style={styles.actionDescription}>{item.description}</Text>
                    </View>
                  </View>
                  <ChevronRight color={Colors.text.secondary} size={16} />
                </View>
              </GlassCard>
            </TouchableOpacity>
          ))}
        </View>

        <GlassCard style={styles.infoCard}>
          <View style={styles.infoContent}>
            <Shield color={Colors.primary} size={24} />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Your Safety Matters</Text>
              <Text style={styles.infoDescription}>
                We take your safety seriously. All events are moderated, and we have zero tolerance for harassment or inappropriate behavior. Report any concerns immediately.
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
  actionCard: {
    marginBottom: 8,
    padding: 18,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.glass.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    color: Colors.text.primary,
    fontWeight: '500',
    marginBottom: 2,
  },
  actionDescription: {
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