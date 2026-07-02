import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const viajes = [
  {
    id: 1,
    fecha: 'Hoy, 10:30 am',
    origen: 'Jr. Próspero 123',
    destino: 'Av. La Marina 452',
    precio: 'S/ 3.50',
    calificacion: 5,
    conductor: 'Carlos Quispe',
  },
  {
    id: 2,
    fecha: 'Ayer, 3:15 pm',
    origen: 'Plaza de Armas',
    destino: 'Mercado Belén',
    precio: 'S/ 2.00',
    calificacion: 4,
    conductor: 'Pedro Huanca',
  },
  {
    id: 3,
    fecha: '28 Jun, 8:00 am',
    origen: 'Hospital Regional',
    destino: 'Jr. Putumayo 456',
    precio: 'S/ 4.00',
    calificacion: 5,
    conductor: 'Luis Panduro',
  },
];

export default function HistorialScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Viajes</Text>
        <Text style={styles.subtitle}>{viajes.length} viajes realizados</Text>
      </View>

      <ScrollView style={styles.lista} showsVerticalScrollIndicator={false}>
        {viajes.map((viaje) => (
          <View key={viaje.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.fecha}>{viaje.fecha}</Text>
              <Text style={styles.precio}>{viaje.precio}</Text>
            </View>

            <View style={styles.ruta}>
              <Text style={styles.rutaTexto}>📍 {viaje.origen}</Text>
              <Text style={styles.rutaLinea}>|</Text>
              <Text style={styles.rutaTexto}>🏁 {viaje.destino}</Text>
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.conductor}>👨‍✈️ {viaje.conductor}</Text>
              <Text style={styles.estrellas}>
                {'⭐'.repeat(viaje.calificacion)}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

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
  btnVolver: {
    alignItems: 'center',
    padding: 16,
  },
  btnVolverText: {
    color: '#F97316',
    fontSize: 15,
  },
});