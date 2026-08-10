import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PREGUNTAS = [
  {
    pregunta: '¿Como solicito un mototaxi?',
    respuesta:
      'Inicia sesion como pasajero, ve al mapa, escribe tu destino y presiona "Solicitar MotoYa". Un conductor disponible recibira tu solicitud y podra aceptarla.',
  },
  {
    pregunta: '¿Como me registro como conductor?',
    respuesta:
      'Al crear tu cuenta, selecciona la opcion "Conductor" e ingresa la placa de tu mototaxi. Luego, desde tu panel, activa tu disponibilidad para empezar a recibir solicitudes.',
  },
  {
    pregunta: '¿Que metodos de pago existen?',
    respuesta:
      'Puedes pagar en efectivo directamente al conductor, o mediante Yape al finalizar el viaje.',
  },
  {
    pregunta: '¿Como califico a mi conductor?',
    respuesta:
      'Al finalizar el viaje, se abre automaticamente la pantalla de calificacion, donde puedes darle de 1 a 5 estrellas y dejar un comentario opcional.',
  },
  {
    pregunta: '¿Que pasa si ningun conductor acepta mi solicitud?',
    respuesta:
      'La app intenta reasignar tu solicitud a otro conductor disponible automaticamente. Si no hay ninguno disponible, se cancela y puedes intentarlo de nuevo.',
  },
];

export default function AyudaScreen() {
  const router = useRouter();
  const [abierta, setAbierta] = useState<number | null>(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ayuda</Text>
        <Text style={styles.subtitle}>Preguntas frecuentes y soporte</Text>
      </View>

      <ScrollView style={styles.lista} showsVerticalScrollIndicator={false}>
        {PREGUNTAS.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={styles.card}
            onPress={() => setAbierta(abierta === i ? null : i)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.pregunta}>{item.pregunta}</Text>
              <Text style={styles.flecha}>{abierta === i ? '−' : '+'}</Text>
            </View>
            {abierta === i && <Text style={styles.respuesta}>{item.respuesta}</Text>}
          </TouchableOpacity>
        ))}

        <View style={styles.contactoCard}>
          <Text style={styles.contactoTitulo}>¿Necesitas mas ayuda?</Text>
          <Text style={styles.contactoTexto}>
            Escribenos y te responderemos lo antes posible.
          </Text>
          <TouchableOpacity
            style={styles.contactoBtn}
            onPress={() => Linking.openURL('mailto:soporte@motoya.pe')}
          >
            <Text style={styles.contactoBtnTexto}>📧 soporte@motoya.pe</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>MotoYa v1.0.0</Text>
      </ScrollView>

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
  lista: {
    flex: 1,
  },
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pregunta: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  flecha: {
    fontSize: 20,
    color: '#F97316',
    fontWeight: 'bold',
  },
  respuesta: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 10,
    lineHeight: 20,
  },
  contactoCard: {
    backgroundColor: '#FFF7ED',
    borderRadius: 16,
    padding: 20,
    marginTop: 12,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#F97316',
  },
  contactoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  contactoTexto: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
  contactoBtn: {
    backgroundColor: '#F97316',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 4,
  },
  contactoBtnTexto: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    color: '#D1D5DB',
    fontSize: 12,
    marginTop: 20,
    marginBottom: 24,
  },
});