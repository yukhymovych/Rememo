import { useQuery } from '@tanstack/react-query';
import * as learningApi from '../api/learningApi';
import { LEARNING_KEYS } from './learning.queries';

export function useStudyItemStatus(pageId: string | null) {
  return useQuery({
    queryKey: LEARNING_KEYS.studyItemStatus(pageId ?? ''),
    queryFn: () => learningApi.getStudyItemStatus(pageId!),
    enabled: !!pageId,
  });
}
