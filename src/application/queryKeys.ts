export const queryKeys = {
  catalog: {
    all: ['books'] as const,
    list: (search: string, page: number) => ['books', search, page] as const,
  },
  orders: {
    all: ['orders'] as const,
    forCustomer: (customerId: string, page: number) => ['orders', customerId, page] as const,
  },
  stock: {
    all: ['stock'] as const,
  },
};
