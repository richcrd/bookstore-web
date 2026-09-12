import { Link, useParams } from 'react-router-dom';
import { isOrderFinished, orderStatusLabel } from '../../../application/orders/orderStatus';
import { useOrder } from '../../../application/orders/useOrder';
import { formatDate, formatMoney, shortId } from '../../../shared/lib/identity';
import { ErrorBox } from '../../components/ui/ErrorBox';
import { Spinner } from '../../components/ui/Spinner';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { OrderTracking } from '../../components/orders/OrderTracking';

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isPending, isError, error } = useOrder(id);

  if (isPending) return <Spinner label="Cargando pedido…" />;
  if (isError) return <ErrorBox error={error} />;
  if (!order) return null;

  return (
    <div>
      <Link to="/orders" className="text-sm text-blue-600 hover:underline">
        ← Mis pedidos
      </Link>
      <div className="mb-4 mt-2 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold">Pedido {shortId(order.id)}</h1>
        <StatusBadge status={order.status} />
      </div>
      {!isOrderFinished(order.status) && (
        <p className="mb-4 flex items-center gap-2 text-sm text-slate-500">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          La saga lo está procesando — actualización en vivo.
        </p>
      )}
      <OrderTracking status={order.status} />

      <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <dt className="text-xs uppercase text-slate-500">Total</dt>
          <dd className="mt-1 font-semibold">{formatMoney(order.total, order.currency)}</dd>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <dt className="text-xs uppercase text-slate-500">Creado</dt>
          <dd className="mt-1 text-sm text-slate-700">{formatDate(order.createdAt)}</dd>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <dt className="text-xs uppercase text-slate-500">Última actualización</dt>
          <dd className="mt-1 text-sm text-slate-700">
            {order.updatedAt ? formatDate(order.updatedAt) : formatDate(order.createdAt)}
          </dd>
        </div>
      </dl>

      <h2 className="mb-2 mt-6 text-lg font-semibold">Artículos</h2>
      <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white text-sm">
        {order.items.map((item) => (
          <li key={item.bookId} className="flex items-center justify-between px-4 py-3">
            <span>
              {item.quantity} × {item.title}
            </span>
            <span className="font-medium">{formatMoney(item.lineTotal, item.currency)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-slate-400">Estado final: {orderStatusLabel(order.status)} · {order.id}</p>
    </div>
  );
}