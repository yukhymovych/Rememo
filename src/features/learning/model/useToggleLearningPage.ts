import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as learningApi from '../api/learningApi';
import { LEARNING_KEYS } from './learning.queries';

export function useActivateLearningPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pageId: string) => learningApi.activateStudyItem(pageId),
    onSuccess: (_, pageId) => {
      queryClient.invalidateQueries({ queryKey: LEARNING_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: LEARNING_KEYS.studyItemStatus(pageId),
      });
    },
  });
}

export function useActivateLearningPageScoped() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scopePageId: string) =>
      learningApi.activateStudyItemScoped(scopePageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEARNING_KEYS.all });
    },
  });
}

export function useDeactivateLearningPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pageId: string) => learningApi.deactivateStudyItem(pageId),
    onSuccess: (_, pageId) => {
      queryClient.invalidateQueries({ queryKey: LEARNING_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: LEARNING_KEYS.studyItemStatus(pageId),
      });
    },
  });
}
