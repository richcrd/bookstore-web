import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ports } from '../../infrastructure/di';
import { queryKeys } from '../queryKeys';

export function useAddStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookId, quantity }: { bookId: string; quantity: number }) =>
      ports.inventory.addStock(bookId, quantity),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.stock.all });
    },
  });
}
