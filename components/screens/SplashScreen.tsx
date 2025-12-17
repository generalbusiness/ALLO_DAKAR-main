import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppLogo from '../common/AppLogo';
import { NavigationProp } from '../../lib/navigation';

export default function SplashScreen() {
  const navigation = useNavigation<NavigationProp<'Login'>>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
        >
          <AppLogo size="xl" />
        </Animated.View>

        {/* App Name */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <Text style={styles.appName}>Allô Dakar</Text>
        </Animated.View>

        {/* Tagline */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <Text style={styles.tagline}>
            Votre partenaire de voyage interurbain
          </Text>
        </Animated.View>

        {/* CTA Button */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            width: '100%',
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate('Login' as any)}
            style={styles.button}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Commencer</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
  },
  appName: {
    fontSize: 48,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  tagline: {
    fontSize: 20,
    color: '#d1d5db',
    textAlign: 'center',
  },
  button: {
    width: '100%',
    backgroundColor: '#facc15',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    marginTop: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
});
