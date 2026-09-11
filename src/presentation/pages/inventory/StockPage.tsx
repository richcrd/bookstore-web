import { useState } from 'react';
import { useAddStock } from '../../../application/inventory/useAddStock';
import { useStockItems } from '../../../application/inventory/useStockItems';
import { useBooks } from '../../../application/catalog/useBooks';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorBox } from '../../components/ui/ErrorBox';
import { Spinner } from '../../components/ui/Spinner';

export function StockPage() {
  const stockQuery = useStockItems();
  const booksQuery = useBooks('');
  const addStock = useAddStock();
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const titleOf = (bookId: string) =>
    booksQuery.data?.items.find((b) => b.id === bookId)?.title ?? bookId.slice(0, 8);

  const handleAdd = (bookId: string) => {
    const quantity = quantities[bookId] ?? 0;
    if (quantity <= 0) return;
    addStock.mutate({ bookId, quantity });
    setQuantities((prev) => ({ ...prev, [bookId]: 0 }));
  };

  const items = stockQuery.data?.items ?? [];
  const isPending = stockQuery.isPending || booksQuery.isPending;
  const error = stockQuery.error ?? booksQuery.error;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Stock</h1>
      <p className="mb-6 text-sm text-slate-500">
        Nivel de inventario. Disponible = en mano − reservado (los pedidos reservan al crearse).
      </p>

      {isPending && <Spinner label="Cargando inventario…" />}
      {error && <ErrorBox error={error} />}
      {!isPending && !error && items.length === 0 && <EmptyState message="No hay artículos de stock." />}

      {items.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-2">Libro</th>
                <th className="px-4 py-2 text-right">En mano</th>
                <th className="px-4 py-2 text-right">Reservado</th>
                <th className="px-4 py-2 text-right">Disponible</th>
                <th className="px-4 py-2 text-right">Añadir stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 font-medium">{titleOf(item.bookId)}</td>
                  <td className="px-4 py-3 text-right">{item.quantityOnHand}</td>
                  <td className="px-4 py-3 text-right text-slate-500">{item.reservedQuantity}</td>
                  <td className={`px-4 py-3 text-right font-semibold ${item.available > 0 ? 'text-green-700' : 'text-red-600'}`}>
                    {item.available}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <input
                        type="number"
                        min={0}
                        value={(quantities[item.bookId] ?? 0) || ''}
                        placeholder="0"
                        onChange={(e) =>
                          setQuantities((prev) => ({ ...prev, [item.bookId]: Math.max(0, Number(e.target.value)) }))
                        }
                        className="w-20 rounded border border-slate-300 px-2 py-1 text-right focus:border-indigo-500 focus:outline-none"
                      />
                      <button
                        onClick={() => handleAdd(item.bookId)}
                        disabled={addStock.isPending}
                        className="rounded bg-indigo-600 px-3 py-1 text-xs text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
                      >
                        {addStock.isPending ? '…' : 'Añadir'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
