import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function ConductorScreen() {
  const router = useRouter();
  const [disponible, setDisponible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Panel Conductor</Text>
        <Text style={styles.subtitle}>Bienvenido, conductor</Text>
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>¿Estás disponible?</Text>
        <Switch
          value={disponible}
          onValueChange={setDisponible}
          trackColor={{ false: '#D1D5DB', true: '#F97316' }}
          thumbColor={disponible ? '#FFFFFF' : '#FFFFFF'}
        />
        <Text style={[styles.statusText, { color: disponible ? '#16A34A' : '#6B7280' }]}>
          {disponible ? '🟢 En línea' : '🔴 Fuera de línea'}
        </Text>
      </View>

      {disponible && (
        <View style={styles.solicitudCard}>
          <Text style={styles.solicitudTitle}>🛺 Nueva solicitud</Text>
          <Text style={styles.solicitudInfo}>Pasajero: Juan Pérez</Text>
          <Text style={styles.solicitudInfo}>Distancia: 500m</Text>
          <Text style={styles.solicitudInfo}>Destino: Av. La Marina 452</Text>

          <View style={styles.solicitudBtns}>
            <TouchableOpacity style={styles.btnAceptar}>
              <Text style={styles.btnText}>Aceptar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnRechazar}>
              <Text style={styles.btnText}>Rechazar</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    fontSize: 16,
    color: '#374151',
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
  btnVolver: {
    alignItems: 'center',
  },
  btnVolverText: {
    color: '#F97316',
    fontSize: 15,
  },
});