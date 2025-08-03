import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  gradient?: boolean;
}

export function GlassCard({ children, style, gradient = true }: GlassCardProps) {
  if (gradient) {
    return (
      <LinearGradient
        colors={Colors.gradients.card}
        style={[styles.card, style]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.card, { backgroundColor: Colors.glass.background }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    shadowColor: Colors.glass.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
});