import { useRouter } from 'expo-router';
import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { useLocation } from '../hooks/useLocation';
import { calcularTarifa } from '../utils/calcularTarifa';

export default function PagoScreen() {
  const router = useRouter();
  const { location } = useLocation();
  const [destino, setDestino] = useState('');
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [cargando, setCargando] = useState(false);
  const [distanciaKm] = useState(() => Number((Math.random() * 3.2 + 0.8).toFixed(1)));

  const tarifa = calcularTarifa(distanciaKm);

  const origenTexto = location
    ? `Mi ubicacion (${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)})`
    : 'Ubicacion no disponible';

  const handleConfirmar = async () => {
    if (!destino.trim()) {
      Alert.alert('Falta el destino', 'Escribe a donde quieres ir');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'Debes iniciar sesion');
      return;
    }

    setCargando(true);
    try {
      const usuarioDoc = await getDoc(doc(db, 'usuarios', user.uid));
      const pasajeroNombre = usuarioDoc.exists() ? usuarioDoc.data().nombre : 'Pasajero';

      const q = query(collection(db, 'conductores'), where('disponible', '==', true));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        Alert.alert('Sin conductores', 'No hay mototaxis disponibles en este momento');
        setCargando(false);
        return;
      }

      const conductorDoc = snapshot.docs[0];
      const conductorData = conductorDoc.data();

      const viajeRef = await addDoc(collection(db, 'viajes'), {
        pasajeroId: user.uid,
        pasajeroNombre,
        conductorId: conductorDoc.id,
        conductorNombre: conductorData.nombre,
        conductorPlaca: conductorData.placa,
        conductorCalificacion: conductorData.calificacion || 5.0,
        origen: origenTexto,
        origenLat: location?.latitude || null,
        origenLng: location?.longitude || null,
        destino,
        distanciaKm,
        tarifa,
        metodoPago,
        estado: 'pendiente',
        calificacion: null,
        creadoEn: new Date().toISOString(),
      });

      await updateDoc(doc(db, 'conductores', conductorDoc.id), {
        disponible: false,
      });

      router.push(`/viaje?id=${viajeRef.id}`);
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear la solicitud de viaje');
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Confirmar viaje</Text>
        <Text style={styles.subtitle}>Revisa los detalles antes de solicitar</Text>
      </View>

      <View style={styles.rutaCard}>
        <View style={styles.rutaItem}>
          <Text style={styles.rutaIcono}>📍</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.rutaLabel}>Origen</Text>
            <Text style={styles.rutaTexto}>{origenTexto}</Text>
          </View>
        </View>
        <View style={styles.rutaLineaVertical} />
        <View style={styles.rutaItem}>
          <Text style={styles.rutaIcono}>🏁</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.rutaLabel}>Destino</Text>
            <TextInput
              style={styles.destinoInput}
              placeholder="Escribe tu destino"
              value={destino}
              onChangeText={setDestino}
            />
          </View>
        </View>
      </View>

      <View style={styles.tarifaCard}>
        <View style={styles.tarifaRow}>
          <Text style={styles.tarifaLabel}>Distancia</Text>
          <Text style={styles.tarifaValor}>{distanciaKm} km</Text>
        </View>
        <View style={styles.tarifaRow}>
          <Text style={styles.tarifaLabel}>Tiempo estimado</Text>
          <Text style={styles.tarifaValor}>{Math.round(distanciaKm * 3.5)} min</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.tarifaRow}>
          <Text style={styles.tarifaTotal}>Total a pagar</Text>
          <Text style={styles.tarifaTotalValor}>S/ {tarifa.toFixed(2)}</Text>
        </View>
      </View>

      <Text style={styles.metodoLabel}>Metodo de pago</Text>
      <View style={styles.metodos}>
        <TouchableOpacity
          style={[styles.metodoBtn, metodoPago === 'efectivo' && styles.metodoBtnActivo]}
          onPress={() => setMetodoPago('efectivo')}
        >
          <Text style={styles.metodoEmoji}>💵</Text>
          <Text style={[styles.metodoTexto, metodoPago === 'efectivo' && styles.metodoTextoActivo]}>
            Efectivo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.metodoBtn, metodoPago === 'yape' && styles.metodoBtnActivo]}
          onPress={() => setMetodoPago('yape')}
        >
          <Text style={styles.metodoEmoji}>📱</Text>
          <Text style={[styles.metodoTexto, metodoPago === 'yape' && styles.metodoTextoActivo]}>
            Yape
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.btnConfirmar}
        onPress={handleConfirmar}
        disabled={cargando}
      >
        {cargando ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.btnConfirmarText}>Confirmar y solicitar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>Cancelar</Text>
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
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  rutaCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  rutaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rutaIcono: {
    fontSize: 20,
  },
  rutaLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  rutaTexto: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '600',
  },
  destinoInput: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '600',
    paddingVertical: 2,
  },
  rutaLineaVertical: {
    width: 1,
    height: 16,
    backgroundColor: '#D1D5DB',
    marginLeft: 10,
  },
  tarifaCard: {
    backgroundColor: '#FFF7ED',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F97316',
    gap: 10,
  },
  tarifaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tarifaLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  tarifaValor: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#FDBA74',
  },
  tarifaTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  tarifaTotalValor: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F97316',
  },
  metodoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  metodos: {
    flexDirection: 'row',
    gap: 12,
  },
  metodoBtn: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 4,
  },
  metodoBtnActivo: {
    borderColor: '#F97316',
    backgroundColor: '#FFF7ED',
  },
  metodoEmoji: {
    fontSize: 24,
  },
  metodoTexto: {
    fontSize: 14,
    color: '#6B7280',
  },
  metodoTextoActivo: {
    color: '#F97316',
    fontWeight: '600',
  },
  btnConfirmar: {
    backgroundColor: '#F97316',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  btnConfirmarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    color: '#6B7280',
    textAlign: 'center',
    fontSize: 15,
  },
});