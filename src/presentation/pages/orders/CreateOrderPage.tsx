import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useBooks } from '../../../application/catalog/useBooks';
import { useAuth } from '../../../application/auth/AuthProvider';
import { useCreateOrder } from '../../../application/orders/useCreateOrder';
import { formatMoney, shortId } from '../../../shared/lib/identity';
import { ErrorBox } from '../../components/ui/ErrorBox';
import { Spinner } from '../../components/ui/Spinner';
import { StatusBadge } from '../../components/ui/StatusBadge';

export function CreateOrderPage() {
  const { session } = useAuth();
  const [params] = useSearchParams();
  const preselected = params.get('book');

  const booksQuery = useBooks('');
  const createOrder = useCreateOrder(session?.customerId ?? '');
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!booksQuery.data) return;
    const initial: Record<string, number> = {};
    for (const book of booksQuery.data.items) initial[book.id] = book.id === preselected ? 1 : 0;
    setQuantities(initial);
  }, [booksQuery.data, preselected]);

  const setQuantity = (bookId: string, value: number) =>
    setQuantities((prev) => ({ ...prev, [bookId]: value }));

  const books = booksQuery.data?.items ?? [];
  const selectedBooks = books.filter((b) => (quantities[b.id] ?? 0) > 0);
  const selectedItems = selectedBooks.map((b) => ({ bookId: b.id, quantity: quantities[b.id] }));
  const totalAmount = selectedBooks.reduce((sum, b) => sum + b.price * quantities[b.id], 0);
  const currency = selectedBooks[0]?.currency ?? 'USD';

  const handleSubmit = () => {
    if (selectedItems.length === 0) return;
    createOrder.mutate(selectedItems);
  };

  if (createOrder.isSuccess && createOrder.data) {
    const order = createOrder.data;
    return (
      <div className="mx-auto max-w-xl rounded-lg border border-green-200 bg-green-50 p-6">
        <h1 className="text-xl font-semibold text-green-900">Pedido creado</h1>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-green-800">Pedido</dt><dd className="font-mono">{order.id}</dd></div>
          <div className="flex justify-between"><dt className="text-green-800">Estado</dt><dd><StatusBadge status={order.status} /></dd></div>
          <div className="flex justify-between"><dt className="text-green-800">Total</dt><dd className="font-semibold">{formatMoney(order.total, order.currency)}</dd></div>
        </dl>
        <p className="mt-4 text-xs text-green-700">La saga procesará el pago y actualizará el estado (consulta «Mis pedidos»).</p>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => createOrder.reset()}
            className="rounded border border-green-300 px-3 py-1.5 text-sm hover:bg-green-100"
          >
            Crear otro pedido
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Nuevo pedido</h1>
      <p className="mb-6 text-sm text-slate-500">
        Cantidades por libro. Cliente {session ? shortId(session.customerId) : '—'} · Idempotency-Key por pedido.
      </p>

      {(booksQuery.isPending || createOrder.isPending) && <Spinner label="Cargando…" />}
      {booksQuery.isError && <ErrorBox error={booksQuery.error} />}
      {createOrder.isError && <ErrorBox error={createOrder.error} />}

      {books.length > 0 && (
        <div className="space-y-2">
          {books.map((book) => {
            const qty = quantities[book.id] ?? 0;
            return (
              <div key={book.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3">
                <div>
                  <p className="font-medium">{book.title}</p>
                  <p className="text-sm text-slate-500">{formatMoney(book.price, book.currency)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    value={qty === 0 ? '' : qty}
                    placeholder="0"
                    onChange={(e) => setQuantity(book.id, Math.max(0, Number(e.target.value)))}
                    className="w-20 rounded border border-slate-300 px-2 py-1 text-right focus:border-indigo-500 focus:outline-none"
                  />
                  <span className="w-6 text-sm text-slate-400">uds</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {books.length > 0 && (
        <div className="mt-6 flex items-center justify-between rounded-lg bg-slate-900 px-4 py-3 text-white">
          <span>Total: <strong>{formatMoney(totalAmount, currency)}</strong></span>
          <button
            onClick={handleSubmit}
            disabled={createOrder.isPending || selectedItems.length === 0}
            className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {createOrder.isPending ? 'Creando…' : 'Crear pedido'}
          </button>
        </div>
      )}
    </div>
  );
}