import { useFocusEffect, useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../firebaseConfig';

interface Viaje {
  id: string;
  destino: string;
  origen: string;
  tarifa: number;
  conductorNombre: string;
  pasajeroNombre: string;
  calificacion: number | null;
  comentario?: string | null;
  creadoEn: string;
  estado: string;
}

function formatearFecha(iso: string) {
  const fecha = new Date(iso);
  return fecha.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function HistorialScreen() {
  const router = useRouter();
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rol, setRol] = useState<'pasajero' | 'conductor'>('pasajero');

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!user) {
          setCargando(false);
          return;
        }

        setCargando(true);
        setError(null);
        try {
          const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
          const rolUsuario = userDoc.exists() ? userDoc.data().rol || 'pasajero' : 'pasajero';
          setRol(rolUsuario);

          const campo = rolUsuario === 'conductor' ? 'conductorId' : 'pasajeroId';

          const q = query(
            collection(db, 'viajes'),
            where(campo, '==', user.uid),
            orderBy('creadoEn', 'desc')
          );
          const snapshot = await getDocs(q);
          const lista = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as Viaje[];
          console.log('Viajes encontrados en historial:', lista.length);
          setViajes(lista);
        } catch (err: any) {
          console.log('ERROR cargando historial:', err);
          setError(err.message || 'Error al cargar el historial');
        } finally {
          setCargando(false);
        }
      });

      return () => unsubscribe();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Viajes</Text>
        <Text style={styles.subtitle}>{viajes.length} viajes realizados</Text>
      </View>

      {cargando ? (
        <ActivityIndicator color="#F97316" size="large" style={{ marginTop: 40 }} />
      ) : error ? (
        <View style={styles.vacioContainer}>
          <Text style={styles.vacioEmoji}>⚠️</Text>
          <Text style={styles.vacioTexto}>{error}</Text>
        </View>
      ) : viajes.length === 0 ? (
        <View style={styles.vacioContainer}>
          <Text style={styles.vacioEmoji}>🛺</Text>
          <Text style={styles.vacioTexto}>Todavía no tienes viajes</Text>
        </View>
      ) : (
        <ScrollView style={styles.lista} showsVerticalScrollIndicator={false}>
          {viajes.map((viaje) => (
            <View key={viaje.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.fecha}>{formatearFecha(viaje.creadoEn)}</Text>
                <Text style={styles.precio}>S/ {viaje.tarifa.toFixed(2)}</Text>
              </View>

              <View style={styles.ruta}>
                <Text style={styles.rutaTexto}>📍 {viaje.origen}</Text>
                <Text style={styles.rutaLinea}>|</Text>
                <Text style={styles.rutaTexto}>🏁 {viaje.destino}</Text>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.conductor}>
                  {rol === 'conductor' ? `🧍 ${viaje.pasajeroNombre}` : `👨‍✈️ ${viaje.conductorNombre}`}
                </Text>
                <Text style={styles.estrellas}>
                  {viaje.calificacion ? '⭐'.repeat(viaje.calificacion) : 'Sin calificar'}
                </Text>
              </View>

              {viaje.comentario && (
                <Text style={styles.comentario}>"{viaje.comentario}"</Text>
              )}
            </View>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity onPress={() => router.back()} style={styles.btnVolver}>
        <Text style={styles.btnVolverText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
  },
  header: {
    marginTop: 40,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F97316',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  vacioContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
  },
  vacioEmoji: {
    fontSize: 48,
  },
  vacioTexto: {
    fontSize: 15,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  lista: {
    flex: 1,
  },
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fecha: {
    fontSize: 13,
    color: '#6B7280',
  },
  precio: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F97316',
  },
  ruta: {
    gap: 4,
  },
  rutaTexto: {
    fontSize: 14,
    color: '#374151',
  },
  rutaLinea: {
    color: '#D1D5DB',
    marginLeft: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conductor: {
    fontSize: 13,
    color: '#6B7280',
  },
  estrellas: {
    fontSize: 12,
  },
  comentario: {
    fontSize: 13,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  btnVolver: {
    alignItems: 'center',
    padding: 16,
  },
  btnVolverText: {
    color: '#F97316',
    fontSize: 15,
  },
});