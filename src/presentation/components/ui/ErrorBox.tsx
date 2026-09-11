export function ErrorBox({ error, title = 'Algo salió mal' }: { error: unknown; title?: string }) {
  const message = error instanceof Error ? error.message : 'Error inesperado.';
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
      <p className="font-medium text-red-800">{title}</p>
      <p className="mt-1 text-sm text-red-700">{message}</p>
    </div>
  );
}