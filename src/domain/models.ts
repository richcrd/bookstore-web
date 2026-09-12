export interface Book {
  id: string;
  title: string;
  isbn: string;
  description: string;
  author: string;
  price: number;
  currency: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface OrderItem {
  bookId: string;
  title: string;
  unitPrice: number;
  currency: string;
  quantity: number;
  lineTotal: number;
}

export type OrderStatus =
  | 'Pending'
  | 'AwaitingPayment'
  | 'PaymentApproved'
  | 'ShipmentRequested'
  | 'Shipped'
  | 'Completed'
  | 'Cancelled';

export interface Order {
  id: string;
  customerId: string;
  status: string;
  total: number;
  currency: string;
  createdAt: string;
  updatedAt: string | null;
  items: OrderItem[];
}

export interface CreateOrderItems {
  customerId: string;
  items: Array<{ bookId: string; quantity: number }>;
}

export interface StockItem {
  id: string;
  bookId: string;
  quantityOnHand: number;
  reservedQuantity: number;
  available: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface Page<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface CartItem {
  bookId: string;
  title: string;
  author: string;
  unitPrice: number;
  currency: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
}

export interface SessionUser {
  sub: string;
  name: string;
  roles: string[];
  customerId: string;
  accessToken: string | null;
}