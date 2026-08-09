import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from '../firebaseConfig';

interface Viaje {
  conductorId: string;
  conductorNombre: string;
  conductorPlaca: string;
}

export default function CalificacionScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [estrellas, setEstrellas] = useState(0);
  const [comentario, setComentario] = useState('');
  const [viaje, setViaje] = useState<Viaje | null>(null);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const cargarViaje = async () => {
      if (!id) return;
      const viajeDoc = await getDoc(doc(db, 'viajes', id));
      if (viajeDoc.exists()) {
        setViaje(viajeDoc.data() as Viaje);
      }
      setCargando(false);
    };
    cargarViaje();
  }, [id]);

  const liberarConductor = async () => {
    if (viaje?.conductorId) {
      await updateDoc(doc(db, 'conductores', viaje.conductorId), {
        disponible: true,
      });
    }
  };

  const handleEnviar = async () => {
    if (!id || estrellas === 0) return;
    setEnviando(true);
    try {
      await updateDoc(doc(db, 'viajes', id), {
        calificacion: estrellas,
        comentario: comentario.trim() || null,
      });
      await liberarConductor();
      router.push('/mapa');
    } finally {
      setEnviando(false);
    }
  };

  const handleOmitir = async () => {
    await liberarConductor();
    router.push('/mapa');
  };

  if (cargando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#F97316" size="large" />
      </View>
    );
  }

  const iniciales = viaje
    ? viaje.conductorNombre.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()
    : '??';

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.emoji}>🎉</Text>
        <Text style={styles.title}>¡Viaje completado!</Text>
        <Text style={styles.subtitle}>¿Cómo estuvo tu conductor?</Text>
      </View>

      <View style={styles.conductorCard}>
        <Text style={styles.conductorEmoji}>{iniciales}</Text>
        <Text style={styles.conductorNombre}>{viaje?.conductorNombre}</Text>
        <Text style={styles.conductorInfo}>Mototaxi • Placa: {viaje?.conductorPlaca}</Text>
      </View>

      <View style={styles.estrellasContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setEstrellas(star)}>
            <Text style={styles.estrella}>
              {star <= estrellas ? '⭐' : '☆'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.calificacionText}>
        {estrellas === 0 && 'Toca para calificar'}
        {estrellas === 1 && 'Muy malo'}
        {estrellas === 2 && 'Malo'}
        {estrellas === 3 && 'Regular'}
        {estrellas === 4 && 'Bueno'}
        {estrellas === 5 && '¡Excelente!'}
      </Text>

      <TextInput
        style={styles.comentarioInput}
        placeholder="Cuéntanos más sobre tu viaje (opcional)"
        placeholderTextColor="#9CA3AF"
        multiline
        numberOfLines={3}
        value={comentario}
        onChangeText={setComentario}
      />

      <TouchableOpacity
        style={[styles.btn, estrellas === 0 && styles.btnDisabled]}
        onPress={handleEnviar}
        disabled={estrellas === 0 || enviando}
      >
        {enviando ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.btnText}>Enviar calificación</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={handleOmitir}>
        <Text style={styles.link}>Omitir</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hero: {
    alignItems: 'center',
    gap: 8,
  },
  emoji: {
    fontSize: 64,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  conductorCard: {
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 4,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  conductorEmoji: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F97316',
  },
  conductorNombre: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  conductorInfo: {
    fontSize: 14,
    color: '#6B7280',
  },
  estrellasContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  estrella: {
    fontSize: 48,
  },
  calificacionText: {
    fontSize: 18,
    color: '#F97316',
    fontWeight: '600',
  },
  comentarioInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#111827',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  btn: {
    backgroundColor: '#F97316',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  btnDisabled: {
    backgroundColor: '#D1D5DB',
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    color: '#6B7280',
    fontSize: 15,
  },
});