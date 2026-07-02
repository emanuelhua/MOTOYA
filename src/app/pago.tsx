import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PagoScreen() {
  const router = useRouter();
  const [metodoPago, setMetodoPago] = useState('efectivo');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Confirmar viaje</Text>
        <Text style={styles.subtitle}>Revisa los detalles antes de solicitar</Text>
      </View>

      <View style={styles.rutaCard}>
        <View style={styles.rutaItem}>
          <Text style={styles.rutaIcono}>📍</Text>
          <View>
            <Text style={styles.rutaLabel}>Origen</Text>
            <Text style={styles.rutaTexto}>Jr. Próspero 123</Text>
          </View>
        </View>
        <View style={styles.rutaLineaVertical} />
        <View style={styles.rutaItem}>
          <Text style={styles.rutaIcono}>🏁</Text>
          <View>
            <Text style={styles.rutaLabel}>Destino</Text>
            <Text style={styles.rutaTexto}>Av. La Marina 452</Text>
          </View>
        </View>
      </View>

      <View style={styles.tarifaCard}>
        <View style={styles.tarifaRow}>
          <Text style={styles.tarifaLabel}>Distancia</Text>
          <Text style={styles.tarifaValor}>1.2 km</Text>
        </View>
        <View style={styles.tarifaRow}>
          <Text style={styles.tarifaLabel}>Tiempo estimado</Text>
          <Text style={styles.tarifaValor}>6 min</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.tarifaRow}>
          <Text style={styles.tarifaTotal}>Total a pagar</Text>
          <Text style={styles.tarifaTotalValor}>S/ 3.50</Text>
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
        onPress={() => router.push('/calificacion')}
      >
        <Text style={styles.btnConfirmarText}>Confirmar y solicitar</Text>
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
    fontSize: 15,
    color: '#111827',
    fontWeight: '600',
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