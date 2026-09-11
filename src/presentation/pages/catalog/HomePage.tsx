import { useDeferredValue, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooks } from '../../../application/catalog/useBooks';
import { useAuth } from '../../../application/auth/AuthProvider';
import { formatMoney } from '../../../shared/lib/identity';
import { routeBuilder as R } from '../../../app/router/routes';
import { ErrorBox } from '../../components/ui/ErrorBox';
import { EmptyState } from '../../components/ui/EmptyState';
import { Spinner } from '../../components/ui/Spinner';

export function HomePage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const { data, isPending, isError, error } = useBooks(deferredSearch);

  const goToOrder = (bookId: string) => {
    if (isAuthenticated) {
      navigate(R.newOrderWithBook(bookId));
    } else {
      void login();
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Catálogo</h1>
          <p className="text-sm text-slate-500">Libros disponibles en BookStore</p>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por título, autor o ISBN…"
          className="w-72 rounded border border-slate-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none"
        />
      </div>

      {isPending && <Spinner label="Cargando catálogo…" />}
      {isError && <ErrorBox error={error} />}
      {!isPending && !isError && data && data.items.length === 0 && (
        <EmptyState message={`Sin resultados para «${search}».`} />
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(data?.items ?? []).map((book) => (
          <div key={book.id} className="flex flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="font-semibold">{book.title}</h2>
            <p className="text-sm text-slate-500">{book.author}</p>
            <p className="mt-1 text-xs text-slate-400">ISBN {book.isbn}</p>
            <p className="mt-2 line-clamp-2 text-sm text-slate-600">{book.description}</p>
            <div className="mt-auto flex items-center justify-between pt-4">
              <span className="text-lg font-semibold text-indigo-700">{formatMoney(book.price, book.currency)}</span>
              <button
                onClick={() => goToOrder(book.id)}
                className="rounded bg-indigo-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-indigo-500"
              >
                Pedir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
