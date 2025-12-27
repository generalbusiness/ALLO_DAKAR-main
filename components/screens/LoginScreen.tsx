import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AppLogo from '../common/AppLogo';
import { NavigationProp } from '../../lib/navigation';
import { useApp } from '../../contexts/AppContext';

interface LoginScreenProps {
  setUserType: (type: 'client' | 'driver') => void;
  setIsLoggedIn: (value: boolean) => void;
}

export default function LoginScreen({ setUserType, setIsLoggedIn }: LoginScreenProps) {
  const navigation = useNavigation<NavigationProp<'Login'>>();
  const { login } = useApp();
  const [role, setRole] = useState<'client' | 'driver'>('client');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!phone || !password) {
      return;
    }

    setUserType(role);
    setIsLoggedIn(true);

    // Create user object
    login({
      id: Date.now().toString(),
      name: role === 'client' ? 'Amadou Diallo' : 'Moussa Ndiaye',
      email: `${role}@example.com`,
      phone: phone,
      type: role,
    });

    navigation.navigate(role === 'client' ? 'ClientDashboard' as any : 'DriverDashboard' as any);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <AppLogo size="xl" />
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.title}>Connexion</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Numéro de téléphone</Text>
            <TextInput
              style={styles.input}
              placeholder="+221 77 123 45 67"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Je suis</Text>
            <View style={styles.radioContainer}>
              <TouchableOpacity
                onPress={() => setRole('client')}
                style={[styles.radioOption, role === 'client' && styles.radioOptionSelected]}
              >
                <View style={[styles.radio, role === 'client' && styles.radioSelected]}>
                  {role === 'client' && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.radioLabel}>Client</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setRole('driver')}
                style={[styles.radioOption, role === 'driver' && styles.radioOptionSelected]}
              >
                <View style={[styles.radio, role === 'driver' && styles.radioSelected]}>
                  {role === 'driver' && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.radioLabel}>Chauffeur</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            style={styles.loginButton}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>Se connecter</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Selection' as any)}
            style={styles.registerLink}
          >
            <Text style={styles.registerLinkText}>Pas encore de compte ? S'inscrire</Text>
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
  },
  logoContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 40,
  },

  form: {
    maxWidth: 300,
    width: '90%',
    alignSelf: 'center',
   },
  field: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 8
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
  radioContainer: {
    gap: 12,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  radioOptionSelected: {
    borderColor: '#facc15',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioSelected: {
    borderColor: '#facc15',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#facc15',
  },
  radioLabel: {
    fontSize: 16,
    color: '#1f2937',
    flex: 1,
  },
  loginButton: {
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
  loginButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  registerLink: {
    marginTop: 30,
    alignItems: 'center',
  },
  registerLinkText: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
});