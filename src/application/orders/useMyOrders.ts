import { useQuery } from '@tanstack/react-query';
import { ports } from '../../infrastructure/di';
import { queryKeys } from '../queryKeys';

export function useMyOrders(customerId: string | null) {
  return useQuery({
    queryKey: queryKeys.orders.forCustomer(customerId ?? ''),
    queryFn: () => ports.orders.getOrders(customerId!),
    enabled: Boolean(customerId),
  });
}
