import { useQuery } from '@tanstack/react-query';
import * as learningApi from '../api/learningApi';
import {
  LEARNING_KEYS,
} from './learning.queries';

export function useDescendantsWithLearningCount(rootNoteId: string | undefined) {
  return useQuery({
    queryKey: [...LEARNING_KEYS.all, 'descendantsWithLearning', rootNoteId ?? ''],
    queryFn: () => learningApi.getDescendantsWithLearningCount(rootNoteId!),
    enabled: !!rootNoteId,
  });
}
