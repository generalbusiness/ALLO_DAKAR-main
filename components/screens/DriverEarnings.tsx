import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from '../common/BottomNav';
import { NavigationProp } from '../../lib/navigation';

export default function DriverEarnings() {
  const navigation = useNavigation<NavigationProp<'DriverEarnings'>>();
  const insets = useSafeAreaInsets();

  const earningsHistory = [
    { date: '10 Nov 2025', trips: 3, amount: '27 500 F' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 24) }]}>
        <Text style={styles.headerTitle}>Mes Gains</Text>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Solde actuel</Text>
          <Text style={styles.balanceAmount}>123 000 F</Text>
          <View style={styles.balanceButtons}>
            <TouchableOpacity style={styles.withdrawButton}>
              <Text style={styles.withdrawButtonText}>Retirer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.depositButton}>
              <Text style={styles.depositButtonText}>Déposer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Summary Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Ionicons name="calendar" size={20} color="#facc15" />
              <Text style={styles.statLabel}>Aujourd'hui</Text>
            </View>
            <Text style={styles.statValue}>27 500 F</Text>
            <Text style={styles.statSubtext}>3 courses</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Ionicons name="trending-up" size={20} color="#22c55e" />
              <Text style={styles.statLabel}>Cette semaine</Text>
            </View>
            <Text style={styles.statValue}>123 000 F</Text>
            <Text style={styles.statSubtext}>14 courses</Text>
          </View>
        </View>

        {/* Earnings History */}
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Historique</Text>

          {earningsHistory.map((day, index) => (
            <View key={index} style={styles.historyCard}>
              <View style={styles.historyContent}>
                <View>
                  <Text style={styles.historyDate}>{day.date}</Text>
                  <Text style={styles.historyTrips}>
                    {day.trips} course{day.trips > 1 ? 's' : ''}
                  </Text>
                </View>
                <Text style={styles.historyAmount}>{day.amount}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Monthly Summary */}
        <View style={styles.monthlyCard}>
          <Text style={styles.monthlyTitle}>Résumé du mois</Text>
          <View style={styles.monthlyList}>
            <View style={styles.monthlyRow}>
              <Text style={styles.monthlyLabel}>Total des courses</Text>
              <Text style={styles.monthlyValue}>42 courses</Text>
            </View>
            <View style={styles.monthlyRow}>
              <Text style={styles.monthlyLabel}>Distance parcourue</Text>
              <Text style={styles.monthlyValue}>2 450 km</Text>
            </View>
            <View style={styles.monthlyRow}>
              <Text style={styles.monthlyLabel}>Note moyenne</Text>
              <View style={styles.ratingRow}>
                <Text style={styles.monthlyValue}>4.8</Text>
                <Ionicons name="star" size={16} color="#facc15" />
              </View>
            </View>
            <View style={styles.monthlyDivider} />
            <View style={styles.monthlyRow}>
              <Text style={styles.monthlyTotalLabel}>Total gagné</Text>
              <Text style={styles.monthlyTotalValue}>456 000 F</Text>
            </View>
          </View>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 24,
  },
  balanceCard: {
    backgroundColor: '#facc15',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#1f2937',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 24,
  },
  balanceButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  withdrawButton: {
    flex: 1,
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  withdrawButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  depositButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  depositButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  statSubtext: {
    fontSize: 12,
    color: '#9ca3af',
  },
  historyContainer: {
    marginBottom: 24,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  historyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  historyContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyDate: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  historyTrips: {
    fontSize: 14,
    color: '#6b7280',
  },
  historyAmount: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  monthlyCard: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 20,
  },
  monthlyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  monthlyList: {
    gap: 12,
  },
  monthlyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthlyLabel: {
    fontSize: 14,
    color: '#9ca3af',
  },
  monthlyValue: {
    fontSize: 14,
    color: '#ffffff',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  monthlyDivider: {
    borderTopWidth: 1,
    borderTopColor: '#374151',
    marginTop: 12,
    paddingTop: 12,
  },
  monthlyTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#facc15',
  },
  monthlyTotalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#facc15',
  },
});
