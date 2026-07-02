import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PerfilScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>JE</Text>
        </View>
        <Text style={styles.nombre}>Jesus Emanuel</Text>
        <Text style={styles.correo}>jesus@gmail.com</Text>
        <Text style={styles.telefono}>📱 +51 987 654 321</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>24</Text>
          <Text style={styles.statLabel}>Viajes</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>4.8</Text>
          <Text style={styles.statLabel}>Calificación</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>S/68</Text>
          <Text style={styles.statLabel}>Gastado</Text>
        </View>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/historial')}>
          <Text style={styles.menuEmoji}>🗒️</Text>
          <Text style={styles.menuTexto}>Mis viajes</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuEmoji}>🔔</Text>
          <Text style={styles.menuTexto}>Notificaciones</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuEmoji}>🔒</Text>
          <Text style={styles.menuTexto}>Seguridad</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/notificaciones')}>
          <Text style={styles.menuEmoji}>🔔</Text>
          <Text style={styles.menuTexto}>Notificaciones</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuEmoji}>❓</Text>
          <Text style={styles.menuTexto}>Ayuda</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.menuItem, styles.menuItemRojo]}
          onPress={() => router.push('/')}
        >
          <Text style={styles.menuEmoji}>🚪</Text>
          <Text style={styles.menuTextoRojo}>Cerrar sesión</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#F97316',
    padding: 32,
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F97316',
  },
  nombre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  correo: {
    fontSize: 14,
    color: '#FED7AA',
  },
  telefono: {
    fontSize: 14,
    color: '#FED7AA',
  },
  statsRow: {
    flexDirection: 'row',
    padding: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statNum: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F97316',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  menu: {
    paddingHorizontal: 24,
    gap: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  menuItemRojo: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FFF5F5',
  },
  menuEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  menuTexto: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  menuTextoRojo: {
    flex: 1,
    fontSize: 16,
    color: '#DC2626',
  },
  menuArrow: {
    fontSize: 20,
    color: '#9CA3AF',
  },
});