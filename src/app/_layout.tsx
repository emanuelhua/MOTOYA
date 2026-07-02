import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="registro" />
      <Stack.Screen name="conductor" />
      <Stack.Screen name="calificacion" />
      <Stack.Screen name="historial" />
    </Stack>
  );
}