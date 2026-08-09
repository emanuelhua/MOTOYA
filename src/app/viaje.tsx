import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../firebaseConfig';

interface Viaje {
  conductorNombre: string;
  conductorPlaca: string;
  conductorCalificacion: number;
  destino: string;
  tarifa: number;
  estado: string;
}

export default function ViajeScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [viaje, setViaje] = useState<Viaje | null>(null);
  const [cargando, setCargando] = useState(true);
  const [finalizando, setFinalizando] = useState(false);

  useEffect(() => {
    if (!id) return;

    const unsubscribe = onSnapshot(doc(db, 'viajes', id), (snapshot) => {
      if (snapshot.exists()) {
        setViaje(snapshot.data() as Viaje);
      }
      setCargando(false);
    });

    return () => unsubscribe();
  }, [id]);

  const handleFinalizar = async () => {
    if (!id || !viaje) return;
    setFinalizando(true);
    try {
      await updateDoc(doc(db, 'viajes', id), { estado: 'completado' });
      router.push(`/calificacion?id=${id}`);
    } finally {
      setFinalizando(false);
    }
  };

  if (cargando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#F97316" size="large" />
      </View>
    );
  }

  if (!viaje) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No se encontro el viaje</Text>
      </View>
    );
  }

  if (viaje.estado === 'cancelado') {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.mapEmoji}>😕</Text>
        <Text style={styles.mapText}>No hay conductores disponibles</Text>
        <TouchableOpacity style={styles.btnFinalizar} onPress={() => router.push('/mapa')}>
          <Text style={styles.btnFinalizarText}>Volver al mapa</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (viaje.estado === 'pendiente') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#F97316" size="large" />
        <Text style={styles.mapText}>Esperando que un conductor acepte...</Text>
        <Text style={styles.mapSubtext}>Conductor asignado: {viaje.conductorNombre}</Text>
      </View>
    );
  }

  const iniciales = viaje.conductorNombre
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <View style={styles.container}>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapEmoji}>🛺</Text>
        <Text style={styles.mapText}>Tu conductor va en camino</Text>
        <Text style={styles.mapSubtext}>Destino: {viaje.destino}</Text>
      </View>

      <View style={styles.bottomCard}>
        <View style={styles.conductorRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{iniciales}</Text>
          </View>
          <View style={styles.conductorInfo}>
            <Text style={styles.conductorNombre}>{viaje.conductorNombre}</Text>
            <Text style={styles.conductorDetalle}>Mototaxi • Placa {viaje.conductorPlaca}</Text>
          </View>
          <Text style={styles.calificacion}>⭐ {viaje.conductorCalificacion.toFixed(1)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.estadoRow}>
          <Text style={styles.estadoEmoji}>💵</Text>
          <Text style={styles.estadoTexto}>Tarifa acordada: S/ {viaje.tarifa.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={styles.btnFinalizar}
          onPress={handleFinalizar}
          disabled={finalizando}
        >
          {finalizando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.btnFinalizarText}>Finalizar viaje</Text>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    padding: 24,
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
    textAlign: 'center',
  },
  mapSubtext: {
    fontSize: 16,
    color: '#F97316',
    fontWeight: '600',
  },
  bottomCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  conductorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F97316',
  },
  conductorInfo: {
    flex: 1,
  },
  conductorNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  conductorDetalle: {
    fontSize: 13,
    color: '#6B7280',
  },
  calificacion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F97316',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  estadoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF7ED',
    padding: 12,
    borderRadius: 12,
  },
  estadoEmoji: {
    fontSize: 18,
  },
  estadoTexto: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  btnFinalizar: {
    backgroundColor: '#F97316',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnFinalizarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});