import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../contexts/AppContext';
import { NavigationProp } from '../../lib/navigation';

interface NavItem {
    iconName: keyof typeof Ionicons.glyphMap;
    label: string;
    screen: string;
    action?: () => void;
}

interface BottomNavProps {
    userType: 'client' | 'driver';
}

export default function BottomNav({ userType }: BottomNavProps) {
    const navigation = useNavigation<NavigationProp<'Wallet'>>();
    const route = useRoute();
    const { walletData } = useApp();
    const insets = useSafeAreaInsets();

    const handleWalletClick = () => {
        if (walletData.hasPinCode) {
            navigation.navigate('PinCodeVerification' as any, { from: 'Wallet' });
        } else {
            navigation.navigate('PinCodeSetup' as any);
        }
    };

    const clientNavItems: NavItem[] = [
        { iconName: 'home', label: 'Accueil', screen: 'ClientDashboard' },
        { iconName: 'wallet', label: 'Wallet', screen: 'Wallet', action: handleWalletClick },
        { iconName: 'information-circle', label: 'Info', screen: 'Info' },
        { iconName: 'person', label: 'Profil', screen: 'Profile' }
    ];

    const driverNavItems: NavItem[] = [
        { iconName: 'car', label: 'Courses', screen: 'DriverDashboard' },
        { iconName: 'wallet', label: 'Wallet', screen: 'Wallet', action: handleWalletClick },
        { iconName: 'cash', label: 'Gains', screen: 'DriverEarnings' },
        { iconName: 'person', label: 'Profil', screen: 'Profile' }
    ];

    const navItems = userType === 'client' ? clientNavItems : driverNavItems;

    const isActive = (screen: string) => {
        return route.name === screen || (screen === 'Wallet' && route.name?.toString().startsWith('Wallet'));
    };

    return (
        <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
            <View style={styles.navContainer}>
                {navItems.map((item) => {
                    const active = isActive(item.screen);

                    return (
                        <TouchableOpacity
                            key={item.screen}
                            onPress={() => item.action ? item.action() : navigation.navigate(item.screen as any)}
                            style={styles.navItem}
                        >
                            <Ionicons
                                name={item.iconName}
                                size={24}
                                color={active ? '#facc15' : '#6b7280'}
                            />
                            <Text style={[styles.label, active && styles.labelActive]}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    navContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 64,
        paddingHorizontal: 8,
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    label: {
        fontSize: 12,
        color: '#6b7280',
    },
    labelActive: {
        color: '#facc15',
    },
});