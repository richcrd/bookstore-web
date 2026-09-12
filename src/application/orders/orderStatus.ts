import type { OrderStatus } from '../../domain/models';

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  Pending: 'Pendiente',
  Paid: 'Pagado',
  Shipped: 'Enviado',
  Delivered: 'Entregado',
  Cancelled: 'Cancelado',
};

export const ORDER_STEPS = ['Pending', 'Paid', 'Shipped', 'Delivered'] as const;

export function orderStatusLabel(status: string): string {
  return ORDER_STATUS_LABEL[status as OrderStatus] ?? status;
}

export function orderStatusStep(status: string): number {
  return ORDER_STEPS.indexOf(status as (typeof ORDER_STEPS)[number]);
}

export function isOrderFinished(status: string): boolean {
  return status === 'Shipped' || status === 'Delivered' || status === 'Cancelled';
}