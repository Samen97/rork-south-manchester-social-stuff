import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { Plus } from 'lucide-react-native';

interface FloatingButtonProps {
  onPress: () => void;
  style?: ViewStyle;
}

export function FloatingButton({ onPress, style }: FloatingButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]} activeOpacity={0.8}>
      <LinearGradient
        colors={Colors.gradients.button}
        style={styles.button}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Plus color={Colors.text.light} size={24} strokeWidth={2} />
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    borderRadius: 28,
    overflow: 'hidden',
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
  },
});