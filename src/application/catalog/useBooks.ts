import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ports } from '../../infrastructure/di';
import { queryKeys } from '../queryKeys';

export function useBooks(search: string, page = 1) {
  return useQuery({
    queryKey: queryKeys.catalog.list(search, page),
    queryFn: () => ports.catalog.getBooks(search, page),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}
