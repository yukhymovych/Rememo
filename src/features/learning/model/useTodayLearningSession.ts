import { useQuery } from '@tanstack/react-query';
import * as learningApi from '../api/learningApi';
import {
  LEARNING_KEYS,
  getBrowserTimezone,
} from './learning.queries';

export function useTodayLearningSession() {
  const timezone = getBrowserTimezone();
  return useQuery({
    queryKey: LEARNING_KEYS.todaySession(timezone),
    queryFn: () => learningApi.getTodaySession(timezone),
  });
}
