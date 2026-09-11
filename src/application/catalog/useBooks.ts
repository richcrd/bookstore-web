import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ports } from '../../infrastructure/di';
import { queryKeys } from '../queryKeys';

export function useBooks(search: string) {
  return useQuery({
    queryKey: queryKeys.catalog.list(search),
    queryFn: () => ports.catalog.getBooks(search),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}
