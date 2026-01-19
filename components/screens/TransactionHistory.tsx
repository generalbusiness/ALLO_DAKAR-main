import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, FlatList, SectionList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp, Transaction } from '../../contexts/AppContext';
import { NavigationProp } from '../../lib/navigation';

export default function TransactionHistory() {
  const navigation = useNavigation<NavigationProp<'TransactionHistory'>>();
  const { transactions } = useApp();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | Transaction['type']>('all');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
        return 'arrow-down';
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

  const getTypeLabel = (type: Transaction['type']) => {
    const labels = {
      deposit: 'Dépôt',
      withdraw: 'Retrait',
      transfer_in: 'Transfert reçu',
      transfer_out: 'Transfert envoyé',
      payment: 'Paiement',
      earning: 'Gain',
    };
    return labels[type];
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || transaction.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Group transactions by date
  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const date = new Date(transaction.date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);

  const filterOptions: { value: 'all' | Transaction['type']; label: string }[] = [
    { value: 'all', label: 'Tout' },
    { value: 'deposit', label: 'Dépôts' },
    { value: 'withdraw', label: 'Retraits' },
    { value: 'transfer_in', label: 'Reçus' },
    { value: 'transfer_out', label: 'Envoyés' },
    { value: 'payment', label: 'Paiements' },
    { value: 'earning', label: 'Gains' },
  ];

  // Convert to SectionList format
  const sections = Object.entries(groupedTransactions).map(([date, dayTransactions]) => ({
    title: date,
    data: dayTransactions,
  }));

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionIcon}>
        <Ionicons
          name={getTransactionIcon(item.type) as any}
          size={20}
          color={getTransactionColor(item.type)}
        />
      </View>
      <View style={styles.transactionContent}>
        <View style={styles.transactionHeader}>
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionDescription}>{item.description}</Text>
            <Text style={styles.transactionType}>{getTypeLabel(item.type)}</Text>
          </View>
          <Text style={[styles.transactionAmount, { color: getTransactionColor(item.type) }]}>
            {getTransactionSign(item.type)}{formatCurrency(item.amount)}
          </Text>
        </View>
        <View style={styles.transactionMeta}>
          <Text style={styles.transactionMetaText}>{item.status}</Text>
          {item.reference && (
            <>
              <Text style={styles.transactionMetaDot}>•</Text>
              <Text style={styles.transactionMetaText}>{item.reference}</Text>
            </>
          )}
          {item.method && (
            <>
              <Text style={styles.transactionMetaDot}>•</Text>
              <Text style={styles.transactionMetaText}>
                {item.method.replace('_', ' ')}
              </Text>
            </>
          )}
        </View>
      </View>
    </View>
  );

  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <Text style={styles.sectionHeader}>{section.title}</Text>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top + 8, 24) }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color="#1f2937" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Historique</Text>
            <Text style={styles.headerSubtitle}>{transactions.length} transaction(s)</Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une transaction..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => setFilterType(option.value)}
              style={[
                styles.filterButton,
                filterType === option.value && styles.filterButtonActive
              ]}
            >
              <Text style={[
                styles.filterButtonText,
                filterType === option.value && styles.filterButtonTextActive
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Transactions List */}
      <View style={styles.content}>
        {sections.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="filter" size={32} color="#9ca3af" />
            </View>
            <Text style={styles.emptyText}>Aucune transaction trouvée</Text>
          </View>
        ) : (
          <SectionList
            sections={sections}
            renderItem={renderTransaction}
            renderSectionHeader={renderSectionHeader}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            stickySectionHeadersEnabled={false}
          />
        )}
      </View>
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
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 16,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingLeft: 40,
    paddingRight: 16,
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  filtersContainer: {
    marginHorizontal: 16,
  },
  filtersContent: {
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#facc15',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  listContent: {
    paddingBottom: 80,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 12,
    marginTop: 8,
    paddingHorizontal: 8,
  },
  transactionItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 4,
  },
  transactionContent: {
    flex: 1,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  transactionInfo: {
    flex: 1,
    marginRight: 8,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  transactionType: {
    fontSize: 12,
    color: '#6b7280',
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: '600',
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  transactionMetaText: {
    fontSize: 12,
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  transactionMetaDot: {
    fontSize: 12,
    color: '#6b7280',
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 48,
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
    fontSize: 16,
    color: '#6b7280',
  },
});
