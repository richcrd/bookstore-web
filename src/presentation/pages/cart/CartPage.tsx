import { useAuth } from '../../../application/auth/AuthProvider';
import { useCart } from '../../../application/cart/CartContext';
import { useCreateOrder } from '../../../application/orders/useCreateOrder';
import { formatMoney } from '../../../shared/lib/identity';
import { ErrorBox } from '../../components/ui/ErrorBox';
import { EmptyState } from '../../components/ui/EmptyState';
import { Spinner } from '../../components/ui/Spinner';
import { StatusBadge } from '../../components/ui/StatusBadge';

export function CartPage() {
  const { isAuthenticated, login, session } = useAuth();
  const { cart, count, total, currency, setQuantity, remove, clear } = useCart();
  const createOrder = useCreateOrder(session?.customerId ?? '');

  const handleCheckout = () => {
    if (!session) return;
    const items = cart.items.map((item) => ({ bookId: item.bookId, quantity: item.quantity }));
    createOrder.mutate(items, { onSuccess: () => clear() });
  };

  if (createOrder.isSuccess && createOrder.data) {
    const order = createOrder.data;
    return (
      <div className="mx-auto max-w-xl rounded-lg border border-green-200 bg-green-50 p-6">
        <h1 className="text-xl font-semibold text-green-900">Pedido creado</h1>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-green-800">Pedido</dt>
            <dd className="font-mono">{order.id}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-green-800">Estado</dt>
            <dd>
              <StatusBadge status={order.status} />
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-green-800">Total</dt>
            <dd className="font-semibold">{formatMoney(order.total, order.currency)}</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-green-700">
          La saga procesará el pago y actualizará el estado (consulta «Mis pedidos»).
        </p>
        <button
          onClick={() => createOrder.reset()}
          className="mt-4 rounded border border-green-300 px-3 py-1.5 text-sm transition-colors hover:bg-green-100"
        >
          Volver al carrito
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Carrito</h1>
      <p className="mb-6 text-sm text-slate-500">
        {count > 0 ? `${count} unidad(es) · el carrito se guarda localmente.` : 'Añade libros desde el catálogo.'}
      </p>

      {!isAuthenticated && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Necesitas iniciar sesión para confirmar el pedido.{' '}
          <button onClick={() => void login()} className="font-semibold underline">
            Iniciar sesión
          </button>
        </div>
      )}

      {createOrder.isPending && <Spinner label="Creando pedido…" />}
      {createOrder.isError && <ErrorBox error={createOrder.error} />}

      {cart.items.length === 0 && !createOrder.isPending && (
        <EmptyState message="El carrito está vacío." />
      )}

      {cart.items.length > 0 && (
        <>
          <ul className="space-y-2">
            {cart.items.map((item) => (
              <li
                key={item.bookId}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3"
              >
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-slate-500">
                    {formatMoney(item.unitPrice, item.currency)} · {item.author}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(item.bookId, item.quantity - 1)}
                    className="h-8 w-8 rounded border border-slate-300 transition-colors hover:bg-slate-100"
                    aria-label="Restar uno"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => setQuantity(item.bookId, item.quantity + 1)}
                    className="h-8 w-8 rounded border border-slate-300 transition-colors hover:bg-slate-100"
                    aria-label="Sumar uno"
                  >
                    +
                  </button>
                  <button
                    onClick={() => remove(item.bookId)}
                    className="ml-2 rounded border border-red-200 px-2 py-1 text-xs text-red-600 transition-colors hover:bg-red-50"
                  >
                    Quitar
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center justify-between rounded-lg bg-slate-900 px-4 py-3 text-white">
            <span>
              Total ({count}): <strong>{formatMoney(total, currency)}</strong>
            </span>
            <div className="flex gap-2">
              <button
                onClick={clear}
                className="rounded border border-slate-600 px-3 py-2 text-sm transition-colors hover:bg-slate-700"
              >
                Vaciar
              </button>
              <button
                onClick={handleCheckout}
                disabled={!isAuthenticated || createOrder.isPending}
                className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {createOrder.isPending ? 'Creando…' : 'Crear pedido'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}