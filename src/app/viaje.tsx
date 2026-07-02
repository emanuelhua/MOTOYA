import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ViajeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapEmoji}>🛺</Text>
        <Text style={styles.mapText}>Tu conductor va en camino</Text>
        <Text style={styles.mapSubtext}>Llegada estimada: 4 min</Text>
      </View>

      <View style={styles.bottomCard}>
        <View style={styles.conductorRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>CQ</Text>
          </View>
          <View style={styles.conductorInfo}>
            <Text style={styles.conductorNombre}>Carlos Quispe</Text>
            <Text style={styles.conductorDetalle}>Mototaxi • Placa IQ-1234</Text>
          </View>
          <Text style={styles.calificacion}>⭐ 4.9</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.estadoRow}>
          <Text style={styles.estadoEmoji}>📍</Text>
          <Text style={styles.estadoTexto}>El conductor está a 500m de tu ubicación</Text>
        </View>

        <View style={styles.botonesRow}>
          <TouchableOpacity style={styles.btnLlamar}>
            <Text style={styles.btnLlamarText}>📞 Llamar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnMensaje}>
            <Text style={styles.btnMensajeText}>💬 Mensaje</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.btnFinalizar}
          onPress={() => router.push('/pago')}
        >
          <Text style={styles.btnFinalizarText}>Simular llegada</Text>
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
  botonesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  btnLlamar: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  btnLlamarText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  btnMensaje: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  btnMensajeText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
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