import { useQuery } from '@tanstack/react-query';
import { ports } from '../../infrastructure/di';
import { queryKeys } from '../queryKeys';
import { isOrderFinished } from './orderStatus';

export function useMyOrders(customerId: string | null, page = 1) {
  return useQuery({
    queryKey: queryKeys.orders.forCustomer(customerId ?? '', page),
    queryFn: () => ports.orders.getOrders(customerId!, page),
    enabled: Boolean(customerId),
    refetchInterval: (query) =>
      query.state.data?.items.some((order) => !isOrderFinished(order.status)) ? 2000 : false,
  });
}
