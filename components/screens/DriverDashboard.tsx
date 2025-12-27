import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomNav from '../common/BottomNav';
import RideCard from '../common/RideCard';
import StatsCard from '../common/StatsCard';
import ActiveRideBanner from '../common/ActiveRideBanner';
import { useApp } from '../../contexts/AppContext';
import type { RideRequest } from '../../lib/types';
import { NavigationProp } from '../../lib/navigation';

export default function DriverDashboard() {
  const navigation = useNavigation<NavigationProp<'DriverNavigation'>>();
  const { activeRide, setActiveRide } = useApp();
  const insets = useSafeAreaInsets();

  const rideRequests: RideRequest[] = [
    {
      id: 1,
      type: 'voyage',
      from: 'Dakar, Plateau',
      to: 'Saint-Louis, Centre-ville',
      price: '15 000 F',
      customer: 'Amadou Diallo',
      date: '10 Nov 2025',
      time: '14:00',
      seats: 2
    },
    {
      id: 2,
      type: 'colis',
      from: 'Thiès',
      to: 'Kaolack',
      price: '8 500 F',
      customer: 'Fatou Seck',
      date: '10 Nov 2025',
      weight: '5 kg'
    },
    {
      id: 3,
      type: 'voyage',
      from: 'Mbour',
      to: 'Ziguinchor',
      price: '22 000 F',
      customer: 'Ibrahima Fall',
      date: '11 Nov 2025',
      time: '08:00',
      seats: 3
    }
  ];

  const handleAcceptRide = (id: number) => {
    const acceptedRide = rideRequests.find(r => r.id === id);
    if (acceptedRide) {
      setActiveRide({
        id: acceptedRide.id.toString(),
        type: acceptedRide.type,
        status: 'accepted' as 'accepted' | 'in_progress',
        data: acceptedRide
      });
    }
    navigation.navigate('DriverNavigation' as any);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top + 8, 24) }]}>
        <View style={styles.headerContent}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>MN</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Mode Chauffeur</Text>
            <Text style={styles.headerSubtitle}>Bienvenue, Moussa</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <StatsCard label="Courses du jour" value="3" variant="dark" />
            <StatsCard label="Gains du jour" value="27 500 F" variant="dark" />
          </View>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {activeRide && activeRide.status !== 'waiting' && (
          <View style={styles.bannerContainer}>
            <ActiveRideBanner
              type={activeRide.type}
              status={activeRide.status as 'accepted' | 'in_progress'}
            />
          </View>
        )}

        <Text style={styles.sectionTitle}>Demandes de courses</Text>

        <View style={styles.ridesContainer}>
          {rideRequests.map((request) => (
            <RideCard
              key={request.id}
              request={request}
              onAccept={handleAcceptRide}
            />
          ))}
        </View>
      </ScrollView>

      <BottomNav userType="driver" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#1f2937',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    backgroundColor: '#facc15',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 2,
  },
  statsContainer: {
    marginTop: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding:24,
    paddingBottom: 100,
  },
  bannerContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  ridesContainer: {
    gap: 16,
  },
});