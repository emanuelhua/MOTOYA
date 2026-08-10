import { useFocusEffect, useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../firebaseConfig';

export default function PerfilScreen() {
  const router = useRouter();
  const [nombre, setNombre] = useState('Usuario');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [rol, setRol] = useState<'pasajero' | 'conductor'>('pasajero');
  const [totalViajes, setTotalViajes] = useState(0);
  const [calificacionProm, setCalificacionProm] = useState(0);
  const [gastoTotal, setGastoTotal] = useState(0);
  const [confirmandoSalida, setConfirmandoSalida] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const cargarDatos = async () => {
        const user = auth.currentUser;
        if (!user) return;

        setCorreo(user.email || '');

        const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setNombre(data.nombre || 'Usuario');
          setTelefono(data.telefono || '');
          setRol(data.rol || 'pasajero');
        }

        const q = query(collection(db, 'viajes'), where('pasajeroId', '==', user.uid));
        const snapshot = await getDocs(q);
        const viajes = snapshot.docs.map((d) => d.data());

        setTotalViajes(viajes.length);

        const gasto = viajes.reduce((suma, v: any) => suma + (v.tarifa || 0), 0);
        setGastoTotal(gasto);

        const calificados = viajes.filter((v: any) => v.calificacion);
        const promedio =
          calificados.length > 0
            ? calificados.reduce((s, v: any) => s + v.calificacion, 0) / calificados.length
            : 0;
        setCalificacionProm(promedio);
      };
      cargarDatos();
    }, [])
  );

  const handleCerrarSesion = async () => {
    await signOut(auth);
    router.replace('/');
  };

  const iniciales = nombre
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{iniciales}</Text>
        </View>
        <Text style={styles.nombre}>{nombre}</Text>
        <Text style={styles.correo}>{correo}</Text>
        <Text style={styles.telefono}>📱 {telefono}</Text>
      </View>

      {rol === 'conductor' && (
        <View style={styles.rolBanner}>
          <Text style={styles.rolBannerTexto}>🛺 Cuenta de conductor</Text>
        </View>
      )}

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{totalViajes}</Text>
          <Text style={styles.statLabel}>Viajes</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>
            {calificacionProm > 0 ? calificacionProm.toFixed(1) : '-'}
          </Text>
          <Text style={styles.statLabel}>Calificación</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>S/{gastoTotal.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Gastado</Text>
        </View>
      </View>

      <View style={styles.menu}>
        {rol === 'conductor' && (
          <TouchableOpacity
            style={[styles.menuItem, styles.menuItemConductor]}
            onPress={() => router.push('/conductor')}
          >
            <Text style={styles.menuEmoji}>🛺</Text>
            <Text style={styles.menuTextoConductor}>Ir a mi panel de conductor</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/editar-perfil')}>
          <Text style={styles.menuEmoji}>✏️</Text>
          <Text style={styles.menuTexto}>Editar perfil</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/historial')}>
          <Text style={styles.menuEmoji}>🗒️</Text>
          <Text style={styles.menuTexto}>Mis viajes</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/notificaciones')}>
          <Text style={styles.menuEmoji}>🔔</Text>
          <Text style={styles.menuTexto}>Notificaciones</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/ayuda')}>
          <Text style={styles.menuEmoji}>❓</Text>
          <Text style={styles.menuTexto}>Ayuda</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        {!confirmandoSalida ? (
          <TouchableOpacity
            style={[styles.menuItem, styles.menuItemRojo]}
            onPress={() => setConfirmandoSalida(true)}
          >
            <Text style={styles.menuEmoji}>🚪</Text>
            <Text style={styles.menuTextoRojo}>Cerrar sesión</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.confirmBox}>
            <Text style={styles.confirmTexto}>¿Seguro que quieres salir?</Text>
            <View style={styles.confirmBtns}>
              <TouchableOpacity style={styles.confirmBtnSalir} onPress={handleCerrarSesion}>
                <Text style={styles.confirmBtnSalirTexto}>Sí, salir</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmBtnCancelar}
                onPress={() => setConfirmandoSalida(false)}
              >
                <Text style={styles.confirmBtnCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
  rolBanner: {
    backgroundColor: '#FFF7ED',
    paddingVertical: 8,
    alignItems: 'center',
  },
  rolBannerTexto: {
    color: '#F97316',
    fontWeight: '600',
    fontSize: 13,
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
    paddingBottom: 24,
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
  menuItemConductor: {
    backgroundColor: '#FFF7ED',
    borderColor: '#F97316',
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
  menuTextoConductor: {
    flex: 1,
    fontSize: 16,
    color: '#F97316',
    fontWeight: '600',
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
  confirmBox: {
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  confirmTexto: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '600',
    textAlign: 'center',
  },
  confirmBtns: {
    flexDirection: 'row',
    gap: 10,
  },
  confirmBtnSalir: {
    flex: 1,
    backgroundColor: '#DC2626',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmBtnSalirTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  confirmBtnCancelar: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmBtnCancelarTexto: {
    color: '#374151',
    fontWeight: '600',
  },
});