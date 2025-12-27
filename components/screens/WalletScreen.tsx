import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../contexts/AppContext';
import { NavigationProp } from '../../lib/navigation';
// Note: Install expo-linear-gradient for gradient support: npm install expo-linear-gradient

export default function WalletScreen() {
  const navigation = useNavigation<NavigationProp<'Wallet'>>();
  const { walletData, transactions, user } = useApp();
  const [showBalance, setShowBalance] = useState(true);
  const insets = useSafeAreaInsets();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Aujourd'hui";
    } else if (diffDays === 1) {
      return "Hier";
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jours`;
    } else {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'arrow-down';
      case 'withdraw':
        return 'arrow-up';
      case 'transfer_in':
        return 'add';
      case 'transfer_out':
        return 'remove';
      case 'payment':
        return 'remove';
      case 'earning':
        return 'add';
      default:
        return 'swap-horizontal';
    }
  };

  const getTransactionColor = (type: string) => {
    if (['deposit', 'transfer_in', 'earning'].includes(type)) {
      return '#16a34a';
    }
    return '#dc2626';
  };

  const getTransactionSign = (type: string) => {
    if (['deposit', 'transfer_in', 'earning'].includes(type)) {
      return '+';
    }
    return '-';
  };

  const recentTransactions = transactions.slice(0, 5);

  return (
    <View style={styles.container}>
      {/* Header with gradient background */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top + 8, 24) }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                navigation.navigate('ClientDashboard' as any);
              }
            }}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mon Wallet</Text>
          <View style={styles.spacer} />
        </View>

        {/* Balance Card inside header */}
        <View style={styles.balanceCardContainer}>
          <View style={styles.balanceCard}>
            <View style={styles.balanceHeader}>
              <Text style={styles.balanceLabel}>Solde disponible</Text>
              <TouchableOpacity
                onPress={() => setShowBalance(!showBalance)}
                style={styles.eyeButton}
              >
                <Ionicons
                  name={showBalance ? 'eye' : 'eye-off'}
                  size={16}
                  color="#ffffff"
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.balanceAmount}>
              {showBalance ? formatCurrency(walletData.balance) : '••••••'}
            </Text>
            <Text style={styles.balanceName}>{user?.name}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <View style={styles.actionsCard}>
            <View style={styles.actionsGrid}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Deposit' as any)}
                style={styles.actionButton}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#dcfce7' }]}>
                  <Ionicons name="arrow-down" size={24} color="#16a34a" />
                </View>
                <Text style={styles.actionLabel}>Dépôt</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('Withdraw' as any)}
                style={styles.actionButton}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#fee2e2' }]}>
                  <Ionicons name="arrow-up" size={24} color="#dc2626" />
                </View>
                <Text style={styles.actionLabel}>Retrait</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('Transfer' as any)}
                style={styles.actionButton}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#fef3c7' }]}>
                  <Ionicons name="swap-horizontal" size={24} color="#facc15" />
                </View>
                <Text style={styles.actionLabel}>Transfert</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.transactionsContainer}>
          <View style={styles.transactionsCard}>
            <View style={styles.transactionsHeader}>
              <Text style={styles.transactionsTitle}>Transactions récentes</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('TransactionHistory' as any)}
                style={styles.seeAllButton}
              >
                <Ionicons name="time" size={16} color="#facc15" />
                <Text style={styles.seeAllText}>Tout voir</Text>
              </TouchableOpacity>
            </View>

            {recentTransactions.length === 0 ? (
              <View style={styles.emptyState}>
                <View style={styles.emptyIcon}>
                  <Ionicons name="time-outline" size={32} color="#9ca3af" />
                </View>
                <Text style={styles.emptyText}>Aucune transaction</Text>
              </View>
            ) : (
              <View style={styles.transactionsList}>
                {recentTransactions.map((transaction) => (
                  <View key={transaction.id} style={styles.transactionItem}>
                    <View style={styles.transactionIcon}>
                      <Ionicons
                        name={getTransactionIcon(transaction.type) as any}
                        size={20}
                        color={getTransactionColor(transaction.type)}
                      />
                    </View>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionDescription}>
                        {transaction.description}
                      </Text>
                      <Text style={styles.transactionDate}>
                        {formatDate(transaction.date)}
                      </Text>
                    </View>
                    <View style={styles.transactionAmount}>
                      <Text style={[
                        styles.transactionAmountText,
                        { color: getTransactionColor(transaction.type) }
                      ]}>
                        {getTransactionSign(transaction.type)}{formatCurrency(transaction.amount)}
                      </Text>
                      <Text style={styles.transactionStatus}>
                        {transaction.status}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoContainer}>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              <Text style={styles.infoBold}>Transferts gratuits</Text> entre utilisateurs Allô Dakar.
              Commission de 5% sur les paiements de courses.
            </Text>
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
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  header: {
    backgroundColor: '#000000ff',
    paddingBottom: 48,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  spacer: {
    width: 36,
  },
  balanceCardContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  balanceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  eyeButton: {
    padding: 6,
    borderRadius: 8,
  },
  balanceAmount: {
    fontSize: 30,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  balanceName: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  actionsContainer: {
    paddingHorizontal: 16,
    marginTop: -20,
    marginBottom: 24,
  },
  actionsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 8,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    textAlign: 'center',
  },
  transactionsContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  transactionsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  transactionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    color: '#facc15',
    fontWeight: '500',
  },
  emptyState: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyIcon: {
    width: 64,
    height: 64,
    backgroundColor: '#f3f4f6',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
  },
  transactionsList: {
    paddingVertical: 8,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  transactionStatus: {
    fontSize: 12,
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  infoContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: '#dbeafe',
    borderWidth: 1,
    borderColor: '#93c5fd',
    borderRadius: 12,
    padding: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#1e40af',
  },
  infoBold: {
    fontWeight: '600',
  },
});
