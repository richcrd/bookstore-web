import { useState } from 'react';
import { useMyOrders } from '../../../application/orders/useMyOrders';
import { useAuth } from '../../../application/auth/AuthProvider';
import { formatDate, formatMoney, shortId } from '../../../shared/lib/identity';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorBox } from '../../components/ui/ErrorBox';
import { Pagination } from '../../components/ui/Pagination';
import { Spinner } from '../../components/ui/Spinner';
import { StatusBadge } from '../../components/ui/StatusBadge';

export function OrdersPage() {
  const { session } = useAuth();
  const [page, setPage] = useState(1);
  const { data, isPending, isError, error } = useMyOrders(session?.customerId ?? null, page);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Mis pedidos</h1>
      <p className="mb-6 text-sm text-slate-500">
        Pedidos del cliente {session ? shortId(session.customerId) : '—'} · la saga los va de Pending a Shipped.
      </p>

      {isPending && <Spinner label="Cargando pedidos…" />}
      {isError && <ErrorBox error={error} />}
      {!isPending && !isError && data && data.items.length === 0 && (
        <EmptyState message="Todavía no tienes pedidos." />
      )}

      {data && data.items.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-2">Pedido</th>
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2">Artículos</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.items.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3 font-mono">{shortId(order.id)}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3">
                    <ul className="space-y-0.5 text-slate-600">
                      {order.items.map((item) => (
                        <li key={item.bookId}>{item.quantity} × {item.title}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-3 font-semibold">{formatMoney(order.total, order.currency)}</td>
                  <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && (
        <Pagination
          page={data.page}
          pageSize={data.pageSize}
          totalCount={data.totalCount}
          onChange={setPage}
        />
      )}
    </div>
  );
}
