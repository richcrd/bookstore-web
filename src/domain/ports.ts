import { Book, CreateOrderItems, Order, Page, StockItem } from "./models";

export interface CatalogPort {
  getBooks(search?: string, page?: number, pageSize?: number): Promise<Page<Book>>;
}

export interface OrdersPort {
  getOrders(customerId: string): Promise<Page<Order>>;
  createOrder(input: CreateOrderItems): Promise<Order>;
}

export interface InventoryPort {
  getStockItems(): Promise<Page<StockItem>>;
  addStock(bookId: string, quantity: number): Promise<StockItem>;
}

export interface Ports {
  catalog: CatalogPort;
  orders: OrdersPort;
  inventory: InventoryPort;
}
