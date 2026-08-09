import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.emoji}>🛺</Text>
        <Text style={styles.title}>MotoYa</Text>
        <Text style={styles.subtitle}>Tu mototaxi en segundos</Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity 
          style={styles.btnPasajero}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.btnText}>Iniciar sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.btnConductor}
          onPress={() => router.push('/registro')}
        >
          <Text style={styles.btnTextOutline}>Crear cuenta nueva</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.hint}>
        Al registrarte eliges si eres pasajero o conductor
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 60,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#F97316',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
  },
  buttons: {
    width: '100%',
    gap: 16,
  },
  btnPasajero: {
    backgroundColor: '#F97316',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  btnConductor: {
    borderWidth: 2,
    borderColor: '#F97316',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnTextOutline: {
    color: '#F97316',
    fontSize: 18,
    fontWeight: 'bold',
  },
  hint: {
    marginTop: 20,
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});