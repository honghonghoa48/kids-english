import { Word, LESSONS } from './lessons';

export type GameId = 'word-match' | 'memory-cards';

export interface GameMeta {
  id: GameId;
  title: string;
  titleVi: string;
  emoji: string;
  color: string;
  description: string;
  unlockAfter: number; // số bài học phải hoàn thành
}

export const GAMES: GameMeta[] = [
  {
    id: 'word-match',
    title: 'Word Match',
    titleVi: 'Ghép Từ',
    emoji: '🎯',
    color: '#F472B6',
    description: 'Ghép từ tiếng Anh với hình ảnh đúng.',
    unlockAfter: 0,
  },
  {
    id: 'memory-cards',
    title: 'Memory Cards',
    titleVi: 'Lật Thẻ Tìm Cặp',
    emoji: '🧠',
    color: '#A78BFA',
    description: 'Lật thẻ và tìm các cặp từ - hình giống nhau.',
    unlockAfter: 1,
  },
];

export function getGameMeta(id: GameId): GameMeta | undefined {
  return GAMES.find((g) => g.id === id);
}

/**
 * Lấy tất cả từ vựng từ các bài học đã hoàn thành (hoặc tất cả nếu chưa có tiến độ).
 */
export function getWordPool(completedLessonIds: string[]): Word[] {
  const sourceLessons =
    completedLessonIds.length > 0
      ? LESSONS.filter((l) => completedLessonIds.includes(l.id))
      : LESSONS;
  const pool: Word[] = [];
  for (const lesson of sourceLessons) {
    pool.push(...lesson.words);
  }
  // dedupe by en
  const seen = new Set<string>();
  return pool.filter((w) => {
    if (seen.has(w.en)) return false;
    seen.add(w.en);
    return true;
  });
}

export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
