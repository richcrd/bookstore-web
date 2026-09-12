import { useQuery } from '@tanstack/react-query';
import { ports } from '../../infrastructure/di';
import { queryKeys } from '../queryKeys';
import { isOrderFinished } from './orderStatus';

export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.orders.byId(id ?? ''),
    queryFn: () => ports.orders.getOrder(id!),
    enabled: Boolean(id),
    refetchInterval: (query) =>
      query.state.data && !isOrderFinished(query.state.data.status) ? 2000 : false,
  });
}