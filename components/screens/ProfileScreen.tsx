import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from '../common/BottomNav';
import { NavigationProp } from '../../lib/navigation';

interface ProfileScreenProps {
  userType: 'client' | 'driver' | null;
  setIsLoggedIn: (value: boolean) => void;
}

export default function ProfileScreen({ userType, setIsLoggedIn }: ProfileScreenProps) {
  const navigation = useNavigation<NavigationProp<'Profile'>>();
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: () => {
            setIsLoggedIn(false);
            navigation.navigate('Login' as any);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mon Profil</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Profile Info Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userType === 'driver' ? 'MN' : 'AD'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {userType === 'driver' ? 'Moussa Ndiaye' : 'Amadou Diallo'}
              </Text>
              <View style={styles.phoneRow}>
                <Ionicons name="call" size={16} color="#6b7280" />
                <Text style={styles.phoneText}>+221 77 123 45 67</Text>
              </View>
              {userType === 'driver' && (
                <View style={styles.badges}>
                  <View style={styles.badge}>
                    <Ionicons name="checkmark-circle" size={14} color="#166534" />
                    <Text style={styles.badgeText}>Vérifié</Text>
                  </View>
                  <View style={[styles.badge, styles.ratingBadge]}>
                    <Ionicons name="star" size={16} color="#ca8a04" style={styles.starIcon} />
                    <Text style={[styles.badgeText, styles.ratingBadgeText]}>4.8</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={styles.menuIcon}>
                <Ionicons name="person" size={20} color="#6b7280" />
              </View>
              <Text style={styles.menuText}>Modifier le profil</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={styles.menuIcon}>
                <Ionicons name="time" size={20} color="#6b7280" />
              </View>
              <Text style={styles.menuText}>Historique des courses</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Info' as any)}
            style={styles.menuItem}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.menuIcon}>
                <Ionicons name="help-circle" size={20} color="#6b7280" />
              </View>
              <Text style={styles.menuText}>À propos</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogout}
            style={[styles.menuItem, styles.logoutItem]}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, styles.logoutIcon]}>
                <Ionicons name="log-out" size={20} color="#dc2626" />
              </View>
              <Text style={[styles.menuText, styles.logoutText]}>Déconnexion</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav userType={userType || 'client'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 24,
    paddingBottom: 24,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: '#facc15',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1f2937',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  phoneText: {
    fontSize: 14,
    color: '#6b7280',
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#dcfce7',
    borderRadius: 8,
  },
  ratingBadge: {
    backgroundColor: '#fefce8',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#166534',
  },
  ratingBadgeText: {
    color: '#ca8a04',
  },
  starIcon: {
    marginRight: 2,
  },
  menuContainer: {
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    fontSize: 16,
    color: '#1f2937',
  },
  logoutItem: {
    marginTop: 8,
  },
  logoutIcon: {
    backgroundColor: '#fee2e2',
  },
  logoutText: {
    color: '#dc2626',
  },
});
