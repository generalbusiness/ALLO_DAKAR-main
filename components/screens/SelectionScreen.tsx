import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AppLogo from '../common/AppLogo';
import { NavigationProp } from '../../lib/navigation';

export default function SelectionScreen() {
  const navigation = useNavigation<NavigationProp<'Selection'>>();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <AppLogo size="xl" />
        </View>

        <Text style={styles.title}>Rejoignez-nous !</Text>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ClientRegistration' as any)}
            style={styles.optionCard}
          >
            <View style={styles.optionContent}>
              <View style={styles.optionIcon}>
                <Ionicons name="person" size={28} color="#1f2937" />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Je suis Client</Text>
                <Text style={styles.optionDescription}>Réserver un voyage ou envoyer un colis</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('DriverRegistration' as any)}
            style={styles.optionCard}
          >
            <View style={styles.optionContent}>
              <View style={[styles.optionIcon, styles.optionIconDriver]}>
                <Ionicons name="car" size={28} color="#facc15" />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Je suis Chauffeur</Text>
                <Text style={styles.optionDescription}>Gagner de l'argent en conduisant</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('Login' as any)}
          style={styles.loginLink}
        >
          <Text style={styles.loginLinkText}>Déjà inscrit ? Se connecter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    maxWidth: 400,
    width: '100%',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 48,
  },
  optionsContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 32,
  },
  optionCard: {
    width: '100%',
    padding: 24,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 16,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  optionIcon: {
    width: 56,
    height: 56,
    backgroundColor: '#facc15',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIconDriver: {
    backgroundColor: '#1f2937',
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  loginLink: {
    marginTop: 32,
  },
  loginLinkText: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
});
