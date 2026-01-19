import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PAYMENT_METHODS } from '../../lib/constants';
import type { PaymentMethod } from '../../lib/types';

const getPaymentIcon = (methodId: PaymentMethod) => {
    switch (methodId) {
        case 'wallet':
            return 'wallet';
        case 'wave':
            return 'water';
        case 'om':
            return 'phone-portrait';
        case 'yass':
            return 'card';
        default:
            return 'card';
    }
};

interface PaymentSelectorProps {
    selected: PaymentMethod;
    onChange: (method: PaymentMethod) => void;
}

export default function PaymentSelector({ selected, onChange }: PaymentSelectorProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Mode de paiement</Text>
            <View style={styles.grid}>
                {PAYMENT_METHODS.map((method) => (
                    <TouchableOpacity
                        key={method.id}
                        onPress={() => onChange(method.id as PaymentMethod)}
                        style={[
                            styles.paymentButton,
                            selected === method.id && styles.paymentButtonSelected
                        ]}
                    >
                        <Ionicons
                            name={getPaymentIcon(method.id as PaymentMethod) as any}
                            size={18}
                            color={selected === method.id ? '#facc15' : '#6b7280'}
                            style={styles.paymentIcon}
                        />
                        <Text style={[
                            styles.paymentButtonText,
                            selected === method.id && styles.paymentButtonTextSelected
                        ]}>
                            {method.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1f2937',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    paymentButton: {
        flex: 1,
        minWidth: '30%',
        padding: 12,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#e5e7eb',
        backgroundColor: '#ffffff',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
    },
    paymentIcon: {
        marginRight: 4,
    },
    paymentButtonSelected: {
        borderColor: '#facc15',
        backgroundColor: '#fefce8',
    },
    paymentButtonText: {
        fontSize: 14,
        color: '#374151',
    },
    paymentButtonTextSelected: {
        color: '#facc15',
        fontWeight: '600',
    },
});