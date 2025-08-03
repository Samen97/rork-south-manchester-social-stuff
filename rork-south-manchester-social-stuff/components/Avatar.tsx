import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '@/constants/colors';

interface AvatarProps {
  uri: string;
  size?: number;
  style?: ViewStyle;
  showOnline?: boolean;
}

export function Avatar({ uri, size = 40, style, showOnline = false }: AvatarProps) {
  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Image
        source={{ uri }}
        style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
        contentFit="cover"
      />
      {showOnline && <View style={styles.onlineIndicator} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderWidth: 0,
  },
  image: {
    borderWidth: 0,
  },

  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00FF88',
    borderWidth: 2,
    borderColor: Colors.background.primary,
  },
});