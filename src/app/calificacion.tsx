import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CalificacionScreen() {
  const router = useRouter();
  const [estrellas, setEstrellas] = useState(0);

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.emoji}>🎉</Text>
        <Text style={styles.title}>¡Viaje completado!</Text>
        <Text style={styles.subtitle}>¿Cómo estuvo tu conductor?</Text>
      </View>

      <View style={styles.conductorCard}>
        <Text style={styles.conductorEmoji}>👨‍✈️</Text>
        <Text style={styles.conductorNombre}>Carlos Quispe</Text>
        <Text style={styles.conductorInfo}>Mototaxi • Placa: IQ-1234</Text>
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

      <TouchableOpacity 
        style={[styles.btn, estrellas === 0 && styles.btnDisabled]}
        onPress={() => router.push('/')}
        disabled={estrellas === 0}
      >
        <Text style={styles.btnText}>Enviar calificación</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/')}>
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
    gap: 24,
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
    fontSize: 48,
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