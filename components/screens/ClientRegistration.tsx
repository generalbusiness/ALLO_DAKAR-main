import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '../../lib/navigation';
import { useApp } from '../../contexts/AppContext';

interface ClientRegistrationProps {
    setUserType: (type: 'client') => void;
    setIsLoggedIn: (value: boolean) => void;
}

export default function ClientRegistration({ setUserType, setIsLoggedIn }: ClientRegistrationProps) {
    const navigation = useNavigation<NavigationProp<'ClientRegistration'>>();
    const { login } = useApp();
    const insets = useSafeAreaInsets();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        password: '',
        acceptTerms: false
    });

    const handleSubmit = () => {
        if (!formData.name || !formData.phone || !formData.password || !formData.acceptTerms) {
            return;
        }

        setUserType('client');
        setIsLoggedIn(true);

        login({
            id: Date.now().toString(),
            name: formData.name,
            email: `${formData.phone}@example.com`,
            phone: formData.phone,
            type: 'client',
        });

        navigation.navigate('ClientDashboard' as any);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: Math.max(insets.top + 8, 24) }]}>
                <View style={styles.headerContent}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Ionicons name="chevron-back" size={24} color="#1f2937" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Inscription Client</Text>
                </View>
            </View>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>

                {/* Form */}
                <View style={styles.form}>
                    <View style={styles.field}>
                        <Text style={styles.label}>Prénom & Nom</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Amadou Diallo"
                            value={formData.name}
                            onChangeText={(text) => setFormData({ ...formData, name: text })}
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Numéro de téléphone</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="+221 77 123 45 67"
                            value={formData.phone}
                            onChangeText={(text) => setFormData({ ...formData, phone: text })}
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Mot de passe</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            value={formData.password}
                            onChangeText={(text) => setFormData({ ...formData, password: text })}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        onPress={() => setFormData({ ...formData, acceptTerms: !formData.acceptTerms })}
                        style={styles.checkboxContainer}
                    >
                        <View style={[styles.checkbox, formData.acceptTerms && styles.checkboxChecked]}>
                            {formData.acceptTerms && (
                                <Ionicons name="checkmark" size={16} color="#ffffff" />
                            )}
                        </View>
                        <Text style={styles.checkboxLabel}>
                            J'accepte les conditions d'utilisation et la politique de confidentialité d'Allô Dakar
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={!formData.acceptTerms}
                        style={[styles.submitButton, !formData.acceptTerms && styles.submitButtonDisabled]}
                    >
                        <Text style={styles.submitButtonText}>Je m'inscris</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 100,
    },
    header: {
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        paddingHorizontal: 24,
        paddingBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    backButton: {
        padding: 8,
        borderRadius: 12,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#1f2937',
    },
    form: {
        maxWidth: 400,
        width: '100%',
        alignSelf: 'center',
        gap: 24,
    },
    field: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1f2937',
    },
    input: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        padding: 10,
        fontSize: 16,
        color: '#1f2937',
        height: 48,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        marginTop: 16,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#d1d5db',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    checkboxChecked: {
        backgroundColor: '#facc15',
        borderColor: '#facc15',
    },
    checkboxLabel: {
        fontSize: 14,
        color: '#6b7280',
        flex: 1,
        lineHeight: 20,
    },
    submitButton: {
        width: '100%',
        backgroundColor: '#facc15',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        marginTop: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    submitButtonDisabled: {
        opacity: 0.5,
    },
    submitButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1f2937',
    },
});
