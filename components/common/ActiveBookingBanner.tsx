import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '../../lib/navigation';

interface ActiveBookingBannerProps {
    type: 'voyage' | 'colis';
    status: 'waiting' | 'accepted' | 'in_progress';
}

export default function ActiveBookingBanner({ type, status }: ActiveBookingBannerProps) {
    const navigation = useNavigation<NavigationProp<'Waiting'>>();

    const handleViewStatus = () => {
        if (status === 'waiting') {
            navigation.navigate('Waiting' as any);
        } else {
            navigation.navigate('RideTracking' as any);
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'waiting':
                return 'En attente de confirmation';
            case 'accepted':
                return 'Course acceptée';
            case 'in_progress':
                return 'En cours';
            default:
                return '';
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case 'waiting':
                return { bg: '#fefce8', border: '#fde047' };
            case 'accepted':
            case 'in_progress':
                return { bg: '#f0fdf4', border: '#86efac' };
            default:
                return { bg: '#f9fafb', border: '#e5e7eb' };
        }
    };

    const colors = getStatusColor();

    return (
        <View style={[styles.container, { backgroundColor: colors.bg, borderColor: colors.border }]}>
            <View style={styles.content}>
                <View style={styles.leftSection}>
                    <View style={styles.iconContainer}>
                        <Ionicons
                            name={type === 'voyage' ? 'location' : 'cube'}
                            size={20}
                            color="#1f2937"
                        />
                    </View>
                    <View style={styles.textSection}>
                        <View style={styles.statusRow}>
                            <Ionicons name="time" size={14} color="#6b7280" />
                            <Text style={styles.statusText}>{getStatusText()}</Text>
                        </View>
                        <Text style={styles.typeText}>
                            {type === 'voyage' ? 'Voyage' : 'Colis Yobanté'}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={handleViewStatus}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Voir le statut</Text>
                    <Ionicons name="chevron-forward" size={16} color="#1f2937" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        borderWidth: 2,
        padding: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        backgroundColor: '#facc15',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textSection: {
        flex: 1,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    statusText: {
        fontSize: 14,
        color: '#6b7280',
    },
    typeText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#facc15',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        height: 36,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1f2937',
    },
});
