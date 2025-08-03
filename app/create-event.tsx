import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Alert, ActivityIndicator, Modal } from 'react-native';
import { router, Stack } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { GradientBackground } from '@/components/GradientBackground';
import { GlassCard } from '@/components/GlassCard';
import { Colors } from '@/constants/colors';
import { Event } from '@/types';
import { ArrowLeft, Calendar, MapPin, Clock, Users, Camera, ImageIcon, Sparkles, X } from 'lucide-react-native';
import { FAL_API_URL, OPENROUTER_API_URL, FAL_API_KEY, OPENROUTER_API_KEY } from '@/config/api';
import useAppStore from '@/store/appStore';

export default function CreateEventScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [location, setLocation] = useState('');
  const [maxAttendees, setMaxAttendees] = useState('');
  const [eventImage, setEventImage] = useState<string | null>(null);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isRefiningTitle, setIsRefiningTitle] = useState(false);
  const [isRefiningDescription, setIsRefiningDescription] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const addEvent = useAppStore(state => state.addEvent);

  const handleBack = () => {
    router.back();
  };

  const validateForm = () => {
    if (!title.trim() || !description.trim() || !location.trim() || !eventImage) {
      setFormError('Please fill out all fields and add an event photo.');
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleCreate = () => {
    if (!validateForm()) {
      return;
    }

    const startDateTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      selectedTime.getHours(),
      selectedTime.getMinutes()
    ).toISOString();

    const endDateTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      selectedTime.getHours() + 2, // Default 2 hour duration
      selectedTime.getMinutes()
    ).toISOString();

    addEvent({
      title: title.trim(),
      description: description.trim() || 'Join us for this exciting event!',
      date: formatDate(selectedDate),
      time: `${formatTime(selectedTime)} - ${location}`,
      location: location.trim(),
      image: eventImage || '',
      attendees: [],
      maxAttendees: maxAttendees ? parseInt(maxAttendees) : undefined,
      host: { id: '1', name: 'You', avatar: '' }, // Placeholder for current user
      category: 'Social',
      isAttending: true,
      startDateTime,
      endDateTime,
    });
    
    Alert.alert(
      'Event Created! 🎉', 
      `"${title}" has been created successfully.`,
      [
        {
          text: 'View Event',
          onPress: () => {
            router.replace(`/event/0`); // Navigate to a placeholder, ideally we would get the new id back
          }
        },
        {
          text: 'Go Home',
          onPress: () => {
            router.replace('/(tabs)');
          }
        }
      ]
    );
  };

  const onDateChange = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
    }
  };

  const onTimeChange = (event: any, time?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (time) {
      setSelectedTime(time);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const pickImageFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access your photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setEventImage(result.assets[0].uri);
      setShowImageOptions(false);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access your camera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setEventImage(result.assets[0].uri);
      setShowImageOptions(false);
    }
  };

  const generateImageWithAI = async () => {
    if (!title.trim()) {
      Alert.alert('Event Title Required', 'Please enter an event title first to generate an image.');
      return;
    }

    setIsGeneratingImage(true);
    setShowImageOptions(false);

    try {
      const prompt = `A vibrant, eye-catching, high-quality photograph for a social event titled "${title}". ${description ? `The event is about: ${description}.` : ''} ${location ? `It's happening in ${location}.` : ''} The image should be modern, engaging, and relevant to the event's theme. Avoid text overlays.`;
      
      const response = await fetch(FAL_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Key ${FAL_API_KEY}`
        },
        body: JSON.stringify({
          prompt,
          image_size: "square_hd"
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      const imageUri = `data:${data.image.mimeType};base64,${data.image.base64Data}`;
      setEventImage(imageUri);
    } catch (error) {
      console.error('Error generating image:', error);
      Alert.alert('Image Generation Failed', 'There was an error while generating the event image. Please check your connection and try again.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const refineTitle = async () => {
    if (!title.trim()) {
      Alert.alert('Title Required', 'Please enter a title first to refine it.');
      return;
    }

    setIsRefiningTitle(true);

    try {
      const contextInfo = [
        title,
        location && `Location: ${location}`,
        `Date: ${formatDate(selectedDate)}`,
        `Time: ${formatTime(selectedTime)}`,
        description && `Description: ${description}`
      ].filter(Boolean).join('. ');

      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [
            {
              role: 'system',
              content: 'You are a creative copywriter for an events app. Your task is to refine event titles to be catchy, engaging, and concise. Keep the core meaning, but make it more appealing. Return only the refined title.'
            },
            {
              role: 'user',
              content: `Refine this event title: "${title}". For context, the event is about: ${description || 'not specified'}, and it's happening at ${location || 'not specified'}.`
            }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refine title');
      }

      const data = await response.json();
      setTitle(data.completion.trim());
    } catch (error) {
      console.error('Error refining title:', error);
      Alert.alert('Title Refinement Failed', 'There was an error while refining the event title. Please check your connection and try again.');
    } finally {
      setIsRefiningTitle(false);
    }
  };

  const refineDescription = async () => {
    const contextInfo = [
      title && `Event: ${title}`,
      location && `Location: ${location}`,
      `Date: ${formatDate(selectedDate)}`,
      `Time: ${formatTime(selectedTime)}`,
      maxAttendees && `Max attendees: ${maxAttendees}`
    ].filter(Boolean).join('. ');

    if (!contextInfo.trim()) {
      Alert.alert('Context Required', 'Please fill in at least the event title to generate a description.');
      return;
    }

    setIsRefiningDescription(true);

    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [
            {
              role: 'system',
              content: 'You are a creative copywriter for an events app. Your task is to write compelling, friendly, and informative event descriptions. The description should be easy to read and make people want to attend. Highlight the key activities and the general vibe of the event. Return only the refined description.'
            },
            {
              role: 'user',
              content: `Write a compelling description for an event titled "${title}". The event is happening at ${location} on ${formatDate(selectedDate)} at ${formatTime(selectedTime)}. ${description ? `Here's the current description to improve: "${description}"` : 'There is no description yet.'} ${maxAttendees ? `There is a limit of ${maxAttendees} attendees.` : ''}`
            }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refine description');
      }

      const data = await response.json();
      setDescription(data.completion.trim());
    } catch (error) {
      console.error('Error refining description:', error);
      Alert.alert('Description Refinement Failed', 'There was an error while refining the event description. Please check your connection and try again.');
    } finally {
      setIsRefiningDescription(false);
    }
  };

  return (
    <GradientBackground>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowLeft color={Colors.text.primary} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Event</Text>
          <TouchableOpacity onPress={handleCreate} style={styles.createButton}>
            <Text style={styles.createButtonText}>Create</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {formError && (
            <GlassCard style={styles.errorCard}>
              <Text style={styles.errorText}>{formError}</Text>
            </GlassCard>
          )}

          <GlassCard style={styles.imageCard}>
            {eventImage ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: eventImage }} style={styles.eventImage} />
                <TouchableOpacity 
                  style={styles.changeImageButton}
                  onPress={() => setShowImageOptions(true)}
                >
                  <Camera color={Colors.text.light} size={16} />
                  <Text style={styles.changeImageText}>Change</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.imageUpload}
                onPress={() => setShowImageOptions(true)}
              >
                <Camera color={Colors.primary} size={32} />
                <Text style={styles.imageText}>Add Event Photo</Text>
              </TouchableOpacity>
            )}
          </GlassCard>

          <GlassCard style={styles.formCard}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Event Title</Text>
              <TouchableOpacity 
                style={styles.aiButton}
                onPress={refineTitle}
                disabled={isRefiningTitle}
              >
                {isRefiningTitle ? (
                  <ActivityIndicator size="small" color={Colors.primary} />
                ) : (
                  <>
                    <Sparkles color={Colors.primary} size={14} />
                    <Text style={styles.aiButtonText}>Refine</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="What's the event called?"
              placeholderTextColor={Colors.text.muted}
              value={title}
              onChangeText={setTitle}
            />
          </GlassCard>

          <GlassCard style={styles.formCard}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Description</Text>
              <TouchableOpacity 
                style={styles.aiButton}
                onPress={refineDescription}
                disabled={isRefiningDescription}
              >
                {isRefiningDescription ? (
                  <ActivityIndicator size="small" color={Colors.primary} />
                ) : (
                  <>
                    <Sparkles color={Colors.primary} size={14} />
                    <Text style={styles.aiButtonText}>Refine</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell people what to expect..."
              placeholderTextColor={Colors.text.muted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />
          </GlassCard>

          <View style={styles.row}>
            <GlassCard style={styles.halfCard}>
              <View style={styles.labelRow}>
                <Calendar color={Colors.primary} size={20} />
                <Text style={styles.label}>Date</Text>
              </View>
              <TouchableOpacity 
                style={styles.dateTimeButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateTimeText}>
                  {formatDate(selectedDate)}
                </Text>
              </TouchableOpacity>
            </GlassCard>

            <GlassCard style={styles.halfCard}>
              <View style={styles.labelRow}>
                <Clock color={Colors.secondary} size={20} />
                <Text style={styles.label}>Time</Text>
              </View>
              <TouchableOpacity 
                style={styles.dateTimeButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={styles.dateTimeText}>
                  {formatTime(selectedTime)}
                </Text>
              </TouchableOpacity>
            </GlassCard>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              minimumDate={new Date()}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={selectedTime}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onTimeChange}
            />
          )}

          <GlassCard style={styles.formCard}>
            <View style={styles.labelRow}>
              <MapPin color={Colors.accent} size={20} />
              <Text style={styles.label}>Location</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Where is it happening?"
              placeholderTextColor={Colors.text.muted}
              value={location}
              onChangeText={setLocation}
            />
          </GlassCard>

          <GlassCard style={styles.formCard}>
            <View style={styles.labelRow}>
              <Users color={Colors.primary} size={20} />
              <Text style={styles.label}>Max Attendees</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="How many people can join?"
              placeholderTextColor={Colors.text.muted}
              value={maxAttendees}
              onChangeText={setMaxAttendees}
              keyboardType="numeric"
            />
          </GlassCard>

          <Text style={styles.aiHint}>💡 AI Tip: Try &quot;Board game night at my place this Friday 7pm&quot; and I&apos;ll fill in the details!</Text>

          <View style={{ height: 100 }} />
        </ScrollView>

        <Modal
          visible={showImageOptions}
          transparent
          animationType="fade"
          onRequestClose={() => setShowImageOptions(false)}
        >
          <View style={styles.modalOverlay}>
            <GlassCard style={styles.imageOptionsModal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Event Photo</Text>
                <TouchableOpacity 
                  onPress={() => setShowImageOptions(false)}
                  style={styles.closeButton}
                >
                  <X color={Colors.text.secondary} size={20} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.imageOptions}>
                <TouchableOpacity 
                  style={styles.imageOption}
                  onPress={takePhoto}
                >
                  <Camera color={Colors.primary} size={24} />
                  <Text style={styles.imageOptionText}>Take Photo</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.imageOption}
                  onPress={pickImageFromLibrary}
                >
                  <ImageIcon color={Colors.secondary} size={24} />
                  <Text style={styles.imageOptionText}>Choose from Library</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.imageOption, isGeneratingImage && styles.imageOptionDisabled]}
                  onPress={generateImageWithAI}
                  disabled={isGeneratingImage}
                >
                  {isGeneratingImage ? (
                    <ActivityIndicator size="small" color={Colors.accent} />
                  ) : (
                    <Sparkles color={Colors.accent} size={24} />
                  )}
                  <Text style={styles.imageOptionText}>
                    {isGeneratingImage ? 'Generating...' : 'Generate with AI'}
                  </Text>
                </TouchableOpacity>
              </View>
            </GlassCard>
          </View>
        </Modal>
      </View>
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
    paddingBottom: 20,
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
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  createButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  createButtonText: {
    color: Colors.text.light,
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  imageCard: {
    marginBottom: 20,
    padding: 20,
  },
  imageUpload: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  imageText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  formCard: {
    marginBottom: 16,
    padding: 20,
  },
  halfCard: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 12,
    gap: 8,
  },
  input: {
    fontSize: 16,
    color: Colors.text.primary,
    paddingVertical: 0,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  aiHint: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  dateTimeButton: {
    paddingVertical: 8,
  },
  dateTimeText: {
    fontSize: 16,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  imageContainer: {
    position: 'relative',
  },
  eventImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  changeImageButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeImageText: {
    color: Colors.text.light,
    fontSize: 12,
    fontWeight: '500',
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: Colors.glass.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.glass.border,
  },
  aiButtonText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  imageOptionsModal: {
    width: '100%',
    maxWidth: 320,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  closeButton: {
    padding: 4,
  },
  imageOptions: {
    gap: 16,
  },
  imageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.glass.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.glass.border,
  },
  imageOptionDisabled: {
    opacity: 0.6,
  },
  imageOptionText: {
    fontSize: 16,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  errorBorder: {
    borderColor: Colors.accent,
    borderWidth: 1,
  },
  errorText: {
    color: Colors.text.primary,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  errorCard: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    padding: 16,
    marginBottom: 20,
    borderRadius: 12,
  },
});