import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { router, Stack } from 'expo-router';
import { GradientBackground } from '@/components/GradientBackground';
import { GlassCard } from '@/components/GlassCard';
import { Colors } from '@/constants/colors';
import { 
  Moon, 
  Sun, 
  Globe, 
  MapPin, 
  Smartphone, 
  HelpCircle, 
  FileText, 
  Star, 
  LogOut, 
  ArrowLeft, 
  ChevronRight,
  Trash2
} from 'lucide-react-native';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [locationServices, setLocationServices] = useState(true);
  const [autoSync, setAutoSync] = useState(true);

  const appearanceSettings = [
    {
      title: 'Dark Mode',
      description: 'Switch between light and dark themes',
      icon: darkMode ? Moon : Sun,
      value: darkMode,
      onToggle: setDarkMode,
    },
  ];

  const dataSettings = [
    {
      title: 'Location Services',
      description: 'Allow app to access your location',
      icon: MapPin,
      value: locationServices,
      onToggle: setLocationServices,
    },
    {
      title: 'Auto Sync',
      description: 'Automatically sync data when connected',
      icon: Smartphone,
      value: autoSync,
      onToggle: setAutoSync,
    },
  ];

  const supportActions = [
    {
      title: 'Help & Support',
      description: 'Get help with using the app',
      icon: HelpCircle,
      action: () => Alert.alert('Help & Support', 'Contact our support team at help@southmanchestersocial.com'),
    },
    {
      title: 'Terms of Service',
      description: 'Read our terms and conditions',
      icon: FileText,
      action: () => Alert.alert('Terms of Service', 'View our complete terms of service and user agreement.'),
    },
    {
      title: 'Privacy Policy',
      description: 'Learn how we protect your data',
      icon: FileText,
      action: () => Alert.alert('Privacy Policy', 'Read our privacy policy to understand how we handle your data.'),
    },
    {
      title: 'Rate the App',
      description: 'Leave a review on the App Store',
      icon: Star,
      action: () => Alert.alert('Rate the App', 'Thank you for using South Manchester Social! Please rate us on the App Store.'),
    },
  ];

  const accountActions = [
    {
      title: 'Delete Account',
      description: 'Permanently delete your account and data',
      icon: Trash2,
      action: () => Alert.alert(
        'Delete Account',
        'Are you sure you want to delete your account? This action cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive' }
        ]
      ),
      destructive: true,
    },
    {
      title: 'Sign Out',
      description: 'Sign out of your account',
      icon: LogOut,
      action: () => Alert.alert(
        'Sign Out',
        'Are you sure you want to sign out?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign Out', style: 'destructive' }
        ]
      ),
      destructive: true,
    },
  ];

  return (
    <GradientBackground>
      <Stack.Screen 
        options={{
          title: 'Settings',
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
          <Text style={styles.sectionTitle}>Appearance</Text>
          <Text style={styles.sectionDescription}>
            Customize how the app looks and feels
          </Text>
          
          {appearanceSettings.map((item, index) => (
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
          <Text style={styles.sectionTitle}>Data & Storage</Text>
          <Text style={styles.sectionDescription}>
            Manage how the app uses your data and device features
          </Text>
          
          {dataSettings.map((item, index) => (
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
          <Text style={styles.sectionTitle}>Support</Text>
          <Text style={styles.sectionDescription}>
            Get help and learn more about the app
          </Text>
          
          {supportActions.map((item, index) => (
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <Text style={styles.sectionDescription}>
            Manage your account and data
          </Text>
          
          {accountActions.map((item, index) => (
            <TouchableOpacity key={index} onPress={item.action}>
              <GlassCard style={styles.actionCard}>
                <View style={styles.actionContent}>
                  <View style={styles.actionLeft}>
                    <View style={[styles.actionIcon, item.destructive && styles.destructiveIcon]}>
                      <item.icon 
                        color={item.destructive ? '#FF4444' : Colors.primary} 
                        size={20} 
                      />
                    </View>
                    <View style={styles.actionText}>
                      <Text style={[
                        styles.actionTitle, 
                        item.destructive && styles.destructiveText
                      ]}>
                        {item.title}
                      </Text>
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
            <Globe color={Colors.primary} size={24} />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>App Version</Text>
              <Text style={styles.infoDescription}>
                South Manchester Social v1.0.0{'\n'}
                Built with love for the Manchester community
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
  destructiveIcon: {
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
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
  destructiveText: {
    color: '#FF4444',
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