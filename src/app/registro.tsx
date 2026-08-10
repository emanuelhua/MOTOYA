import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../firebaseConfig';

export default function RegistroScreen() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [verPassword, setVerPassword] = useState(false);
  const [rol, setRol] = useState<'pasajero' | 'conductor'>('pasajero');
  const [placa, setPlaca] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleRegistro = async () => {
    if (!nombre || !correo || !telefono || !password) {
      Alert.alert('Faltan datos', 'Completa todos los campos');
      return;
    }
    if (rol === 'conductor' && !placa) {
      Alert.alert('Faltan datos', 'Ingresa la placa de tu mototaxi');
      return;
    }

    setCargando(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, correo, password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, 'usuarios', uid), {
        nombre,
        correo,
        telefono,
        rol,
        creadoEn: new Date().toISOString(),
      });

      if (rol === 'conductor') {
        await setDoc(doc(db, 'conductores', uid), {
          nombre,
          telefono,
          placa,
          calificacion: 5.0,
          disponible: false,
        });
      }

      Alert.alert('Cuenta creada', 'Registro exitoso');
      router.push(rol === 'conductor' ? '/conductor' : '/mapa');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Correo en uso', 'Ese correo ya tiene una cuenta registrada. Intenta iniciar sesión.');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Contraseña débil', 'La contraseña debe tener al menos 6 caracteres.');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Correo inválido', 'Revisa que el correo esté bien escrito.');
      } else {
        Alert.alert('Error al registrar', 'Ocurrió un problema, intenta de nuevo.');
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>
      <Text style={styles.subtitle}>Únete a MotoYa</Text>

      <View style={styles.form}>
        <View style={styles.rolRow}>
          <TouchableOpacity
            style={[styles.rolBtn, rol === 'pasajero' && styles.rolBtnActivo]}
            onPress={() => setRol('pasajero')}
          >
            <Text style={[styles.rolTexto, rol === 'pasajero' && styles.rolTextoActivo]}>
              🧍 Pasajero
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.rolBtn, rol === 'conductor' && styles.rolBtnActivo]}
            onPress={() => setRol('conductor')}
          >
            <Text style={[styles.rolTexto, rol === 'conductor' && styles.rolTextoActivo]}>
              🛺 Conductor
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Nombre completo"
          placeholderTextColor="#9CA3AF"
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
          value={correo}
          onChangeText={setCorreo}
        />
        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
          value={telefono}
          onChangeText={setTelefono}
        />

        {rol === 'conductor' && (
          <TextInput
            style={styles.input}
            placeholder="Placa del mototaxi (Ej: IQ-1234)"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="characters"
            value={placa}
            onChangeText={setPlaca}
          />
        )}

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Contraseña"
            placeholderTextColor="#9CA3AF"
            secureTextEntry={!verPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setVerPassword(!verPassword)}
          >
            <Ionicons
              name={verPassword ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color="#6B7280"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleRegistro} disabled={cargando}>
          {cargando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.btnText}>Registrarse</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F97316',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  form: {
    gap: 16,
  },
  rolRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  rolBtn: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  rolBtnActivo: {
    borderColor: '#F97316',
    backgroundColor: '#FFF7ED',
  },
  rolTexto: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '600',
  },
  rolTextoActivo: {
    color: '#F97316',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#111827',
  },
  eyeIcon: {
    paddingHorizontal: 14,
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