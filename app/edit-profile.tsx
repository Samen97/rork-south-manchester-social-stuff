import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { GradientBackground } from '@/components/GradientBackground';
import { GlassCard } from '@/components/GlassCard';
import { Avatar } from '@/components/Avatar';
import { Colors } from '@/constants/colors';
import { ArrowLeft, Camera, Save } from 'lucide-react-native';

export default function EditProfileScreen() {
  const [name, setName] = useState<string>('David Chen');
  const [location, setLocation] = useState<string>('Chorlton, Manchester');
  const [bio, setBio] = useState<string>('Love connecting with locals! Always up for a good chat over coffee ☕');
  const [email, setEmail] = useState<string>('david.chen@email.com');
  const [phone, setPhone] = useState<string>('+44 7123 456789');

  const handleSave = () => {
    console.log('Saving profile:', { name, location, bio, email, phone });
    Alert.alert('Success', 'Profile updated successfully!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const handleChangePhoto = () => {
    Alert.alert(
      'Change Photo',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => console.log('Open camera') },
        { text: 'Photo Library', onPress: () => console.log('Open photo library') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <GradientBackground>
      <Stack.Screen 
        options={{
          title: 'Edit Profile',
          headerStyle: { backgroundColor: 'transparent' },
          headerTintColor: Colors.text.primary,
          headerTitleStyle: { fontWeight: '700' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft color={Colors.text.primary} size={24} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Save color={Colors.primary} size={24} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <GlassCard style={styles.photoCard}>
          <View style={styles.photoSection}>
            <View style={styles.avatarContainer}>
              <Avatar 
                uri="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" 
                size={100} 
                showOnline={false}
              />
              <TouchableOpacity style={styles.cameraButton} onPress={handleChangePhoto}>
                <Camera color={Colors.text.light} size={16} />
              </TouchableOpacity>
            </View>
            <Text style={styles.changePhotoText}>Tap to change photo</Text>
          </View>
        </GlassCard>

        <GlassCard style={styles.formCard}>
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                placeholderTextColor={Colors.text.secondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Location</Text>
              <TextInput
                style={styles.textInput}
                value={location}
                onChangeText={setLocation}
                placeholder="Enter your location"
                placeholderTextColor={Colors.text.secondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Bio</Text>
              <TextInput
                style={[styles.textInput, styles.bioInput]}
                value={bio}
                onChangeText={setBio}
                placeholder="Tell us about yourself..."
                placeholderTextColor={Colors.text.secondary}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>
        </GlassCard>

        <GlassCard style={styles.formCard}>
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={Colors.text.secondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone</Text>
              <TextInput
                style={styles.textInput}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone number"
                placeholderTextColor={Colors.text.secondary}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </GlassCard>

        <TouchableOpacity style={styles.saveButtonLarge} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>

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
  saveButton: {
    padding: 8,
    marginRight: -8,
  },
  photoCard: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    padding: 24,
  },
  photoSection: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.background,
  },
  changePhotoText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  formCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 24,
  },
  formSection: {
    gap: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  textInput: {
    backgroundColor: Colors.glass.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.glass.border,
  },
  bioInput: {
    minHeight: 80,
    paddingTop: 16,
  },
  saveButtonLarge: {
    backgroundColor: Colors.primary,
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: Colors.text.light,
    fontSize: 18,
    fontWeight: '700',
  },
});