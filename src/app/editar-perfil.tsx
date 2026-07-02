import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function EditarPerfilScreen() {
  const router = useRouter();
  const [nombre, setNombre] = useState('Jesus Emanuel');
  const [correo, setCorreo] = useState('jesus@gmail.com');
  const [telefono, setTelefono] = useState('987654321');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>JE</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.cambiarFoto}>Cambiar foto</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.campo}>
          <Text style={styles.label}>Nombre completo</Text>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
          />
        </View>

        <View style={styles.campo}>
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.campo}>
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
          />
        </View>

        <TouchableOpacity 
          style={styles.btnGuardar}
          onPress={() => router.back()}
        >
          <Text style={styles.btnGuardarText}>Guardar cambios</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.link}>Cancelar</Text>
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
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F97316',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F97316',
  },
  cambiarFoto: {
    color: '#F97316',
    fontSize: 14,
    fontWeight: '600',
  },
  form: {
    paddingHorizontal: 24,
    gap: 16,
  },
  campo: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },
  btnGuardar: {
    backgroundColor: '#F97316',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  btnGuardarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: '#6B7280',
    textAlign: 'center',
    fontSize: 15,
    marginTop: 8,
    marginBottom: 24,
  },
});