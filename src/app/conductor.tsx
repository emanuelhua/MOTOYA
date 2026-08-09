import { useRouter } from 'expo-router';
import { doc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../firebaseConfig';

export default function ConductorScreen() {
  const router = useRouter();
  const [disponible, setDisponible] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [nombreConductor, setNombreConductor] = useState('');

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setNombreConductor(user.email || 'Conductor');
    }
  }, []);

  const toggleDisponible = async (valor: boolean) => {
    const user = auth.currentUser;
    if (!user) return;

    setCargando(true);
    setDisponible(valor);

    try {
      await updateDoc(doc(db, 'conductores', user.uid), {
        disponible: valor,
      });
    } catch (error) {
      console.log('Error al actualizar disponibilidad:', error);
    } finally {
      setCargando(false);
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
          />
        )}
        <Text style={[styles.statusText, { color: disponible ? '#16A34A' : '#6B7280' }]}>
          {disponible ? '🟢 En línea - visible para pasajeros' : '🔴 Fuera de línea'}
        </Text>
      </View>

      {disponible && (
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
  btnVolver: {
    alignItems: 'center',
  },
  btnVolverText: {
    color: '#F97316',
    fontSize: 15,
  },
});