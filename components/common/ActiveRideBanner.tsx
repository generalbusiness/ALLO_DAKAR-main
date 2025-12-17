import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '../../lib/navigation';

interface ActiveRideBannerProps {
    type: 'voyage' | 'colis';
    status: 'accepted' | 'in_progress';
}

export default function ActiveRideBanner({ type, status }: ActiveRideBannerProps) {
    const navigation = useNavigation<NavigationProp<'DriverNavigation'>>();

    const handleViewStatus = () => {
        navigation.navigate('DriverNavigation' as any);
    };

    const getStatusText = () => {
        switch (status) {
            case 'accepted':
                return 'Course acceptée - En route';
            case 'in_progress':
                return 'Course en cours';
            default:
                return '';
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.leftSection}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="navigate" size={20} color="#1f2937" />
                    </View>
                    <View style={styles.textSection}>
                        <View style={styles.statusRow}>
                            <Ionicons name="time" size={14} color="#15803d" />
                            <Text style={styles.statusText}>{getStatusText()}</Text>
                        </View>
                        <Text style={styles.typeText}>
                            {type === 'voyage' ? 'Transport passager' : 'Livraison colis'}
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
        backgroundColor: '#f0fdf4',
        borderWidth: 2,
        borderColor: '#86efac',
        borderRadius: 12,
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
        color: '#15803d',
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
