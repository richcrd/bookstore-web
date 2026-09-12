import { useQuery } from '@tanstack/react-query';
import { ports } from '../../infrastructure/di';
import { queryKeys } from '../queryKeys';

export function useMyOrders(customerId: string | null, page = 1) {
  return useQuery({
    queryKey: queryKeys.orders.forCustomer(customerId ?? '', page),
    queryFn: () => ports.orders.getOrders(customerId!, page),
    enabled: Boolean(customerId),
  });
}
