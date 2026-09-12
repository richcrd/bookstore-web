interface PaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  onChange: (page: number) => void;
}

const buttonClass =
  'rounded border border-slate-300 px-3 py-1.5 text-sm transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40';

export function Pagination({ page, pageSize, totalCount, onChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-center gap-4 text-sm">
      <button className={buttonClass} disabled={page <= 1} onClick={() => onChange(page - 1)}>
        ← Anterior
      </button>
      <span className="text-slate-600">
        Página {page} de {totalPages}
      </span>
      <button className={buttonClass} disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        Siguiente →
      </button>
    </div>
  );
}