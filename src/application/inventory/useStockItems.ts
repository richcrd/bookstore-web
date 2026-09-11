import { useQuery } from '@tanstack/react-query';
import { ports } from '../../infrastructure/di';
import { queryKeys } from '../queryKeys';

export function useStockItems() {
  return useQuery({
    queryKey: queryKeys.stock.all,
    queryFn: () => ports.inventory.getStockItems(),
  });
}
