import { useQuery } from '@tanstack/react-query';
import * as learningApi from '../api/learningApi';
import { LEARNING_KEYS } from './learning.queries';

export function useDueStudyItemsCount(enabled: boolean) {
  return useQuery({
    queryKey: [...LEARNING_KEYS.all, 'dueCount'],
    queryFn: () => learningApi.getDueStudyItemsCount(),
    enabled,
  });
}
