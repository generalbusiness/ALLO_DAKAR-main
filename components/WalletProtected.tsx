import React, { useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useApp } from '../contexts/AppContext';
import { NavigationProp } from '../lib/navigation';

interface WalletProtectedProps {
    children: React.ReactNode;
}

export function WalletProtected({ children }: WalletProtectedProps) {
    const navigation = useNavigation<NavigationProp<'PinCodeSetup'>>();
    const route = useRoute();
    const { walletData } = useApp();

    useEffect(() => {
        // If no PIN is set, redirect to PIN setup
        if (!walletData.hasPinCode) {
            navigation.navigate('PinCodeSetup' as any);
        }
    }, [walletData.hasPinCode]);

    // If PIN is set, show children (wallet screens)
    if (walletData.hasPinCode) {
        return <>{children}</>;
    }

    return null;
}
