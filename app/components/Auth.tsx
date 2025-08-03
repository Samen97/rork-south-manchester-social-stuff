import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { GradientBackground } from '@/components/GradientBackground';
import { GlassCard } from '@/components/GlassCard';
import { Colors } from '@/constants/colors';
import { supabase } from '@/config/supabase';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  return (
    <GradientBackground>
      <View style={styles.container}>
        <Text style={styles.header}>South Manchester Social</Text>
        <Text style={styles.description}>Sign in or create an account to get started.</Text>
        <GlassCard style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={Colors.text.muted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={Colors.text.muted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={signInWithEmail}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonOutline, loading && styles.buttonDisabled]}
            onPress={signUpWithEmail}
            disabled={loading}
          >
            <Text style={[styles.buttonText, styles.buttonOutlineText]}>Sign Up</Text>
          </TouchableOpacity>
        </GlassCard>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 32,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    padding: 24,
  },
  input: {
    backgroundColor: Colors.glass.background,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    color: Colors.text.primary,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: Colors.text.light,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  buttonOutlineText: {
    color: Colors.primary,
  },
}); 