import { beforeEach, describe, expect, it } from 'vitest';
import { cartStorage } from './CartStorageImpl';
import { STORAGE_KEYS } from '../../shared/storageKeys';

const sampleCart = {
  items: [
    {
      bookId: 'b1',
      title: 'Cien años de soledad',
      author: 'García Márquez',
      unitPrice: 12.5,
      currency: 'USD',
      quantity: 2,
    },
  ],
};

describe('cartStorage', () => {
  beforeEach(() => localStorage.clear());

  it('load: devuelve carrito vacío cuando no hay nada guardado', () => {
    expect(cartStorage.load()).toEqual({ items: [] });
  });

  it('save/load: hace roundtrip del carrito en localStorage', () => {
    cartStorage.save(sampleCart);
    expect(cartStorage.load()).toEqual(sampleCart);
  });

  it('clear: elimina la entrada de localStorage', () => {
    cartStorage.save(sampleCart);
    cartStorage.clear();
    expect(localStorage.getItem(STORAGE_KEYS.cart)).toBeNull();
    expect(cartStorage.load()).toEqual({ items: [] });
  });
});