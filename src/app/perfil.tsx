import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useProfileImage } from '../hooks/useProfileImage';

export default function EditarPerfilScreen() {
  const router = useRouter();
  const [nombre, setNombre] = useState('Jesus Emanuel');
  const [correo, setCorreo] = useState('jesus@gmail.com');
  const [telefono, setTelefono] = useState('987654321');
  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  const { imageUri, pickFromGallery, takePhoto } = useProfileImage();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.avatarImg} />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JE</Text>
          </View>
        )}

        {!mostrarOpciones ? (
          <TouchableOpacity onPress={() => setMostrarOpciones(true)}>
            <Text style={styles.cambiarFoto}>Cambiar foto</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.opcionesFoto}>
            <TouchableOpacity
              style={styles.opcionBtn}
              onPress={() => {
                takePhoto();
                setMostrarOpciones(false);
              }}
            >
              <Text style={styles.opcionTexto}>📷 Cámara</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.opcionBtn}
              onPress={() => {
                pickFromGallery();
                setMostrarOpciones(false);
              }}
            >
              <Text style={styles.opcionTexto}>🖼️ Galería</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMostrarOpciones(false)}>
              <Text style={styles.opcionCancelar}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}
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
    gap: 12,
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
  avatarImg: {
    width: 90,
    height: 90,
    borderRadius: 45,
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
  opcionesFoto: {
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  opcionBtn: {
    paddingVertical: 6,
  },
  opcionTexto: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '600',
  },
  opcionCancelar: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 4,
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