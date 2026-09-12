import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../../application/auth/AuthProvider';
import { useCart } from '../../../application/cart/CartContext';
import { ROUTES } from '../../../shared/constants';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `${isActive ? 'text-white' : 'text-slate-300 hover:text-white'} transition-colors`;

export function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, session, login, logout } = useAuth();
  const { count } = useCart();
  const isAdmin = session?.roles.includes('admin') ?? false;

  return (
    <div className="min-h-screen">
      <header className="bg-slate-900 text-white shadow">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-6">
            <Link to={ROUTES.home} className="text-lg font-semibold tracking-tight">
              BookStore
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <NavLink to={ROUTES.home} className={navLinkClass} end>Catálogo</NavLink>
              <NavLink to={ROUTES.cart} className={navLinkClass}>
                Carrito{count > 0 ? ` (${count})` : ''}
              </NavLink>
              <NavLink to={ROUTES.orders} className={navLinkClass}>Mis pedidos</NavLink>
              {isAdmin && <NavLink to={ROUTES.stock} className={navLinkClass}>Stock</NavLink>}
            </nav>
          </div>

          <div className="flex items-center gap-3 text-sm">
            {isAuthenticated ? (
              <>
                <span className="text-slate-300">
                  {session?.name}
                  {isAdmin && (
                    <span className="ml-2 rounded bg-indigo-500 px-1.5 py-0.5 text-xs text-white">admin</span>
                  )}
                </span>
                <button
                  onClick={() => void logout()}
                  className="rounded border border-slate-600 px-3 py-1 transition-colors hover:bg-slate-700"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <button
                onClick={() => void login()}
                className="rounded bg-indigo-600 px-3 py-1 transition-colors hover:bg-indigo-500"
              >
                Iniciar sesión
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}