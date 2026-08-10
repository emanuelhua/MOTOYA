import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Linking, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../firebaseConfig';

interface ViajeSolicitud {
  id: string;
  pasajeroNombre: string;
  origen: string;
  origenLat: number | null;
  origenLng: number | null;
  destino: string;
  tarifa: number;
  metodoPago: string;
  estado: string;
}

export default function ConductorScreen() {
  const router = useRouter();
  const [disponible, setDisponible] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [nombreConductor, setNombreConductor] = useState('');
  const [viaje, setViaje] = useState<ViajeSolicitud | null>(null);
  const [procesando, setProcesando] = useState(false);
  const [uid, setUid] = useState<string | null>(null);
  const watchSubscription = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setNombreConductor(user.email || 'Conductor');
        setUid(user.uid);
      } else {
        setUid(null);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!uid) return;

    const q = query(
      collection(db, 'viajes'),
      where('conductorId', '==', uid),
      where('estado', 'in', ['pendiente', 'en_curso'])
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        console.log('Viajes encontrados para este conductor:', snapshot.docs.length);
        if (!snapshot.empty) {
          const d = snapshot.docs[0];
          setViaje({ id: d.id, ...d.data() } as ViajeSolicitud);
        } else {
          setViaje(null);
        }
      },
      (error) => {
        console.log('ERROR en la consulta de viajes:', error);
      }
    );

    return () => unsubscribe();
  }, [uid]);

  // Mientras el viaje esta en curso, comparte la ubicacion real del conductor cada pocos segundos
  useEffect(() => {
    const iniciarSeguimiento = async () => {
      if (!viaje || viaje.estado !== 'en_curso') return;

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      watchSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        async (posicion) => {
          try {
            await updateDoc(doc(db, 'viajes', viaje.id), {
              conductorLat: posicion.coords.latitude,
              conductorLng: posicion.coords.longitude,
            });
          } catch (err) {
            console.log('Error actualizando ubicacion del conductor:', err);
          }
        }
      );
    };

    iniciarSeguimiento();

    return () => {
      if (watchSubscription.current) {
        watchSubscription.current.remove();
        watchSubscription.current = null;
      }
    };
  }, [viaje?.id, viaje?.estado]);

  const toggleDisponible = async (valor: boolean) => {
    if (!uid) return;

    setCargando(true);
    setDisponible(valor);

    try {
      await updateDoc(doc(db, 'conductores', uid), {
        disponible: valor,
      });
    } catch (error) {
      console.log('Error al actualizar disponibilidad:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleAceptar = async () => {
    if (!viaje) return;
    setProcesando(true);
    try {
      await updateDoc(doc(db, 'viajes', viaje.id), { estado: 'en_curso' });
    } finally {
      setProcesando(false);
    }
  };

  const handleRechazar = async () => {
    if (!viaje) return;
    setProcesando(true);
    setViaje(null);
    try {
      const q = query(collection(db, 'conductores'), where('disponible', '==', true));
      const snapshot = await getDocs(q);
      const otro = snapshot.docs.find((d) => d.id !== uid);

      if (otro) {
        const otroData = otro.data();
        await updateDoc(doc(db, 'viajes', viaje.id), {
          conductorId: otro.id,
          conductorNombre: otroData.nombre,
          conductorPlaca: otroData.placa,
          conductorCalificacion: otroData.calificacion || 5.0,
        });
      } else {
        await updateDoc(doc(db, 'viajes', viaje.id), { estado: 'cancelado' });
      }

      if (uid) {
        await updateDoc(doc(db, 'conductores', uid), { disponible: true });
      }
    } finally {
      setProcesando(false);
    }
  };

  const handleFinalizarViaje = async () => {
    if (!viaje) return;
    setProcesando(true);
    try {
      await updateDoc(doc(db, 'viajes', viaje.id), { estado: 'completado' });
    } finally {
      setProcesando(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Panel Conductor</Text>
        <Text style={styles.subtitle}>{nombreConductor}</Text>
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>¿Estás disponible?</Text>
        {cargando ? (
          <ActivityIndicator color="#F97316" />
        ) : (
          <Switch
            value={disponible}
            onValueChange={toggleDisponible}
            trackColor={{ false: '#D1D5DB', true: '#F97316' }}
            thumbColor={disponible ? '#FFFFFF' : '#FFFFFF'}
            disabled={!!viaje}
          />
        )}
        <Text style={[styles.statusText, { color: disponible ? '#16A34A' : '#6B7280' }]}>
          {viaje?.estado === 'pendiente'
            ? '🔔 Nueva solicitud'
            : viaje?.estado === 'en_curso'
            ? '🚕 En viaje - compartiendo ubicación'
            : disponible
            ? '🟢 En línea - visible para pasajeros'
            : '🔴 Fuera de línea'}
        </Text>
      </View>

      {viaje?.estado === 'pendiente' && (
        <View style={styles.solicitudCard}>
          <Text style={styles.solicitudTitle}>🛺 Nueva solicitud</Text>
          <Text style={styles.solicitudInfo}>Pasajero: {viaje.pasajeroNombre}</Text>
          <Text style={styles.solicitudInfo}>Origen: {viaje.origen}</Text>
          {viaje.origenLat && viaje.origenLng && (
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(`https://www.google.com/maps?q=${viaje.origenLat},${viaje.origenLng}`)
              }
            >
              <Text style={styles.linkMapa}>📍 Ver ubicación del pasajero en el mapa</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.solicitudInfo}>Destino: {viaje.destino}</Text>
          <Text style={styles.solicitudInfo}>
            Pago: S/ {viaje.tarifa.toFixed(2)} ({viaje.metodoPago})
          </Text>

          <View style={styles.solicitudBtns}>
            <TouchableOpacity style={styles.btnAceptar} onPress={handleAceptar} disabled={procesando}>
              {procesando ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.btnText}>Aceptar</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnRechazar} onPress={handleRechazar} disabled={procesando}>
              <Text style={styles.btnText}>Rechazar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {viaje?.estado === 'en_curso' && (
        <View style={styles.solicitudCard}>
          <Text style={styles.solicitudTitle}>🛺 Viaje en curso</Text>
          <Text style={styles.solicitudInfo}>Pasajero: {viaje.pasajeroNombre}</Text>
          {viaje.origenLat && viaje.origenLng && (
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(`https://www.google.com/maps?q=${viaje.origenLat},${viaje.origenLng}`)
              }
            >
              <Text style={styles.linkMapa}>📍 Ver ubicación del pasajero en el mapa</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.solicitudInfo}>Destino: {viaje.destino}</Text>
          <Text style={styles.solicitudInfo}>Pago: S/ {viaje.tarifa.toFixed(2)}</Text>
          <Text style={styles.trackingTexto}>📡 Tu ubicacion se esta compartiendo con el pasajero</Text>

          <TouchableOpacity style={styles.btnFinalizar} onPress={handleFinalizarViaje} disabled={procesando}>
            {procesando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.btnFinalizarText}>Marcar como finalizado</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {!viaje && disponible && (
        <View style={styles.solicitudCard}>
          <Text style={styles.solicitudTitle}>🛺 Esperando solicitudes</Text>
          <Text style={styles.solicitudInfo}>
            Ahora apareces disponible en el mapa de los pasajeros cercanos.
          </Text>
        </View>
      )}

      <TouchableOpacity onPress={() => router.push('/perfil')} style={styles.btnVolver}>
        <Text style={styles.btnVolverText}>Ver mi perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
    gap: 20,
  },
  header: {
    marginTop: 40,
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
  statusCard: {
    backgroundColor: '#F9FAFB',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  solicitudCard: {
    backgroundColor: '#FFF7ED',
    padding: 24,
    borderRadius: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#F97316',
  },
  solicitudTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F97316',
    marginBottom: 8,
  },
  solicitudInfo: {
    fontSize: 15,
    color: '#374151',
  },
  trackingTexto: {
    fontSize: 13,
    color: '#16A34A',
    fontWeight: '600',
    marginTop: 4,
  },
  linkMapa: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
    marginTop: 4,
  },
  solicitudBtns: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  btnAceptar: {
    flex: 1,
    backgroundColor: '#16A34A',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnRechazar: {
    flex: 1,
    backgroundColor: '#DC2626',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnFinalizar: {
    backgroundColor: '#16A34A',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  btnFinalizarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  btnVolver: {
    alignItems: 'center',
  },
  btnVolverText: {
    color: '#F97316',
    fontSize: 15,
  },
});