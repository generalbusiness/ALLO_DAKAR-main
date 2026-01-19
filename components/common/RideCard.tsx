import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { RideRequest } from '../../lib/types';


interface RideCardProps {
    request: RideRequest;
    onAccept: (id: number) => void;
    showAcceptButton?: boolean;
}


export default function RideCard({ request, onAccept, showAcceptButton = true }: RideCardProps) {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.typeContainer}>
                    <View style={[
                        styles.typeIcon,
                        request.type === 'voyage' ? styles.typeIconVoyage : styles.typeIconColis
                    ]}>
                        <Ionicons
                            name={request.type === 'voyage' ? 'location' : 'cube'}
                            size={20}
                            color={request.type === 'voyage' ? '#facc15' : '#3b82f6'}
                        />
                    </View>
                    <View style={styles.priceContainer}>
                        <Text style={styles.typeLabel}>
                            {request.type === 'voyage' ? 'Voyage' : 'Colis'}
                        </Text>
                        <Text style={styles.price}>{request.price}</Text>
                    </View>
                </View>
            </View>


            {/* Route Information */}
            <View style={styles.routeContainer}>
                <View style={styles.routeItem}>
                    <View style={styles.dotGreen} />
                    <View style={styles.routeInfo}>
                        <Text style={styles.routeLabel}>Départ</Text>
                        <Text style={styles.routeText}>{request.from}</Text>
                    </View>
                </View>
                <View style={styles.routeItem}>
                    <View style={styles.dotRed} />
                    <View style={styles.routeInfo}>
                        <Text style={styles.routeLabel}>Arrivée</Text>
                        <Text style={styles.routeText}>{request.to}</Text>
                    </View>
                </View>
            </View>


            {/* Customer and Date Info */}
            <View style={styles.metaContainer}>
                <View style={styles.metaItem}>
                    <Ionicons name="person" size={16} color="#6b7280" />
                    <Text style={styles.metaText}>{request.customer}</Text>
                </View>
                <View style={styles.metaItem}>
                    <Ionicons name="calendar" size={16} color="#6b7280" />
                    <Text style={styles.metaText}>{request.date}</Text>
                </View>
                {request.time && (
                    <View style={styles.metaItem}>
                        <Ionicons name="time" size={16} color="#6b7280" />
                        <Text style={styles.metaText}>{request.time}</Text>
                    </View>
                )}
            </View>


            {/* Additional Details */}
            <View style={styles.detailsContainer}>
                {request.seats && (
                    <Text style={styles.detailText}>
                        {request.seats} place{request.seats > 1 ? 's' : ''}
                    </Text>
                )}
                {request.weight && (
                    <Text style={styles.detailText}>
                        Poids: {request.weight}
                    </Text>
                )}
            </View>


            {/* Accept Button */}
            {showAcceptButton && (
                <TouchableOpacity
                    onPress={() => onAccept(request.id)}
                    style={styles.acceptButton}
                >
                    <Text style={styles.acceptButtonText}>Accepter la course</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    typeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    typeIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    typeIconVoyage: {
        backgroundColor: '#fefce8',
    },
    typeIconColis: {
        backgroundColor: '#dbeafe',
    },
    priceContainer: {
        gap: 2,
    },
    typeLabel: {
        fontSize: 14,
        color: '#6b7280',
    },
    price: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1f2937',
    },
    routeContainer: {
        gap: 12,
        marginBottom: 16,
    },
    routeItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    dotGreen: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#22c55e',
        marginTop: 6,
    },
    dotRed: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#ef4444',
        marginTop: 6,
    },
    routeInfo: {
        flex: 1,
    },
    routeLabel: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 2,
    },
    routeText: {
        fontSize: 16,
        color: '#1f2937',
    },
    metaContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 16,
        marginBottom: 16,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 14,
        color: '#6b7280',
    },
    detailsContainer: {
        gap: 4,
        marginBottom: 16,
    },
    detailText: {
        fontSize: 14,
        color: '#6b7280',
    },
    acceptButton: {
        backgroundColor: '#facc15',
        borderRadius: 12,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
    },
    acceptButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
    },
});


