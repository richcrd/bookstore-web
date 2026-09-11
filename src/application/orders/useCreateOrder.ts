import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ports } from '../../infrastructure/di';
import { queryKeys } from '../queryKeys';

export function useCreateOrder(customerId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: Array<{ bookId: string; quantity: number }>) =>
      ports.orders.createOrder({ customerId, items }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });
}
