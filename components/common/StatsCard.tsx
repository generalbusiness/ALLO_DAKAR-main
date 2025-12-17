import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatsCardProps {
    label: string;
    value: string | number;
    variant?: 'default' | 'dark';
}

export default function StatsCard({ label, value, variant = 'default' }: StatsCardProps) {
    const bgColor = variant === 'dark' ? '#1f2937' : '#ffffff';
    const labelColor = variant === 'dark' ? '#9ca3af' : '#6b7280';
    const valueColor = variant === 'dark' ? '#facc15' : '#1f2937';

    return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
            <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    label: {
        fontSize: 12,
        marginBottom: 4,
    },
    value: {
        fontSize: 24,
        fontWeight: '700',
    },
});
