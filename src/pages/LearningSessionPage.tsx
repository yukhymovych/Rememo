import { useQuery } from '@tanstack/react-query';
import * as notesApi from '../features/notes/api/notesApi';
import { useTodayLearningSession } from '../features/learning/model/useTodayLearningSession';
import { useSubmitLearningGrade } from '../features/learning/model/useSubmitLearningGrade';
import { LearningProgressHeader } from '../features/learning/ui/LearningProgressHeader';
import { LearningReveal } from '../features/learning/ui/LearningReveal';
import { LearningGradeBar } from '../features/learning/ui/LearningGradeBar';
import { LearningSummary } from '../features/learning/ui/LearningSummary';
import { LearningAnimatedSwitch } from '../features/learning/ui/LearningAnimatedSwitch';
import type { Grade } from '../features/learning/domain/learning.types';
import '../features/learning/ui/LearningPage.css';

export function LearningSessionPage() {
  const { data: session, isLoading, error } = useTodayLearningSession();
  const submitGrade = useSubmitLearningGrade();

  const pendingItems = session?.items.filter((i) => i.state === 'pending') ?? [];
  const currentItem = pendingItems[0];
  const noteQuery = useQuery({
    queryKey: ['note', currentItem?.note_id],
    queryFn: () => notesApi.getNote(currentItem!.note_id!),
    enabled: !!currentItem?.note_id,
  });

  if (isLoading) {
    return <div className="learning-page-loading">Loading session...</div>;
  }

  if (error) {
    return (
      <div className="learning-page-error">
        Error: {error.message}
      </div>
    );
  }

  if (!session || session.items.length === 0) {
    return (
      <div className="learning-page-empty">
        <p>No items to review today.</p>
      </div>
    );
  }

  const allDone = pendingItems.length === 0;

  if (allDone) {
    return (
      <div className="learning-page">
        <LearningSummary items={session.items} />
      </div>
    );
  }

  if (!currentItem) {
    return (
      <div className="learning-page-empty">
        <p>No pending items.</p>
      </div>
    );
  }

  const doneCount = session.items.filter((i) => i.state === 'done').length;
  const displayIndex = doneCount;
  const note = noteQuery.data;
  const title = currentItem.title ?? note?.title ?? '(Untitled)';
  const content = note?.content_text ?? '';

  const handleGrade = (grade: Grade) => {
    if (submitGrade.isPending) return;
    submitGrade.mutate(
      { sessionItemId: currentItem.id, grade },
      {}
    );
  };

  return (
    <div className="learning-page">
      <LearningProgressHeader items={session.items} currentIndex={displayIndex} />
      <main className="learning-page__main">
        <LearningAnimatedSwitch key={currentItem.id}>
          <LearningReveal title={title} content={content} />
        </LearningAnimatedSwitch>
        <div className="learning-page__grade-bar">
          <LearningGradeBar
            onGrade={handleGrade}
            disabled={submitGrade.isPending}
          />
        </div>
      </main>
    </div>
  );
}
