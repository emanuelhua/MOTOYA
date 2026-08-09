export function calcularTarifa(distanciaKm: number): number {
  const TARIFA_BASE = 2.0;
  const TARIFA_POR_KM = 1.25;

  if (distanciaKm <= 0) {
    return TARIFA_BASE;
  }

  const tarifa = TARIFA_BASE + distanciaKm * TARIFA_POR_KM;
  return Math.round(tarifa * 100) / 100;
}

export function validarCampoObligatorio(valor: string): boolean {
  return valor.trim().length > 0;
}

export function validarCorreo(correo: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(correo);
}