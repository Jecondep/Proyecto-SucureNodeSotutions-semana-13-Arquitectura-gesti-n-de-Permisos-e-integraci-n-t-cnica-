import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Alert, 
  ScrollView, 
  ActivityIndicator 
} from 'react-native';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';

export default function App() {
  // --- ESTADOS PARA CÁMARA ---
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  // --- ESTADOS PARA GEOLOCALIZACIÓN ---
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // 1. Lógica de Permisos y Cámara (Captura 1, 3 y 4)
  const handleCameraAction = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasCameraPermission(status === 'granted');

    if (status === 'granted') {
      setIsCameraActive(true);
    } else {
      // Manejo de Errores: Permiso Denegado (Captura 4)
      Alert.alert(
        "AVISO DE SEGURIDAD",
        "Permiso de cámara denegado. La funcionalidad de captura está deshabilitada.",
        [{ text: "Entendido" }]
      );
    }
  };

  // 2. Lógica de Geolocalización (Captura 2)
  const getPosition = async () => {
    setLoadingLocation(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      setLocationError('Permiso de ubicación denegado');
      setLoadingLocation(false);
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation);
    setLoadingLocation(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brand}>SecureNode Solutions</Text>
        <Text style={styles.subtitle}>Panel de Control de Sensores</Text>
      </View>

      {/* SECCIÓN 1: GEOLOCALIZACIÓN (Captura 2) */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📍 Sensor de Ubicación</Text>
        <TouchableOpacity style={styles.btnBlue} onPress={getPosition}>
          <Text style={styles.btnText}>Obtener Coordenadas GPS</Text>
        </TouchableOpacity>
        
        {loadingLocation && <ActivityIndicator size="small" color="#007AFF" style={{marginTop: 10}} />}
        
        {location && (
          <View style={styles.resultBox}>
            <Text style={styles.dataText}>Latitud: {location.coords.latitude}</Text>
            <Text style={styles.dataText}>Longitud: {location.coords.longitude}</Text>
          </View>
        )}
        {locationError && <Text style={styles.errorText}>{locationError}</Text>}
      </View>

      {/* SECCIÓN 2: CÁMARA (Captura 1 y 3) */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📷 Sensor de Cámara</Text>
        {!isCameraActive ? (
          <TouchableOpacity style={styles.btnDark} onPress={handleCameraAction}>
            <Text style={styles.btnText}>Activar Hardware de Cámara</Text>
          </TouchableOpacity>
        ) : (
          <View>
            <Camera style={styles.cameraPreview} ref={ref => setCameraRef(ref)}>
              <TouchableOpacity 
                style={styles.captureCircle} 
                onPress={() => Alert.alert("SecureNode", "Foto capturada temporalmente.")}
              />
            </Camera>
            <TouchableOpacity 
              style={[styles.btnDark, {marginTop: 10, backgroundColor: '#ff4444'}]} 
              onPress={() => setIsCameraActive(false)}
            >
              <Text style={styles.btnText}>Cerrar Cámara</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Text style={styles.footer}>SecureNode Solutions v1.0 | 2026</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#f0f2f5', padding: 20, alignItems: 'center' },
  header: { marginBottom: 30, alignItems: 'center' },
  brand: { fontSize: 28, fontWeight: 'bold', color: '#1a1a1a' },
  subtitle: { fontSize: 16, color: '#666' },
  card: { backgroundColor: '#fff', borderRadius: 15, padding: 20, width: '100%', marginBottom: 20, elevation: 3 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  btnBlue: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center' },
  btnDark: { backgroundColor: '#2C3E50', padding: 15, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  resultBox: { marginTop: 15, padding: 10, backgroundColor: '#e8f0fe', borderRadius: 8 },
  dataText: { fontSize: 14, color: '#2C3E50', fontFamily: 'monospace' },
  errorText: { color: '#ff4444', marginTop: 10, fontWeight: 'bold' },
  cameraPreview: { width: '100%', height: 250, borderRadius: 10, overflow: 'hidden', justifyContent: 'flex-end', alignItems: 'center' },
  captureCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.7)', borderWidth: 4, borderColor: '#fff', marginBottom: 15 },
  footer: { marginTop: 20, color: '#999', fontSize: 12 }
});
