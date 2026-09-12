import type { Cart } from '../../domain/models';
import type { CartStoragePort } from '../../domain/ports';
import { STORAGE_KEYS } from '../../shared/storageKeys';

export const cartStorage: CartStoragePort = {
  load() {
    const data = localStorage.getItem(STORAGE_KEYS.cart);
    return data ? (JSON.parse(data) as Cart) : { items: [] };
  },
  save(cart: Cart) {
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
  },
  clear() {
    localStorage.removeItem(STORAGE_KEYS.cart);
  },
};