import { useRouter } from 'expo-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../firebaseConfig';

export default function RecuperarScreen() {
  const router = useRouter();
  const [correo, setCorreo] = useState('');
  const [cargando, setCargando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleEnviar = async () => {
    if (!correo.trim()) {
      Alert.alert('Falta el correo', 'Ingresa tu correo electronico');
      return;
    }

    setCargando(true);
    try {
      await sendPasswordResetEmail(auth, correo);
      setEnviado(true);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        Alert.alert('Correo no encontrado', 'No existe una cuenta con ese correo');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Correo invalido', 'Revisa que el correo este bien escrito');
      } else {
        Alert.alert('Error', 'No se pudo enviar el correo, intenta de nuevo');
      }
    } finally {
      setCargando(false);
    }
  };

  if (enviado) {
    return (
      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.emoji}>📧</Text>
          <Text style={styles.title}>Revisa tu correo</Text>
          <Text style={styles.subtitle}>
            Enviamos un enlace a {correo} para que puedas restablecer tu contraseña.
          </Text>
        </View>

        <TouchableOpacity style={styles.btn} onPress={() => router.push('/login')}>
          <Text style={styles.btnText}>Volver a iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar contraseña</Text>
      <Text style={styles.subtitle}>
        Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
      </Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          keyboardType="email-address"
          autoCapitalize="none"
          value={correo}
          onChangeText={setCorreo}
        />

        <TouchableOpacity style={styles.btn} onPress={handleEnviar} disabled={cargando}>
          {cargando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.btnText}>Enviar enlace</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.link}>Volver a iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
    justifyContent: 'center',
  },
  hero: {
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
  },
  emoji: {
    fontSize: 64,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F97316',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  btn: {
    backgroundColor: '#F97316',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    color: '#F97316',
    textAlign: 'center',
    fontSize: 15,
  },
});