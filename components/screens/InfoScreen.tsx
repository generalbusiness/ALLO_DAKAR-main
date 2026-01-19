import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppLogo from '../common/AppLogo';
import { NavigationProp } from '../../lib/navigation';

export default function InfoScreen() {
  const navigation = useNavigation<NavigationProp<'Info'>>();
  const insets = useSafeAreaInsets();

  const handlePhonePress = () => {
    Linking.openURL('tel:+221331234567');
  };

  const handleEmailPress = () => {
    Linking.openURL('mailto:contact@allodakar.sn');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>À Propos</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <AppLogo size="xl" />
          <Text style={styles.appName}>Allô Dakar</Text>
          <Text style={styles.appTagline}>Votre partenaire de voyage interurbain</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
        </View>

        {/* About Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>À propos d'Allô Dakar</Text>
          <Text style={styles.cardText}>
            Allô Dakar est une plateforme innovante qui révolutionne le transport interurbain au Sénégal.
            Nous connectons les passagers avec des chauffeurs vérifiés pour des trajets sûrs et confortables
            entre les différentes villes du pays.
          </Text>
          <Text style={[styles.cardText, styles.cardTextMargin]}>
            Notre service Yobanté permet également l'envoi rapide et sécurisé de colis à travers tout le Sénégal.
          </Text>
        </View>

        {/* Features Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nos Services</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <View style={styles.featureDot} />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Transport de passagers</Text>
                <Text style={styles.featureDescription}>Voyagez en toute sécurité entre les villes</Text>
              </View>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureDot} />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Livraison de colis (Yobanté)</Text>
                <Text style={styles.featureDescription}>Envoyez vos colis rapidement et en toute sécurité</Text>
              </View>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureDot} />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Chauffeurs vérifiés</Text>
                <Text style={styles.featureDescription}>Tous nos chauffeurs sont vérifiés et notés</Text>
              </View>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureDot} />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Paiement mobile</Text>
                <Text style={styles.featureDescription}>Wave, Orange Money, Yass disponibles</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Contact Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contactez-nous</Text>
          <View style={styles.contactList}>
            <TouchableOpacity
              onPress={handlePhonePress}
              style={styles.contactItem}
            >
              <View style={styles.contactIcon}>
                <Ionicons name="call" size={20} color="#facc15" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Téléphone</Text>
                <Text style={styles.contactValue}>+221 33 123 45 67</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleEmailPress}
              style={styles.contactItem}
            >
              <View style={styles.contactIcon}>
                <Ionicons name="mail" size={20} color="#facc15" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>contact@allodakar.sn</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.contactItem}>
              <View style={styles.contactIcon}>
                <Ionicons name="location" size={20} color="#facc15" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Adresse</Text>
                <Text style={styles.contactValue}>Dakar, Sénégal</Text>
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
  header: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 24,
    paddingBottom: 24,
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: '#9ca3af',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
  },
  cardTextMargin: {
    marginTop: 16,
  },
  featuresList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  featureDot: {
    width: 8,
    height: 8,
    backgroundColor: '#facc15',
    borderRadius: 4,
    marginTop: 8,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  contactList: {
    gap: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#fefce8',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
});
