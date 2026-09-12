import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import type { Book } from '../../domain/models';
import { CartProvider, useCart } from './CartContext';

const book: Book = {
  id: 'b1',
  title: 'Cien años de soledad',
  isbn: '978-0307474728',
  description: 'Un clásico.',
  author: 'García Márquez',
  price: 12.5,
  currency: 'USD',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: null,
};

function Probe() {
  const { cart, count, total, currency, add, setQuantity, clear } = useCart();
  return (
    <div>
      <span data-testid="count">{count}</span>
      <span data-testid="total">{total}</span>
      <span data-testid="currency">{currency}</span>
      <span data-testid="items">{cart.items.length}</span>
      <button onClick={() => add(book)}>añadir</button>
      <button onClick={() => add(book, 3)}>añadir 3</button>
      <button onClick={() => setQuantity('b1', 0)}>quitar b1</button>
      <button onClick={() => clear()}>vaciar</button>
    </div>
  );
}

describe('CartProvider', () => {
  beforeEach(() => localStorage.clear());

  it('empieza vacío y añadir acumula cantidad y total', async () => {
    const user = userEvent.setup();
    render(
      <CartProvider>
        <Probe />
      </CartProvider>,
    );

    expect(screen.getByTestId('count').textContent).toBe('0');
    expect(screen.getByTestId('items').textContent).toBe('0');

    await user.click(screen.getByRole('button', { name: 'añadir' }));
    expect(screen.getByTestId('count').textContent).toBe('1');
    expect(screen.getByTestId('total').textContent).toBe('12.5');
    expect(screen.getByTestId('currency').textContent).toBe('USD');

    await user.click(screen.getByRole('button', { name: 'añadir' }));
    expect(screen.getByTestId('count').textContent).toBe('2');

    await user.click(screen.getByRole('button', { name: 'quitar b1' }));
    expect(screen.getByTestId('items').textContent).toBe('0');
  });

  it('vaciar limpia el carrito y persiste en localStorage', async () => {
    const user = userEvent.setup();
    render(
      <CartProvider>
        <Probe />
      </CartProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'añadir' }));
    await user.click(screen.getByRole('button', { name: 'vaciar' }));

    expect(screen.getByTestId('count').textContent).toBe('0');
    expect(JSON.parse(localStorage.getItem('bookstore.cart') ?? '')).toEqual({ items: [] });
  });
});