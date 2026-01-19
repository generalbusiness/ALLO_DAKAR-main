import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../contexts/AppContext';
import { NavigationProp } from '../../lib/navigation';

type PaymentMethod = 'wave' | 'orange_money' | 'yass';

const paymentMethods = [
  {
    id: 'wave' as PaymentMethod,
    name: 'Wave',
    icon: 'water' as const,
    color: '#3b82f6',
  },
  {
    id: 'orange_money' as PaymentMethod,
    name: 'Orange Money',
    icon: 'phone-portrait' as const,
    color: '#f97316',
  },
  {
    id: 'yass' as PaymentMethod,
    name: 'Yass',
    icon: 'card' as const,
    color: '#22c55e',
  },
];

export default function WithdrawScreen() {
  const navigation = useNavigation<NavigationProp<'Withdraw'>>();
  const { updateWalletBalance, addTransaction, walletData } = useApp();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleWithdraw = async () => {
    if (!selectedMethod || !amount || !phoneNumber) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    const withdrawAmount = parseInt(amount);
    if (withdrawAmount < 500) {
      Alert.alert('Erreur', 'Le montant minimum est de 500 FCFA');
      return;
    }

    if (withdrawAmount > walletData.balance) {
      Alert.alert('Erreur', 'Solde insuffisant');
      return;
    }

    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      updateWalletBalance(-withdrawAmount);
      addTransaction({
        type: 'withdraw',
        amount: withdrawAmount,
        status: 'completed',
        description: `Retrait vers ${paymentMethods.find(m => m.id === selectedMethod)?.name}`,
        method: selectedMethod,
        reference: `WTH-${Date.now()}`,
      });

      Alert.alert('Succès', 'Retrait effectué avec succès !');
      setTimeout(() => {
        navigation.navigate('Wallet' as any);
      }, 500);
      setIsProcessing(false);
    }, 2000);
  };

  const availableBalance = walletData.balance;
  const canWithdraw = amount && parseInt(amount) <= availableBalance;

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
              <Text style={styles.headerTitle}>Retirer de l'argent</Text>
              <Text style={styles.headerSubtitle}>Vers Mobile Money</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {/* Current Balance */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Solde disponible</Text>
            <Text style={styles.balanceAmount}>{formatCurrency(availableBalance)}</Text>
          </View>

          {/* Select Payment Method */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choisir un moyen de retrait</Text>
            <View style={styles.methodsList}>
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  onPress={() => setSelectedMethod(method.id)}
                  style={[
                    styles.methodCard,
                    selectedMethod === method.id && styles.methodCardSelected
                  ]}
                >
                  <View style={styles.methodContent}>
                    <View style={[styles.methodLogo, { backgroundColor: method.color }]}>
                      <Ionicons name={method.icon} size={24} color="#ffffff" />
                    </View>
                    <Text style={styles.methodName}>{method.name}</Text>
                  </View>
                  {selectedMethod === method.id && (
                    <View style={styles.checkIcon}>
                      <Ionicons name="checkmark" size={16} color="#ffffff" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {selectedMethod && (
            <>
              {/* Phone Number */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Numéro de téléphone</Text>
                <TextInput
                  style={styles.input}
                  placeholder="77 123 45 67"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                />
                <Text style={styles.helperText}>
                  Le compte {paymentMethods.find(m => m.id === selectedMethod)?.name} associé à ce numéro
                </Text>
              </View>

              {/* Amount Input */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Montant à retirer</Text>
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

              {/* Quick withdraw all */}
              <TouchableOpacity
                onPress={() => setAmount(availableBalance.toString())}
                style={styles.withdrawAllButton}
              >
                <Text style={styles.withdrawAllText}>
                  Retirer tout le solde ({formatCurrency(availableBalance)})
                </Text>
              </TouchableOpacity>

              {/* Info */}
              <View style={styles.infoCard}>
                <Text style={styles.infoText}>
                  Le retrait sera effectué instantanément vers votre compte {paymentMethods.find(m => m.id === selectedMethod)?.name}.
                </Text>
              </View>

              {/* Withdraw Button */}
              <TouchableOpacity
                onPress={handleWithdraw}
                disabled={!amount || !phoneNumber || !canWithdraw || isProcessing}
                style={[
                  styles.withdrawButton,
                  (!amount || !phoneNumber || !canWithdraw || isProcessing) && styles.withdrawButtonDisabled
                ]}
              >
                {isProcessing ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.withdrawButtonText}>
                    Retirer {amount ? formatCurrency(parseInt(amount)) : ''}
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
  methodsList: {
    gap: 12,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  methodCardSelected: {
    borderColor: '#facc15',
    backgroundColor: '#fefce8',
  },
  methodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  methodLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#facc15',
    alignItems: 'center',
    justifyContent: 'center',
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
  helperText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
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
  withdrawAllButton: {
    paddingVertical: 8,
  },
  withdrawAllText: {
    fontSize: 14,
    color: '#facc15',
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: '#dbeafe',
    borderWidth: 1,
    borderColor: '#93c5fd',
    borderRadius: 8,
    padding: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#1e40af',
  },
  withdrawButton: {
    backgroundColor: '#facc15',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },
  withdrawButtonDisabled: {
    opacity: 0.5,
  },
  withdrawButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
});
