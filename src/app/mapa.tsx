import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../firebaseConfig';
import { useLocation } from '../hooks/useLocation';

interface Conductor {
  id: string;
  nombre: string;
  placa: string;
  calificacion: number;
}

export default function MapaScreen() {
  const router = useRouter();
  const { location, errorMsg, loading } = useLocation();
  const [conductores, setConductores] = useState<Conductor[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'conductores'), where('disponible', '==', true));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Conductor[];
      setConductores(lista);
    });

    return () => unsubscribe();
  }, []);

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

        <Text style={styles.conductoresTexto}>
          {conductores.length > 0
            ? `🛺 ${conductores.length} mototaxi(s) disponible(s) cerca`
            : '🛺 No hay conductores disponibles ahora'}
        </Text>
      </View>

      <View style={styles.bottomCard}>
        <Text style={styles.cardTitle}>¿A dónde vamos?</Text>
        <Text style={styles.cardSubtitle}>Toca el mapa para elegir tu destino</Text>

        <TouchableOpacity
          style={[styles.btn, conductores.length === 0 && styles.btnDisabled]}
          onPress={() => router.push('/pago')}
          disabled={conductores.length === 0}
        >
          <Text style={styles.btnText}>Solicitar MotoYa 🛺</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/mapa')}>
          <Ionicons name="map" size={24} color="#F97316" />
          <Text style={styles.tabTextActivo}>Mapa</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/historial')}>
          <Ionicons name="time-outline" size={24} color="#9CA3AF" />
          <Text style={styles.tabText}>Historial</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/notificaciones')}>
          <Ionicons name="notifications-outline" size={24} color="#9CA3AF" />
          <Text style={styles.tabText}>Avisos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/perfil')}>
          <Ionicons name="person-outline" size={24} color="#9CA3AF" />
          <Text style={styles.tabText}>Perfil</Text>
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
  conductoresTexto: {
    fontSize: 15,
    color: '#F97316',
    fontWeight: '600',
    marginTop: 8,
  },
  bottomCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    gap: 4,
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
  btnDisabled: {
    backgroundColor: '#D1D5DB',
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 10,
    paddingBottom: 20,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  tabText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  tabTextActivo: {
    fontSize: 12,
    color: '#F97316',
    fontWeight: '600',
  },
});