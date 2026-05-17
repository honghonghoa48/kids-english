import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = '@kids-english/progress/v1';

export interface Progress {
  completedLessons: string[];
  lessonScores: Record<string, number>; // 0..1
  gameHighScores: Record<string, number>;
}

const DEFAULT_PROGRESS: Progress = {
  completedLessons: [],
  lessonScores: {},
  gameHighScores: {},
};

async function loadProgress(): Promise<Progress> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      completedLessons: parsed.completedLessons ?? [],
      lessonScores: parsed.lessonScores ?? {},
      gameHighScores: parsed.gameHighScores ?? {},
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

async function saveProgress(progress: Progress): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // best-effort
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(DEFAULT_PROGRESS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadProgress().then((p) => {
      if (!cancelled) {
        setProgress(p);
        setLoaded(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const completeLesson = useCallback(
    (lessonId: string, score: number) => {
      setProgress((prev) => {
        const next: Progress = {
          completedLessons: prev.completedLessons.includes(lessonId)
            ? prev.completedLessons
            : [...prev.completedLessons, lessonId],
          lessonScores: {
            ...prev.lessonScores,
            [lessonId]: Math.max(prev.lessonScores[lessonId] ?? 0, score),
          },
          gameHighScores: prev.gameHighScores,
        };
        saveProgress(next);
        return next;
      });
    },
    [],
  );

  const recordGameScore = useCallback((gameId: string, score: number) => {
    setProgress((prev) => {
      const current = prev.gameHighScores[gameId] ?? 0;
      if (score <= current) return prev;
      const next: Progress = {
        ...prev,
        gameHighScores: { ...prev.gameHighScores, [gameId]: score },
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
    saveProgress(DEFAULT_PROGRESS);
  }, []);

  return { progress, loaded, completeLesson, recordGameScore, resetProgress };
}
