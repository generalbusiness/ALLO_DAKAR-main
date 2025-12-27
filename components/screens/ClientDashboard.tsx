import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../common/AppHeader';
import BottomNav from '../common/BottomNav';
import ActiveBookingBanner from '../common/ActiveBookingBanner';
import { useApp } from '../../contexts/AppContext';
import { NavigationProp } from '../../lib/navigation';
import DateTimePicker from '@react-native-community/datetimepicker';
// 1. Importez le Picker
import { Picker } from '@react-native-picker/picker';
// ----------------------------------------------------------------------
// 2. La liste des régions du Sénégal (Déplacée ici pour la disponibilité)
const regionsSenegal = [
  'Dakar',
  'Diourbel',
  'Fatick',
  'Kaffrine',
  'Kaolack',
  'Kédougou',
  'Kolda',
  'Louga',
  'Matam',
  'Saint-Louis',
  'Sédhiou',
  'Tambacounda',
  'Thiès',
  'Ziguinchor',
];
// ----------------------------------------------------------------------

export default function ClientDashboard() {
  const navigation = useNavigation<NavigationProp<'Waiting'>>();
  const { activeBooking, setActiveBooking } = useApp();
  const [activeTab, setActiveTab] = useState<'voyager' | 'yobante'>('voyager');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());

  const [voyageForm, setVoyageForm] = useState({
    departure: '',
    arrival: '',
    date: '',
    time: '',
    seats: '1',
    payment:'wave' as 'wallet' | 'wave' | 'om' | 'yass'
  });

  const [parcelForm, setParcelForm] = useState({
    senderName: '',
    senderPhone: '',
    recipientName: '',
    recipientPhone: '',
    recipientAddress: '',
    parcelDescription: '',
    parcelWeight: '',
    payment: 'wave' as 'wallet' | 'wave' | 'om' | 'yass'
  });

  const handleVoyageSubmit = () => {
    if (!voyageForm.departure || !voyageForm.arrival || !voyageForm.date || !voyageForm.time) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setActiveBooking({
      id: Date.now().toString(),
      type: 'voyage',
      status: 'waiting',
      data: voyageForm
    });
    navigation.navigate('Waiting' as any);
  };

  const handleParcelSubmit = () => {
    if (!parcelForm.senderName || !parcelForm.recipientName || !parcelForm.recipientAddress) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    setActiveBooking({
      id: Date.now().toString(),
      type: 'colis',
      status: 'waiting',
      data: parcelForm
    });
    navigation.navigate('Waiting' as any);
  };

  const generateSMS = () => {
    const message = `Bonjour ${parcelForm.recipientName}, vous allez recevoir un colis via Allô Dakar. Merci de vous rendre disponible.`;
    Alert.alert('SMS généré', message);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatTime = (date: Date) => {
    return date.toTimeString().slice(0, 5);
  };

  const paymentMethods = [
    { id: 'wallet', label: 'Wallet', icon: 'wallet' as const },
    { id: 'wave', label: 'Wave', icon: 'water' as const },
    { id: 'om', label: 'OM', icon: 'phone-portrait' as const },
    { id: 'yass', label: 'Yass', icon: 'card' as const },
  ];

  return (
    <View style={styles.container}>
      <AppHeader />

      <View style={styles.tabsContainer}>
        <View style={styles.tabsHeader}>
          <TouchableOpacity
            onPress={() => setActiveTab('voyager')}
            style={[styles.tab, activeTab === 'voyager' && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === 'voyager' && styles.tabTextActive]}>
              Voyager
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('yobante')}
            style={[styles.tab, activeTab === 'yobante' && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === 'yobante' && styles.tabTextActive]}>
              Yobanté (Colis)
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {activeBooking && (
          <View style={styles.bannerContainer}>
            <ActiveBookingBanner
              type={activeBooking.type}
              status={activeBooking.status}
            />
          </View>
        )}

        {/* --- DÉBUT DU FORMULAIRE VOYAGER CORRIGÉ --- */}
        {activeTab === 'voyager' ? (
          <View style={styles.form}>
            {/* --- POINT DE DÉPART (LISTE DÉROULANTE) --- */}
            <View style={styles.field}>
              <Text style={styles.label}>Point de départ</Text>
              <View style={styles.inputContainer}> 
                <Picker
                  selectedValue={voyageForm.departure}
                  onValueChange={(itemValue) => setVoyageForm({ ...voyageForm, departure: itemValue })}
                  style={styles.picker}
                >
                  <Picker.Item label="Sélectionner une région..." value="" />
                  {regionsSenegal.map((region) => (
                    <Picker.Item key={region} label={region} value={region} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* --- POINT D'ARRIVÉE (LISTE DÉROULANTE) --- */}
            <View style={styles.field}>
              <Text style={styles.label}>Point d'arrivée</Text>
              <View style={styles.inputContainer}>
                <Picker
                  selectedValue={voyageForm.arrival}
                  onValueChange={(itemValue) => setVoyageForm({ ...voyageForm, arrival: itemValue })}
                  style={styles.picker}
                >
                  <Picker.Item label="Sélectionner une région..." value="" />
                  {regionsSenegal.map((region) => (
                    <Picker.Item key={region} label={region} value={region} />
                  ))}
                </Picker>
              </View>
            </View>
            
            {/* --- LE RESTE DU FORMULAIRE RESTE INCHANGÉ --- */}
            <View style={styles.row}>
              <View style={[styles.field, styles.halfField]}>
                <Text style={styles.label}>Date</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={styles.input}
                >
                  <Text style={voyageForm.date ? styles.inputText : styles.placeholderText}>
                    {voyageForm.date || 'Sélectionner'}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={(event, date) => {
                      setShowDatePicker(false);
                      if (date) {
                        setSelectedDate(date);
                        setVoyageForm({ ...voyageForm, date: formatDate(date) });
                      }
                    }}
                  />
                )}
              </View>

              <View style={[styles.field, styles.halfField]}>
                <Text style={styles.label}>Heure</Text>
                <TouchableOpacity
                  onPress={() => setShowTimePicker(true)}
                  style={styles.input}
                >
                  <Text style={voyageForm.time ? styles.inputText : styles.placeholderText}>
                    {voyageForm.time || 'Sélectionner'}
                  </Text>
                </TouchableOpacity>
                {showTimePicker && (
                  <DateTimePicker
                    value={selectedTime}
                    mode="time"
                    display="default"
                    onChange={(event, date) => {
                      setShowTimePicker(false);
                      if (date) {
                        setSelectedTime(date);
                        setVoyageForm({ ...voyageForm, time: formatTime(date) });
                      }
                    }}
                  />
                )}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Nombre de places</Text>
              <TextInput
                style={styles.input}
                placeholder="1"
                value={voyageForm.seats}
                onChangeText={(text) => setVoyageForm({ ...voyageForm, seats: text })}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Mode de paiement</Text>
              <View style={styles.paymentGrid}>
                {paymentMethods.map((method) => (
                  <TouchableOpacity
                    key={method.id}
                    onPress={() => setVoyageForm({ ...voyageForm, payment: method.id as any })}
                    style={[
                      styles.paymentButton,
                      voyageForm.payment === method.id && styles.paymentButtonSelected
                    ]}
                  >
                    <Ionicons
                      name={method.icon}
                      size={18}
                      color={voyageForm.payment === method.id ? '#facc15' : '#6b7280'}
                      style={styles.paymentIcon}
                    />
                    <Text style={[
                      styles.paymentButtonText,
                      voyageForm.payment === method.id && styles.paymentButtonTextSelected
                    ]}>
                      {method.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              onPress={handleVoyageSubmit}
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>Valider la réservation</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* --- LE FORMULAIRE YOBANTE RESTE INCHANGÉ --- */
          <View style={styles.form}>
            {/* Sender Info */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Informations Expéditeur</Text>
              <View style={styles.field}>
                <Text style={styles.label}>Nom complet</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Votre nom"
                  value={parcelForm.senderName}
                  onChangeText={(text) => setParcelForm({ ...parcelForm, senderName: text })}
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Téléphone</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+221 77 123 45 67"
                  value={parcelForm.senderPhone}
                  onChangeText={(text) => setParcelForm({ ...parcelForm, senderPhone: text })}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Recipient Info */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Informations Destinataire</Text>
              <View style={styles.field}>
                <Text style={styles.label}>Nom complet</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nom du destinataire"
                  value={parcelForm.recipientName}
                  onChangeText={(text) => setParcelForm({ ...parcelForm, recipientName: text })}
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Téléphone</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+221 77 123 45 67"
                  value={parcelForm.recipientPhone}
                  onChangeText={(text) => setParcelForm({ ...parcelForm, recipientPhone: text })}
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Adresse de livraison</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Adresse complète"
                  value={parcelForm.recipientAddress}
                  onChangeText={(text) => setParcelForm({ ...parcelForm, recipientAddress: text })}
                  multiline
                />
              </View>
            </View>
            {/* Parcel Info */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Informations Colis</Text>
              <View style={styles.field}>
                <Text style={styles.label}>Description du colis</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Vêtements, documents..."
                  value={parcelForm.parcelDescription}
                  onChangeText={(text) => setParcelForm({ ...parcelForm, parcelDescription: text })}
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Poids (kg)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 2"
                  value={parcelForm.parcelWeight}
                  onChangeText={(text) => setParcelForm({ ...parcelForm, parcelWeight: text })}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={generateSMS}
              style={styles.smsButton}
            >
              <Ionicons name="sparkles" size={20} color="#facc15" />
              <Text style={styles.smsButtonText}>Générer un SMS pour le destinataire</Text>
            </TouchableOpacity>

            <View style={styles.field}>
              <Text style={styles.label}>Mode de paiement</Text>
              <View style={styles.paymentGrid}>
                {paymentMethods.map((method) => (
                  <TouchableOpacity
                    key={method.id}
                    onPress={() => setParcelForm({ ...parcelForm, payment: method.id as any })}
                    style={[
                      styles.paymentButton,
                      parcelForm.payment === method.id && styles.paymentButtonSelected
                    ]}
                  >
                    <Ionicons
                      name={method.icon}
                      size={18}
                      color={parcelForm.payment === method.id ? '#facc15' : '#6b7280'}
                      style={styles.paymentIcon}
                    />
                    <Text style={[
                      styles.paymentButtonText,
                      parcelForm.payment === method.id && styles.paymentButtonTextSelected
                    ]}>
                      {method.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              onPress={handleParcelSubmit}
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>Envoyer le colis</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <BottomNav userType="client" />
    </View>
  );
}

// ----------------------------------------------------------------------
// STYLE SHEET CORRIGÉ AVEC LES AJOUTS POUR LE PICKER
// ----------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  tabsContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tabsHeader: {
    flexDirection: 'row',
    height: 56,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#facc15',
  },
  tabText: {
    fontSize: 16,
    color: '#6b7280',
  },
  tabTextActive: {
    color: '#1f2937',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  bannerContainer: {
    marginBottom: 24,
  },
  form: {
    gap: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 8,
  },
  // Style de base pour les TextInput
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1f2937',
    minHeight: 48,
  },
  // NOUVEAUX STYLES POUR LE PICKER
  inputContainer: { 
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    minHeight: 48,
    justifyContent: 'center', // Centre le contenu verticalement
    overflow: 'hidden', // Empêche le Picker de déborder
  },
  picker: {
    // Le Picker lui-même
    minHeight: 48,
    color: '#1f2937', // Couleur du texte sélectionné
  },
  inputText: {
    color: '#1f2937',
  },
  placeholderText: {
    color: '#9ca3af',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfField: {
    flex: 1,
  },
  paymentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  paymentButton: {
    flex: 1,
    minWidth: '45%',
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
  smsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#facc15',
    backgroundColor: '#ffffff',
    gap: 8,
  },
  smsButtonText: {
    fontSize: 16,
    color: '#facc15',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#facc15',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
});