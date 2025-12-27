import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated as RNAnimated } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, AnimatedRegion } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../contexts/AppContext';
import { NavigationProp } from '../../lib/navigation';


export default function DriverNavigation() {
  const navigation = useNavigation<NavigationProp<'DriverNavigation'>>();
  const { activeRide, setActiveRide } = useApp();
  const insets = useSafeAreaInsets();


  // -----------------------------
  // ROUTE SIMULÉE (Dakar → Saint-Louis)
  // -----------------------------
  const route = [
    { latitude: 14.6928, longitude: -17.4467 },
    { latitude: 14.9, longitude: -17.2 },
    { latitude: 15.2, longitude: -16.9 },
    { latitude: 15.5, longitude: -16.8 },
    { latitude: 15.8, longitude: -16.6 },
    { latitude: 16.0165, longitude: -16.4897 },
  ];


  // -----------------------------
  // POSITION & ROTATION DU VEHICULE
  // -----------------------------
  const position = useRef(
    new AnimatedRegion({
      latitude: route[0].latitude,
      longitude: route[0].longitude,
      latitudeDelta: 0.04,
      longitudeDelta: 0.04,
    })
  ).current;


  const rotation = useRef(new RNAnimated.Value(0)).current;


  const computeAngle = (p1: any, p2: any) => {
    const dx = p2.longitude - p1.longitude;
    const dy = p2.latitude - p1.latitude;
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  };


  const animateCar = () => {
    let index = 0;


    const interval = setInterval(() => {
      if (index >= route.length - 1) {
        clearInterval(interval);
        return;
      }


      const current = route[index];
      const next = route[index + 1];


      // rotation
      const newAngle = computeAngle(current, next);
      RNAnimated.timing(rotation, {
        toValue: newAngle,
        duration: 600,
        useNativeDriver: false,
      }).start();


      // position
      position.timing({
        latitude: next.latitude,
        longitude: next.longitude,
        duration: 600,
        useNativeDriver: false,
      } as any).start(); // <-- correction TS


      index++;
    }, 600);
  };


  // -----------------------------
  // START / CANCEL RIDE
  // -----------------------------
  const handleStartRide = () => {
    if (activeRide) {
      setActiveRide({ ...activeRide, status: 'in_progress' });
    }
    animateCar();
  };


  const handleCancelRide = () => {
    Alert.alert(
      'Annuler la course ?',
      'Êtes-vous sûr de vouloir annuler cette course ?',
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui',
          style: 'destructive',
          onPress: () => {
            setActiveRide(null);
            navigation.navigate('DriverDashboard' as any);
          },
        },
      ]
    );
  };


  // -----------------------------
  // INTERPOLATION DE ROTATION
  // -----------------------------
  const rotateInterpolated = rotation.interpolate({
    inputRange: [-360, 360],
    outputRange: ['-360deg', '360deg'],
  });


  // -----------------------------
  // UI
  // -----------------------------
  return (
    <View style={styles.container}>
      {/* MAP */}
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: route[0].latitude,
            longitude: route[0].longitude,
            latitudeDelta: 2.5,
            longitudeDelta: 2.5,
          }}
        >
          {/* ROUTE */}
          <Polyline coordinates={route} strokeWidth={5} strokeColor="#facc15" />


          {/* MARKER VOITURE ANIMÉ */}
          <Marker.Animated
            coordinate={position as any} // cast pour TS
            anchor={{ x: 0.5, y: 0.5 }}
            flat
          >
            <RNAnimated.View style={{ transform: [{ rotate: rotateInterpolated }] }}>
              <Ionicons name="car-sport" size={38} color="#facc15" />
            </RNAnimated.View>
          </Marker.Animated>


          {/* MARKER DESTINATION */}
          <Marker
            coordinate={route[route.length - 1]}
            title="Destination"
            pinColor="gold"
          />
        </MapView>


        {/* INFO CARD */}
        <View style={[styles.infoBanner, { paddingTop: Math.max(insets.top + 8, 28) }]}>
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <TouchableOpacity
                onPress={() => navigation.navigate('DriverDashboard' as any)}
                style={styles.backButtonInCard}
              >
                <Ionicons name="chevron-back" size={20} color="#1f2937" />
              </TouchableOpacity>


              <View style={styles.infoContent}>
                <View style={styles.infoLeft}>
                  <Text style={styles.infoLabel}>Destination</Text>
                  <Text style={styles.infoDestination}>Saint-Louis</Text>
                  <Text style={styles.infoClient}>Client: Amadou Diallo</Text>
                </View>


                <View style={styles.infoRight}>
                  <Text style={styles.infoPrice}>15 000 F</Text>
                  <Text style={styles.infoSeats}>2 places</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>


      {/* CONTROLS */}
      <View style={styles.bottomContainer}>
        <View style={styles.controlsContainer}>
          <TouchableOpacity onPress={handleStartRide} style={styles.startButton}>
            <Ionicons name="navigate" size={20} color="#fff" />
            <Text style={styles.startButtonText}>Démarrer</Text>
          </TouchableOpacity>


          <TouchableOpacity style={styles.callButton}>
            <Ionicons name="call" size={20} color="#1f2937" />
          </TouchableOpacity>
        </View>


        <TouchableOpacity onPress={handleCancelRide} style={styles.cancelButton}>
          <Ionicons name="close" size={20} color="#dc2626" />
          <Text style={styles.cancelButtonText}>Annuler la course</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


// -----------------------------
// STYLES
// -----------------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  mapContainer: { flex: 1 },
  map: { flex: 1 },


  infoBanner: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 10,
    paddingHorizontal: 16,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  infoHeader: { flexDirection: 'row', alignItems: 'center' },
  backButtonInCard: { padding: 8, marginRight: 12 },
  infoContent: { flexDirection: 'row', flex: 1, justifyContent: 'space-between' },
  infoLeft: {},
  infoLabel: { color: '#6b7280', fontSize: 13 },
  infoDestination: { fontSize: 17, fontWeight: '600', color: '#111' },
  infoClient: { color: '#6b7280', marginTop: 4 },
  infoRight: { alignItems: 'flex-end' },
  infoPrice: { fontSize: 22, fontWeight: '700', color: '#facc15' },
  infoSeats: { fontSize: 14, color: '#6b7280' },


  bottomContainer: {
    padding: 20,
    backgroundColor: '#fff',
    elevation: 15,
  },
  controlsContainer: { flexDirection: 'row', marginBottom: 12, gap: 12 },
  startButton: {
    flex: 1,
    backgroundColor: '#22c55e',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  startButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  callButton: {
    width: 56,
    height: 56,
    backgroundColor: '#facc15',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#fecaca',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  cancelButtonText: { color: '#dc2626', fontWeight: '600' },
});


