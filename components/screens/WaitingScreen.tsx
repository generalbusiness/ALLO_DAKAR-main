import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../contexts/AppContext';
import { NavigationProp } from '../../lib/navigation';

export default function WaitingScreen() {
  const navigation = useNavigation<NavigationProp<'Waiting'>>();
  const { activeBooking, setActiveBooking } = useApp();
  const [showApproval, setShowApproval] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowApproval(true);
      if (activeBooking) {
        setActiveBooking({
          ...activeBooking,
          status: 'accepted'
        });
      }
      // Animation when approval shows
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleViewRide = () => {
    navigation.navigate('RideTracking' as any);
  };

  const handleCancelBooking = () => {
    Alert.alert(
      'Annuler la demande ?',
      'Êtes-vous sûr de vouloir annuler cette demande ? Cette action est irréversible.',
      [
        { text: 'Non, continuer', style: 'cancel' },
        {
          text: 'Oui, annuler',
          style: 'destructive',
          onPress: () => {
            setActiveBooking(null);
            navigation.navigate('ClientDashboard' as any);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {!showApproval ? (
          <>
            <ActivityIndicator size="large" color="#facc15" style={styles.loader} />

            <View style={styles.textContainer}>
              <Text style={styles.title}>Merci de patienter...</Text>
              <Text style={styles.description}>
                Votre demande est en cours de traitement. Un de nos chauffeurs va approuver votre demande.
              </Text>
            </View>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate('ClientDashboard' as any)}
                style={styles.backButton}
              >
                <Text style={styles.backButtonText}>Retour à l'accueil</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCancelBooking}
                style={styles.cancelButton}
              >
                <Ionicons name="close" size={20} color="#ffffff" />
                <Text style={styles.cancelButtonText}>Annuler la demande</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Animated.View
            style={[
              styles.approvedContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              }
            ]}
          >
            <Animated.View
              style={[
                styles.checkIcon,
                {
                  transform: [{ scale: scaleAnim }],
                }
              ]}
            >
              <Ionicons name="checkmark" size={32} color="#ffffff" />
            </Animated.View>

            <View style={styles.textContainer}>
              <Text style={styles.approvedTitle}>Réservation approuvée !</Text>
              <Text style={styles.approvedDescription}>
                Un chauffeur a accepté votre demande. Vous pouvez maintenant suivre votre course.
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleViewRide}
              style={styles.viewButton}
              activeOpacity={0.8}
            >
              <Text style={styles.viewButtonText}>Cliquez pour voir</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
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
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  loader: {
    marginBottom: 32,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 32,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
  },
  backButton: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  cancelButton: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#dc2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  approvedContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    width: '100%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#22c55e',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    gap: 24,
  },
  checkIcon: {
    width: 64,
    height: 64,
    backgroundColor: '#22c55e',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  approvedTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  approvedDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  viewButton: {
    width: '100%',
    backgroundColor: '#facc15',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  viewButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
});
