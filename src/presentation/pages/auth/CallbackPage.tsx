import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userManager } from '../../../infrastructure/auth/oidc';
import { Spinner } from '../../components/ui/Spinner';
import { ROUTES } from '../../../shared/constants';

export function CallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    userManager
      .signinRedirectCallback()
      .then(() => navigate(ROUTES.home, { replace: true }))
      .catch((err: unknown) => {
        console.error('OIDC callback falló:', err);
        setError(err instanceof Error ? err.message : 'Error al completar el inicio de sesión.');
      });
  }, [navigate]);

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-800">
        <p className="font-medium">No se pudo completar el inicio de sesión</p>
        <p className="mt-1 text-sm">{error}</p>
        <button onClick={() => navigate(ROUTES.home, { replace: true })} className="mt-4 rounded bg-indigo-600 px-3 py-1 text-white">
          Volver al inicio
        </button>
      </div>
    );
  }

  return <Spinner label="Completando inicio de sesión…" />;
}