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
          <Text style={styles.btnText}>Soy Pasajero</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.btnConductor}
          onPress={() => router.push('/conductor')}
        >
          <Text style={styles.btnTextOutline}>Soy Conductor</Text>
        </TouchableOpacity>
      </View>
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
});