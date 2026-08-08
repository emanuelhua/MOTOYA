import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLocation } from '../hooks/useLocation';

export default function MapaScreen() {
  const router = useRouter();
  const { location, errorMsg, loading } = useLocation();

  return (
    <View style={styles.container}>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapEmoji}>🗺️</Text>
        <Text style={styles.mapText}>Mapa de Iquitos</Text>

        {loading && (
          <>
            <ActivityIndicator color="#F97316" />
            <Text style={styles.mapSubtext}>Obteniendo tu ubicacion...</Text>
          </>
        )}

        {!loading && location && (
          <Text style={styles.mapSubtext}>
            📍 Lat: {location.latitude.toFixed(4)}, Lng: {location.longitude.toFixed(4)}
          </Text>
        )}

        {!loading && errorMsg && (
          <Text style={styles.mapSubtext}>⚠️ {errorMsg}</Text>
        )}
      </View>

      <View style={styles.bottomCard}>
        <Text style={styles.cardTitle}>¿A dónde vamos?</Text>
        <Text style={styles.cardSubtitle}>Toca el mapa para elegir tu destino</Text>

        <TouchableOpacity style={styles.btn} onPress={() => router.push('/pago')}>
          <Text style={styles.btnText}>Solicitar MotoYa 🛺</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/historial')}>
          <Text style={styles.link}>Historial</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/mapa')}>
          <Text style={styles.link}>Mapa</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/perfil')}>
          <Text style={styles.link}>Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.link}>Volver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  mapEmoji: {
    fontSize: 64,
  },
  mapText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
  },
  mapSubtext: {
    fontSize: 16,
    color: '#6B7280',
  },
  bottomCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  btn: {
    backgroundColor: '#F97316',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    color: '#F97316',
    textAlign: 'center',
    fontSize: 15,
  },
});