import { useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { useProfileImage } from '../hooks/useProfileImage';

export default function EditarPerfilScreen() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const { imageUri, pickFromGallery, takePhoto } = useProfileImage();

  useEffect(() => {
    const cargarDatos = async () => {
      const user = auth.currentUser;
      if (!user) return;

      setCorreo(user.email || '');

      const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setNombre(data.nombre || '');
        setTelefono(data.telefono || '');
      }
      setCargandoDatos(false);
    };
    cargarDatos();
  }, []);

  const handleGuardar = async () => {
    const user = auth.currentUser;
    if (!user) return;

    if (!nombre.trim() || !telefono.trim()) {
      Alert.alert('Faltan datos', 'Completa nombre y teléfono');
      return;
    }

    setGuardando(true);
    try {
      await updateDoc(doc(db, 'usuarios', user.uid), {
        nombre,
        telefono,
      });
      Alert.alert('Listo', 'Tus datos se actualizaron correctamente');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'No se pudieron guardar los cambios');
    } finally {
      setGuardando(false);
    }
  };

  if (cargandoDatos) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#F97316" size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.avatarImg} />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {nombre ? nombre.slice(0, 2).toUpperCase() : '??'}
            </Text>
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
            style={[styles.input, styles.inputDisabled]}
            value={correo}
            editable={false}
          />
          <Text style={styles.hint}>El correo no se puede cambiar</Text>
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
          onPress={handleGuardar}
          disabled={guardando}
        >
          {guardando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.btnGuardarText}>Guardar cambios</Text>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  inputDisabled: {
    backgroundColor: '#F3F4F6',
    color: '#9CA3AF',
  },
  hint: {
    fontSize: 12,
    color: '#9CA3AF',
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