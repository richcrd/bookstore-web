import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('no renderiza nada con una sola página', () => {
    render(<Pagination page={1} pageSize={10} totalCount={5} onChange={() => {}} />);
    expect(screen.queryByText(/Página/)).toBeNull();
  });

  it('muestra la página actual y navega hacia adelante y atrás', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Pagination page={2} pageSize={10} totalCount={45} onChange={onChange} />);

    expect(screen.getByText('Página 2 de 5')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Siguiente →' }));
    expect(onChange).toHaveBeenCalledWith(3);

    await user.click(screen.getByRole('button', { name: '← Anterior' }));
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('deshabilita Anterior en la primera página', () => {
    render(<Pagination page={1} pageSize={10} totalCount={45} onChange={() => {}} />);
    expect(screen.getByRole('button', { name: '← Anterior' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Siguiente →' })).toBeEnabled();
  });
});