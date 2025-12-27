import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../contexts/AppContext';
import { PinInput } from '../PinInput';
import { NavigationProp } from '../../lib/navigation';

export default function PinCodeVerification() {
  const navigation = useNavigation<NavigationProp<'PinCodeVerification'>>();
  const route = useRoute();
  const { verifyPinCode } = useApp();
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const from = (route.params as any)?.from || 'Wallet';

  const handlePinComplete = (pin: string) => {
    if (verifyPinCode(pin)) {
      Alert.alert('Succès', 'Code PIN correct');
      setTimeout(() => {
        navigation.navigate(from as any);
      }, 300);
    } else {
      setError(true);
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      Alert.alert('Erreur', 'Code PIN incorrect');

      if (newAttempts >= 3) {
        Alert.alert('Erreur', 'Trop de tentatives incorrectes');
        setTimeout(() => {
          navigation.navigate('ClientDashboard' as any);
        }, 1500);
      } else {
        setTimeout(() => {
          setError(false);
        }, 1000);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={20} color="#1f2937" />
            </TouchableOpacity>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Vérification</Text>
              <Text style={styles.headerSubtitle}>Saisir le code PIN</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {/* Lock Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Ionicons name="lock-closed" size={40} color="#facc15" />
            </View>
          </View>

          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Entrez votre code PIN</Text>
            <Text style={styles.subtitle}>Pour accéder à votre wallet</Text>
            {attempts > 0 && (
              <Text style={styles.attemptsText}>
                Tentative {attempts}/3
              </Text>
            )}
          </View>

          {/* PIN Input */}
          <View style={styles.pinContainer}>
            <PinInput
              onComplete={handlePinComplete}
              error={error}
              disabled={attempts >= 3}
            />
          </View>

          {/* Forgot PIN */}
          <View style={styles.forgotContainer}>
            <TouchableOpacity>
              <Text style={styles.forgotText}>Code PIN oublié ?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 48,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 80,
    height: 80,
    backgroundColor: '#fefce8',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  attemptsText: {
    fontSize: 14,
    color: '#dc2626',
    marginTop: 8,
  },
  pinContainer: {
    marginBottom: 32,
  },
  forgotContainer: {
    alignItems: 'center',
  },
  forgotText: {
    fontSize: 14,
    color: '#facc15',
    fontWeight: '500',
  },
});
