import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, ActivityIndicator, Alert, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../contexts/AppContext';
import { NavigationProp } from '../../lib/navigation';

// Mock user search results
const mockUsers = [
  { id: '1', name: 'Amadou Diallo', phone: '77 123 45 67', avatar: '👨🏾' },
  { id: '2', name: 'Fatou Sow', phone: '76 234 56 78', avatar: '👩🏾' },
  { id: '3', name: 'Ousmane Ndiaye', phone: '78 345 67 89', avatar: '👨🏿' },
  { id: '4', name: 'Aïssatou Fall', phone: '70 456 78 90', avatar: '👩🏾' },
];

export default function TransferScreen() {
  const navigation = useNavigation<NavigationProp<'Transfer'>>();
  const { updateWalletBalance, addTransaction, walletData, user } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const filteredUsers = searchQuery.length >= 2
    ? mockUsers.filter(u =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery)
    )
    : [];

  const handleTransfer = async () => {
    if (!selectedUser || !amount) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    const transferAmount = parseInt(amount);
    if (transferAmount < 100) {
      Alert.alert('Erreur', 'Le montant minimum est de 100 FCFA');
      return;
    }

    if (transferAmount > walletData.balance) {
      Alert.alert('Erreur', 'Solde insuffisant');
      return;
    }

    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      updateWalletBalance(-transferAmount);
      addTransaction({
        type: 'transfer_out',
        amount: transferAmount,
        status: 'completed',
        description: `Transfert vers ${selectedUser.name}`,
        method: 'wallet',
        to: selectedUser.id,
      });

      Alert.alert('Succès', 'Transfert effectué avec succès !');
      setTimeout(() => {
        navigation.navigate('Wallet' as any);
      }, 500);
      setIsProcessing(false);
    }, 2000);
  };

  const availableBalance = walletData.balance;
  const canTransfer = amount && parseInt(amount) <= availableBalance;

  const renderUserItem = ({ item }: { item: typeof mockUsers[0] }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedUser(item);
        setSearchQuery('');
      }}
      style={styles.userItem}
    >
      <View style={styles.userAvatar}>
        <Text style={styles.userAvatarText}>{item.avatar}</Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userPhone}>{item.phone}</Text>
      </View>
    </TouchableOpacity>
  );

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
              <Text style={styles.headerTitle}>Transférer de l'argent</Text>
              <Text style={styles.headerSubtitle}>Vers un utilisateur Allô Dakar</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {/* Current Balance */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Solde disponible</Text>
            <Text style={styles.balanceAmount}>{formatCurrency(availableBalance)}</Text>
          </View>

          {/* Search User */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Destinataire</Text>
            {!selectedUser ? (
              <>
                <View style={styles.searchContainer}>
                  <Ionicons name="person" size={20} color="#9ca3af" style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Rechercher par nom ou numéro..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>

                {/* Search Results */}
                {filteredUsers.length > 0 && (
                  <View style={styles.resultsContainer}>
                    <FlatList
                      data={filteredUsers}
                      renderItem={renderUserItem}
                      keyExtractor={(item) => item.id}
                      scrollEnabled={false}
                    />
                  </View>
                )}

                {searchQuery.length >= 2 && filteredUsers.length === 0 && (
                  <View style={styles.noResults}>
                    <Text style={styles.noResultsText}>Aucun utilisateur trouvé</Text>
                  </View>
                )}
              </>
            ) : (
              <View style={styles.selectedUserCard}>
                <View style={styles.selectedUserContent}>
                  <View style={styles.selectedUserAvatar}>
                    <Text style={styles.selectedUserAvatarText}>{selectedUser.avatar}</Text>
                  </View>
                  <View style={styles.selectedUserInfo}>
                    <Text style={styles.selectedUserName}>{selectedUser.name}</Text>
                    <Text style={styles.selectedUserPhone}>{selectedUser.phone}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => setSelectedUser(null)}
                  style={styles.changeButton}
                >
                  <Text style={styles.changeButtonText}>Changer</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {selectedUser && (
            <>
              {/* Amount Input */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Montant à transférer</Text>
                <View style={styles.amountInputContainer}>
                  <TextInput
                    style={styles.amountInput}
                    placeholder="5000"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                  />
                  <Text style={styles.currencyLabel}>FCFA</Text>
                </View>
                {amount && parseInt(amount) > availableBalance && (
                  <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={16} color="#dc2626" />
                    <Text style={styles.errorText}>Solde insuffisant</Text>
                  </View>
                )}
              </View>

              {/* Message (optional) */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Message (optionnel)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Remboursement, Cadeau..."
                  value={message}
                  onChangeText={setMessage}
                />
              </View>

              {/* Free Transfer Info */}
              <View style={styles.freeInfoCard}>
                <View style={styles.freeInfoContent}>
                  <Ionicons name="checkmark-circle" size={20} color="#16a34a" style={styles.freeInfoIcon} />
                  <View style={styles.freeInfoText}>
                    <Text style={styles.freeInfoTitle}>Transfert gratuit</Text>
                    <Text style={styles.freeInfoDescription}>
                      Les transferts entre utilisateurs Allô Dakar sont 100% gratuits et instantanés.
                    </Text>
                  </View>
                </View>
              </View>

              {/* Transfer Summary */}
              {amount && canTransfer && (
                <View style={styles.summaryCard}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Montant</Text>
                    <Text style={styles.summaryValue}>{formatCurrency(parseInt(amount))}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Frais</Text>
                    <Text style={[styles.summaryValue, styles.summaryFree]}>Gratuit</Text>
                  </View>
                  <View style={styles.summaryDivider} />
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryTotalLabel}>Total</Text>
                    <Text style={styles.summaryTotalValue}>{formatCurrency(parseInt(amount))}</Text>
                  </View>
                </View>
              )}

              {/* Transfer Button */}
              <TouchableOpacity
                onPress={handleTransfer}
                disabled={!amount || !canTransfer || isProcessing}
                style={[
                  styles.transferButton,
                  (!amount || !canTransfer || isProcessing) && styles.transferButtonDisabled
                ]}
              >
                {isProcessing ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.transferButtonText}>
                    Transférer {amount ? formatCurrency(parseInt(amount)) : ''}
                  </Text>
                )}
              </TouchableOpacity>
            </>
          )}
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
    padding: 16,
    gap: 24,
  },
  balanceCard: {
    backgroundColor: '#facc15',
    borderRadius: 16,
    padding: 20,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    padding: 16,
    fontSize: 16,
    color: '#1f2937',
  },
  resultsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginTop: 8,
    overflow: 'hidden',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  userAvatar: {
    width: 40,
    height: 40,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    fontSize: 20,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  userPhone: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  noResults: {
    padding: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  noResultsText: {
    fontSize: 14,
    color: '#6b7280',
  },
  selectedUserCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedUserContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  selectedUserAvatar: {
    width: 48,
    height: 48,
    backgroundColor: '#fefce8',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedUserAvatarText: {
    fontSize: 24,
  },
  selectedUserInfo: {
    flex: 1,
  },
  selectedUserName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  selectedUserPhone: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  changeButton: {
    paddingVertical: 4,
  },
  changeButtonText: {
    fontSize: 14,
    color: '#dc2626',
    fontWeight: '500',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingRight: 16,
  },
  amountInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#1f2937',
  },
  currencyLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#dc2626',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1f2937',
  },
  freeInfoCard: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#86efac',
    borderRadius: 8,
    padding: 16,
  },
  freeInfoContent: {
    flexDirection: 'row',
    gap: 12,
  },
  freeInfoIcon: {
    marginTop: 2,
  },
  freeInfoText: {
    flex: 1,
  },
  freeInfoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 4,
  },
  freeInfoDescription: {
    fontSize: 14,
    color: '#15803d',
    lineHeight: 20,
  },
  summaryCard: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  summaryFree: {
    color: '#16a34a',
  },
  summaryDivider: {
    borderTopWidth: 1,
    borderTopColor: '#d1d5db',
    marginTop: 8,
    paddingTop: 8,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  summaryTotalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  transferButton: {
    backgroundColor: '#facc15',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },
  transferButtonDisabled: {
    opacity: 0.5,
  },
  transferButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
});
