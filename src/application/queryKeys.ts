export const queryKeys = {
  catalog: {
    all: ['books'] as const,
    list: (search: string) => ['books', search] as const,
  },
  orders: {
    all: ['orders'] as const,
    forCustomer: (customerId: string) => ['orders', customerId] as const,
  },
  stock: {
    all: ['stock'] as const,
  },
};
