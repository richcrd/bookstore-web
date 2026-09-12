import { describe, expect, it } from 'vitest';
import {
  ORDER_STEPS,
  isOrderFinished,
  orderStatusLabel,
  orderStatusStep,
} from './orderStatus';

describe('orderStatus', () => {
  it('label: todo estado conocido en español', () => {
    expect(orderStatusLabel('Pending')).toBe('Pendiente');
    expect(orderStatusLabel('Paid')).toBe('Pagado');
    expect(orderStatusLabel('Shipped')).toBe('Enviado');
    expect(orderStatusLabel('Delivered')).toBe('Entregado');
    expect(orderStatusLabel('Cancelled')).toBe('Cancelado');
  });

  it('label: estado desconocido devuelve el valor crudo', () => {
    expect(orderStatusLabel('StrangeState')).toBe('StrangeState');
  });

  it('steps: orden del flujo feliz', () => {
    expect(ORDER_STEPS).toEqual(['Pending', 'Paid', 'Shipped', 'Delivered']);
    expect(orderStatusStep('Pending')).toBe(0);
    expect(orderStatusStep('Paid')).toBe(1);
    expect(orderStatusStep('Shipped')).toBe(2);
    expect(orderStatusStep('Delivered')).toBe(3);
    expect(orderStatusStep('Cancelled')).toBe(-1);
  });

  it('isOrderFinished: Shipped/Delivered/Cancelled son estados finales (la saga termina en Shipped)', () => {
    expect(isOrderFinished('Shipped')).toBe(true);
    expect(isOrderFinished('Delivered')).toBe(true);
    expect(isOrderFinished('Cancelled')).toBe(true);
    expect(isOrderFinished('Pending')).toBe(false);
    expect(isOrderFinished('Paid')).toBe(false);
  });
});