import { calcularTarifa, validarCampoObligatorio, validarCorreo } from '../utils/calcularTarifa';

describe('calcularTarifa', () => {
  it('devuelve la tarifa base cuando la distancia es 0', () => {
    expect(calcularTarifa(0)).toBe(2.0);
  });

  it('calcula correctamente la tarifa para 1.2 km', () => {
    expect(calcularTarifa(1.2)).toBe(3.5);
  });

  it('calcula correctamente la tarifa para 5 km', () => {
    expect(calcularTarifa(5)).toBe(8.25);
  });
});

describe('validarCampoObligatorio', () => {
  it('devuelve false si el campo esta vacio', () => {
    expect(validarCampoObligatorio('')).toBe(false);
  });

  it('devuelve false si el campo solo tiene espacios', () => {
    expect(validarCampoObligatorio('   ')).toBe(false);
  });

  it('devuelve true si el campo tiene contenido', () => {
    expect(validarCampoObligatorio('Jesus Emanuel')).toBe(true);
  });
});

describe('validarCorreo', () => {
  it('devuelve true para un correo valido', () => {
    expect(validarCorreo('jesus@gmail.com')).toBe(true);
  });

  it('devuelve false para un correo sin arroba', () => {
    expect(validarCorreo('jesusgmail.com')).toBe(false);
  });

  it('devuelve false para un correo sin dominio', () => {
    expect(validarCorreo('jesus@')).toBe(false);
  });
});