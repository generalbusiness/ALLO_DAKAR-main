import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../contexts/AppContext';
import { PinInput } from '../PinInput';
import { NavigationProp } from '../../lib/navigation';

export default function PinCodeSetup() {
  const navigation = useNavigation<NavigationProp<'PinCodeSetup'>>();
  const { setPinCode } = useApp();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<'create' | 'confirm'>('create');
  const [firstPin, setFirstPin] = useState('');
  const [error, setError] = useState(false);

  const handleFirstPinComplete = (pin: string) => {
    setFirstPin(pin);
    setError(false);
    setTimeout(() => {
      setStep('confirm');
    }, 300);
  };

  const handleConfirmPinComplete = (pin: string) => {
    if (pin === firstPin) {
      setPinCode(pin);
      Alert.alert('Succès', 'Code PIN créé avec succès', [
        {
          text: 'OK',
          onPress: () => {
            // Redirect immediately after PIN is set
            navigation.reset({
              index: 0,
              routes: [{ name: 'Wallet' as any }],
            });
          }
        }
      ]);
    } else {
      setError(true);
      Alert.alert('Erreur', 'Les codes PIN ne correspondent pas');
      setTimeout(() => {
        setError(false);
        setStep('create');
        setFirstPin('');
      }, 1000);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header - Fixe en dehors du ScrollView */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top + 8, 24) }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                navigation.navigate('Wallet' as any);
              }
            }}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Sécuriser mon Wallet</Text>
            <Text style={styles.headerSubtitle}>Créer un code PIN</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Security Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Ionicons
                name={step === 'create' ? 'lock-closed' : 'shield-checkmark'}
                size={40}
                color="#facc15"
              />
            </View>
          </View>

          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              {step === 'create' ? 'Créer un code PIN' : 'Confirmer le code PIN'}
            </Text>
            <Text style={styles.subtitle}>
              {step === 'create'
                ? 'Choisissez un code à 4 chiffres pour sécuriser votre wallet'
                : 'Saisissez à nouveau votre code PIN'
              }
            </Text>
          </View>

          {/* PIN Input */}
          <View style={styles.pinContainer}>
            <PinInput
              key={step} // Force re-render when step changes
              onComplete={step === 'create' ? handleFirstPinComplete : handleConfirmPinComplete}
              error={error}
            />
          </View>

          {/* Security Info */}
          <View style={styles.infoCard}>
            <View style={styles.infoContent}>
              <Ionicons name="shield-checkmark" size={20} color="#2563eb" style={styles.infoIcon} />
              <View style={styles.infoText}>
                <Text style={styles.infoTitle}>Pourquoi un code PIN ?</Text>
                <Text style={styles.infoDescription}>
                  Votre code PIN protège votre wallet. Il sera demandé à chaque accès et transaction pour garantir la sécurité de vos fonds.
                </Text>
              </View>
            </View>
          </View>

          {/* Tips */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>Conseils de sécurité :</Text>
            <View style={styles.tipsList}>
              <View style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>Choisissez un code unique et facile à mémoriser</Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>Ne partagez jamais votre code PIN</Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>Évitez les séquences simples (1234, 0000, etc.)</Text>
              </View>
            </View>
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
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
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
    paddingVertical: 32,
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
  pinContainer: {
    marginBottom: 32,
  },
  infoCard: {
    backgroundColor: '#dbeafe',
    borderWidth: 1,
    borderColor: '#93c5fd',
    borderRadius: 8,
    padding: 16,
  },
  infoContent: {
    flexDirection: 'row',
    gap: 12,
  },
  infoIcon: {
    marginTop: 2,
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 14,
    color: '#1e3a8a',
    lineHeight: 20,
  },
  tipsContainer: {
    marginTop: 24,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 8,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  tipBullet: {
    fontSize: 14,
    color: '#facc15',
    marginTop: 2,
  },
  tipText: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
});
