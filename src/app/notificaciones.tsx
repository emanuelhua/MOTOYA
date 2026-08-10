import { useFocusEffect, useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../firebaseConfig';

interface Notificacion {
  id: string;
  tipo: 'viaje' | 'calificacion';
  titulo: string;
  mensaje: string;
  fecha: string;
}

const iconos: Record<string, string> = {
  viaje: '🛺',
  calificacion: '⭐',
};

function formatearFecha(iso: string) {
  const fecha = new Date(iso);
  return fecha.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function NotificacionesScreen() {
  const router = useRouter();
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [cargando, setCargando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!user) {
          setCargando(false);
          return;
        }

        setCargando(true);
        try {
          const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
          const rol = userDoc.exists() ? userDoc.data().rol || 'pasajero' : 'pasajero';
          const campo = rol === 'conductor' ? 'conductorId' : 'pasajeroId';

          const q = query(
            collection(db, 'viajes'),
            where(campo, '==', user.uid),
            orderBy('creadoEn', 'desc')
          );
          const snapshot = await getDocs(q);

          const lista: Notificacion[] = [];

          snapshot.docs.forEach((d) => {
            const v = d.data();

            if (rol === 'pasajero') {
              if (v.estado === 'en_curso' || v.estado === 'completado') {
                lista.push({
                  id: `${d.id}-aceptado`,
                  tipo: 'viaje',
                  titulo: 'Conductor asignado',
                  mensaje: `${v.conductorNombre} acepto tu solicitud hacia ${v.destino}`,
                  fecha: v.creadoEn,
                });
              }
              if (v.calificacion) {
                lista.push({
                  id: `${d.id}-calif`,
                  tipo: 'calificacion',
                  titulo: 'Calificacion enviada',
                  mensaje: `Calificaste tu viaje con ${v.conductorNombre} con ${v.calificacion} estrellas`,
                  fecha: v.creadoEn,
                });
              }
            } else {
              lista.push({
                id: `${d.id}-solicitud`,
                tipo: 'viaje',
                titulo: 'Solicitud de viaje',
                mensaje: `${v.pasajeroNombre} solicito un viaje hacia ${v.destino}`,
                fecha: v.creadoEn,
              });
              if (v.calificacion) {
                lista.push({
                  id: `${d.id}-recibida`,
                  tipo: 'calificacion',
                  titulo: 'Nueva calificacion',
                  mensaje: `${v.pasajeroNombre} te califico con ${v.calificacion} estrellas`,
                  fecha: v.creadoEn,
                });
              }
            }
          });

          setNotificaciones(lista);
        } catch (err) {
          console.log('Error cargando notificaciones:', err);
        } finally {
          setCargando(false);
        }
      });

      return () => unsubscribe();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notificaciones</Text>
        <Text style={styles.subtitle}>{notificaciones.length} en total</Text>
      </View>

      {cargando ? (
        <ActivityIndicator color="#F97316" size="large" style={{ marginTop: 40 }} />
      ) : notificaciones.length === 0 ? (
        <View style={styles.vacioContainer}>
          <Text style={styles.vacioEmoji}>🔔</Text>
          <Text style={styles.vacioTexto}>No tienes notificaciones todavia</Text>
        </View>
      ) : (
        <ScrollView style={styles.lista} showsVerticalScrollIndicator={false}>
          {notificaciones.map((n) => (
            <View key={n.id} style={styles.card}>
              <Text style={styles.icono}>{iconos[n.tipo]}</Text>
              <View style={styles.info}>
                <Text style={styles.notifTitulo}>{n.titulo}</Text>
                <Text style={styles.notifMensaje}>{n.mensaje}</Text>
                <Text style={styles.notifTiempo}>{formatearFecha(n.fecha)}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity onPress={() => router.back()} style={styles.btnVolver}>
        <Text style={styles.btnVolverText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F97316',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  vacioContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  vacioEmoji: {
    fontSize: 48,
  },
  vacioTexto: {
    fontSize: 15,
    color: '#9CA3AF',
  },
  lista: {
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
    alignItems: 'flex-start',
  },
  icono: {
    fontSize: 24,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  notifTitulo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
  },
  notifMensaje: {
    fontSize: 13,
    color: '#6B7280',
  },
  notifTiempo: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  btnVolver: {
    alignItems: 'center',
    padding: 16,
  },
  btnVolverText: {
    color: '#F97316',
    fontSize: 15,
  },
});