import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../contexts/AppContext';
import AppLogo from './AppLogo';
import { NavigationProp } from '../../lib/navigation';

interface AppHeaderProps {
    title?: string;
    subtitle?: string;
    variant?: 'light' | 'dark';
    showWallet?: boolean;
}

export default function AppHeader({
    title = 'Allô Dakar',
    subtitle = 'Bienvenue',
    variant = 'light',
    showWallet = true
}: AppHeaderProps) {
    const navigation = useNavigation<NavigationProp<'Wallet'>>();
    const { walletData } = useApp();
    const insets = useSafeAreaInsets();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleWalletClick = () => {
        if (walletData.hasPinCode) {
            navigation.navigate('PinCodeVerification' as any, { from: 'Wallet' });
        } else {
            navigation.navigate('PinCodeSetup' as any);
        }
    };

    const bgColor = variant === 'dark' ? '#1f2937' : '#ffffff';
    const textColor = variant === 'dark' ? '#ffffff' : '#1f2937';
    const subtitleColor = variant === 'dark' ? '#d1d5db' : '#6b7280';

    return (
        <View style={[styles.container, {
            backgroundColor: bgColor,
            borderBottomColor: '#e5e7eb',
            paddingTop: Math.max(insets.top + 8, 24)
        }]}>
            <View style={styles.content}>
                <View style={styles.leftSection}>
                    <AppLogo size="md" variant={variant === 'dark' ? 'dark' : 'default'} />
                    <View style={styles.textContainer}>
                        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
                        <Text style={[styles.subtitle, { color: subtitleColor }]}>{subtitle}</Text>
                    </View>
                </View>

                {showWallet && (
                    <TouchableOpacity
                        onPress={handleWalletClick}
                        style={styles.walletButton}
                    >
                        <Ionicons name="wallet" size={20} color="#ffffff" />
                        <View style={styles.walletTextContainer}>
                            <Text style={styles.walletLabel}>Wallet</Text>
                            <Text style={styles.walletAmount}>{formatCurrency(walletData.balance)}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        paddingVertical: 16,
        paddingHorizontal: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
    },
    subtitle: {
        fontSize: 14,
    },
    walletButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#facc15',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    walletTextContainer: {
        alignItems: 'flex-start',
    },
    walletLabel: {
        fontSize: 12,
        color: '#ffffff',
        opacity: 0.9,
    },
    walletAmount: {
        fontSize: 14,
        color: '#ffffff',
        fontWeight: '600',
    },
});