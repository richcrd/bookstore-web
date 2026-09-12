import { Book, Cart, CreateOrderItems, Order, Page, StockItem } from "./models";

export interface CatalogPort {
  getBooks(search?: string, page?: number, pageSize?: number): Promise<Page<Book>>;
}

export interface OrdersPort {
  getOrders(customerId: string, page?: number, pageSize?: number): Promise<Page<Order>>;
  getOrder(id: string): Promise<Order>;
  createOrder(input: CreateOrderItems): Promise<Order>;
}

export interface InventoryPort {
  getStockItems(): Promise<Page<StockItem>>;
  addStock(bookId: string, quantity: number): Promise<StockItem>;
}

export interface CartStoragePort {
  load(): Cart;
  save(cart: Cart): void;
  clear(): void;
}

export interface Ports {
  catalog: CatalogPort;
  orders: OrdersPort;
  inventory: InventoryPort;
  cart: CartStoragePort;
}
