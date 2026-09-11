import { useEffect, type ReactNode } from 'react';
import { useAuth } from '../../application/auth/AuthProvider';
import { Spinner } from '../components/ui/Spinner';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { isInitialized, isAuthenticated, login } = useAuth();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) void login();
  }, [isInitialized, isAuthenticated, login]);

  if (!isInitialized || !isAuthenticated) {
    return <Spinner label={isInitialized ? 'Redirigiendo al proveedor de identidad…' : 'Cargando sesión…'} />;
  }
  return children;
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { isInitialized, isAuthenticated, session } = useAuth();

  if (!isInitialized) return <Spinner label="Cargando sesión…" />;

  if (!isAuthenticated || !(session?.roles.includes('admin') ?? false)) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-800">
        <p className="font-medium">Acceso denegado</p>
        <p className="mt-1 text-sm">Esta sección es exclusiva para administradores.</p>
      </div>
    );
  }
  return children;
}