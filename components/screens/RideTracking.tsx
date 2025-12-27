import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Alert } from 'react-native';
import MapView, { Marker, AnimatedRegion, PROVIDER_GOOGLE } from 'react-native-maps';
import { Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../contexts/AppContext';
import { NavigationProp } from '../../lib/navigation';


const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


export default function RideTracking() {
  const navigation = useNavigation<NavigationProp<'RideTracking'>>();
  const { setActiveBooking } = useApp();
  const insets = useSafeAreaInsets();


  // Exemple de départ et destination
  const departure = { latitude: 14.6928, longitude: -17.4467 }; // Dakar
  const destination = { latitude: 16.0165, longitude: -16.4897 }; // Saint-Louis


  // AnimatedRegion pour le Marker
  const carPosition = useRef(
    new AnimatedRegion({
      latitude: departure.latitude,
      longitude: departure.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    })
  ).current;


  // Fonction pour déplacer le Marker
  const moveCar = () => {
    carPosition.timing({
      latitude: destination.latitude,
      longitude: destination.longitude,
      duration: 5000, // 5 secondes
      useNativeDriver: false,
    } as any).start();
  };


  useEffect(() => {
    moveCar();
  }, []);


  const handleCompleteRide = () => {
    setActiveBooking(null);
    navigation.navigate('ClientDashboard' as any);
  };


  const handleCancelRide = () => {
    Alert.alert(
      'Annuler la course ?',
      'Êtes-vous sûr de vouloir annuler cette course ? Des frais d\'annulation peuvent s\'appliquer.',
      [
        { text: 'Non, continuer', style: 'cancel' },
        {
          text: 'Oui, annuler',
          style: 'destructive',
          onPress: () => {
            setActiveBooking(null);
            navigation.navigate('ClientDashboard' as any);
          }
        }
      ]
    );
  };


  return (
    <View style={styles.container}>
      {/* Map Area */}
      <View style={styles.mapContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ClientDashboard' as any)}
          style={[styles.backButton, { top: Math.max(insets.top + 16, 40) }]}
        >
          <Ionicons name="chevron-back" size={24} color="#1f2937" />
        </TouchableOpacity>


        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: departure.latitude,
            longitude: departure.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
        >
          {/* Marker animé */}
          <Marker.Animated
  coordinate={carPosition as any} // <-- on force le cast si TS se plaint
>
  <View style={styles.carMarker}>
    <View style={styles.carIcon} />
  </View>
</Marker.Animated>


        </MapView>
      </View>


      {/* Driver Info Card */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.driverName}>Moussa Ndiaye</Text>
          <Text style={styles.driverCar}>Toyota Corolla • DK-1234-AB</Text>


          <View style={styles.actionsContainer}>
            <TouchableOpacity onPress={handleCompleteRide} style={styles.completeButton}>
              <Text style={styles.completeButtonText}>Terminer la course</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancelRide} style={styles.cancelButton}>
              <Ionicons name="close" size={20} color="#dc2626" />
              <Text style={styles.cancelButtonText}>Annuler la course</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1 },
  mapContainer: { height: '60%', backgroundColor: '#dbeafe' },
  backButton: {
    position: 'absolute',
    left: 24,
    zIndex: 10,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  map: { flex: 1 },
  carMarker: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  carIcon: { width: 20, height: 20, backgroundColor: '#facc15', borderRadius: 10 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 100 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
  driverName: { fontSize: 18, fontWeight: '600', color: '#1f2937', marginBottom: 4 },
  driverCar: { fontSize: 14, color: '#6b7280', marginBottom: 16 },
  actionsContainer: { flexDirection: 'row', gap: 12 },
  completeButton: { flex: 1, backgroundColor: '#facc15', borderRadius: 12, padding: 16, alignItems: 'center' },
  completeButtonText: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  cancelButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: '#fecaca', borderRadius: 12, padding: 16, backgroundColor: '#fff' },
  cancelButtonText: { fontSize: 16, fontWeight: '500', color: '#dc2626' },
});


