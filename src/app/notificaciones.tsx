import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const notificaciones = [
  {
    id: 1,
    tipo: 'viaje',
    titulo: 'Viaje completado',
    mensaje: 'Tu viaje con Carlos Quispe finalizó correctamente',
    tiempo: 'Hace 5 min',
    leido: false,
  },
  {
    id: 2,
    tipo: 'promo',
    titulo: '🎉 Descuento especial',
    mensaje: 'Tienes 20% de descuento en tu próximo viaje',
    tiempo: 'Hace 2 horas',
    leido: false,
  },
  {
    id: 3,
    tipo: 'sistema',
    titulo: 'Actualización disponible',
    mensaje: 'Actualiza MotoYa para nuevas funciones',
    tiempo: 'Ayer',
    leido: true,
  },
  {
    id: 4,
    tipo: 'viaje',
    titulo: 'Calificación recibida',
    mensaje: 'Pedro te calificó con 5 estrellas',
    tiempo: '28 Jun',
    leido: true,
  },
];

const iconos: Record<string, string> = {
  viaje: '🛺',
  promo: '🎁',
  sistema: '⚙️',
};

export default function NotificacionesScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notificaciones</Text>
        <Text style={styles.subtitle}>2 sin leer</Text>
      </View>

      <ScrollView style={styles.lista} showsVerticalScrollIndicator={false}>
        {notificaciones.map((n) => (
          <View key={n.id} style={[styles.card, !n.leido && styles.cardNoLeido]}>
            <Text style={styles.icono}>{iconos[n.tipo]}</Text>
            <View style={styles.info}>
              <Text style={styles.notifTitulo}>{n.titulo}</Text>
              <Text style={styles.notifMensaje}>{n.mensaje}</Text>
              <Text style={styles.notifTiempo}>{n.tiempo}</Text>
            </View>
            {!n.leido && <View style={styles.puntoNoLeido} />}
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
    marginBottom: 20,
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
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
    alignItems: 'flex-start',
  },
  cardNoLeido: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FDBA74',
  },
  icono: {
    fontSize: 24,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  notifTitulo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
  },
  notifMensaje: {
    fontSize: 13,
    color: '#6B7280',
  },
  notifTiempo: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  puntoNoLeido: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F97316',
    marginTop: 4,
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