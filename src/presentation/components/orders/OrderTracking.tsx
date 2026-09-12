import { ORDER_STEPS, orderStatusLabel, orderStatusStep } from '../../../application/orders/orderStatus';

export function OrderTracking({ status }: { status: string }) {
  if (status === 'Cancelled') {
    return (
      <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        Pedido cancelado: no se tramitó ningún pago ni envío.
      </p>
    );
  }

  const current = orderStatusStep(status);

  return (
    <ol className="flex flex-wrap items-center gap-2">
      {ORDER_STEPS.map((step, index) => {
        const done = index <= current;
        return (
          <li
            key={step}
            className={`rounded-full px-3 py-1 text-sm ${
              done ? 'bg-green-100 font-medium text-green-800' : 'bg-slate-100 text-slate-500'
            }`}
          >
            {orderStatusLabel(step)}
          </li>
        );
      })}
    </ol>
  );
}