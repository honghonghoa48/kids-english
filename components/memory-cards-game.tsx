import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BigButton } from '@/components/big-button';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { getWordPool, shuffle } from '@/data/games';
import { Word } from '@/data/lessons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTTS } from '@/hooks/use-tts';

const PAIR_COUNT = 6;

interface CardModel {
  id: string;
  pairKey: string;
  face: 'word' | 'emoji';
  word: Word;
  matched: boolean;
}

function buildBoard(pool: Word[]): CardModel[] {
  if (pool.length < PAIR_COUNT) return [];
  const picks = shuffle(pool).slice(0, PAIR_COUNT);
  const cards: CardModel[] = [];
  picks.forEach((w) => {
    cards.push({ id: `${w.en}-word`, pairKey: w.en, face: 'word', word: w, matched: false });
    cards.push({ id: `${w.en}-emoji`, pairKey: w.en, face: 'emoji', word: w, matched: false });
  });
  return shuffle(cards);
}

interface Props {
  completedLessonIds: string[];
  onFinish: (score: number) => void;
  themeColor: string;
}

export function MemoryCardsGame({ completedLessonIds, onFinish, themeColor }: Props) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { speak } = useTTS();

  const [seed, setSeed] = useState(0);
  const initialBoard = useMemo(() => {
    void seed; // re-derive board whenever the user replays
    const pool = getWordPool(completedLessonIds);
    return buildBoard(pool);
  }, [completedLessonIds, seed]);

  const [board, setBoard] = useState<CardModel[]>(initialBoard);
  const [flipped, setFlipped] = useState<number[]>([]); // indices currently revealed but not matched
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [busy, setBusy] = useState(false);

  // reset board when seed changes
  useEffect(() => {
    setBoard(initialBoard);
    setFlipped([]);
    setMoves(0);
    setMatches(0);
    setBusy(false);
  }, [initialBoard]);

  // finish check
  useEffect(() => {
    if (board.length > 0 && matches === PAIR_COUNT) {
      // score: base 100, deduct 5 per excessive move beyond perfect (PAIR_COUNT moves)
      const minMoves = PAIR_COUNT;
      const penalty = Math.max(0, (moves - minMoves) * 5);
      const finalScore = Math.max(20, 100 - penalty);
      onFinish(finalScore);
    }
  }, [matches, moves, board.length, onFinish]);

  if (initialBoard.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyEmoji}>🔒</Text>
        <Text style={[styles.emptyText, { color: theme.text }]}>
          Cần hoàn thành ít nhất 1 bài học để chơi.
        </Text>
      </View>
    );
  }

  const handleFlip = (idx: number) => {
    if (busy) return;
    const card = board[idx];
    if (card.matched) return;
    if (flipped.includes(idx)) return;

    if (card.face === 'word') speak(card.word.en);

    if (flipped.length === 0) {
      setFlipped([idx]);
      return;
    }
    if (flipped.length === 1) {
      const firstIdx = flipped[0];
      const first = board[firstIdx];
      setFlipped([firstIdx, idx]);
      setMoves((m) => m + 1);
      setBusy(true);

      if (first.pairKey === card.pairKey) {
        setTimeout(() => {
          setBoard((prev) =>
            prev.map((c, i) =>
              i === firstIdx || i === idx ? { ...c, matched: true } : c,
            ),
          );
          setMatches((m) => m + 1);
          setFlipped([]);
          setBusy(false);
        }, 700);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setBusy(false);
        }, 1100);
      }
    }
  };

  const won = matches === PAIR_COUNT;

  if (won) {
    const finalScore = Math.max(20, 100 - Math.max(0, (moves - PAIR_COUNT) * 5));
    return (
      <View style={styles.resultWrap}>
        <Text style={styles.resultEmoji}>🏆</Text>
        <Text style={[styles.resultTitle, { fontFamily: Fonts?.rounded }]}>
          Tuyệt vời!
        </Text>
        <Text style={styles.resultLine}>Số nước: {moves}</Text>
        <Text style={styles.resultScore}>{finalScore} điểm</Text>
        <View style={styles.resultActions}>
          <BigButton
            label="Chơi lại"
            emoji="🔄"
            color="#FFFFFF"
            textColor={themeColor}
            onPress={() => setSeed((s) => s + 1)}
          />
        </View>
      </View>
    );
  }

  return (
    <View>
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Cặp tìm được</Text>
          <Text style={styles.statValue}>{matches} / {PAIR_COUNT}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Số nước</Text>
          <Text style={styles.statValue}>{moves}</Text>
        </View>
      </View>

      <View style={styles.grid}>
        {board.map((card, idx) => {
          const isOpen = flipped.includes(idx) || card.matched;
          return (
            <Pressable
              key={card.id}
              onPress={() => handleFlip(idx)}
              style={({ pressed }) => [
                styles.tile,
                {
                  backgroundColor: card.matched
                    ? '#DCFCE7'
                    : isOpen
                      ? '#FFFFFF'
                      : 'rgba(255,255,255,0.35)',
                  borderColor: card.matched ? theme.success : 'rgba(255,255,255,0.6)',
                  opacity: pressed && !card.matched ? 0.85 : 1,
                },
              ]}>
              {isOpen ? (
                card.face === 'emoji' ? (
                  <Text style={styles.tileEmoji}>{card.word.emoji}</Text>
                ) : (
                  <Text style={[styles.tileWord, { color: theme.text }]}>
                    {card.word.en}
                  </Text>
                )
              ) : (
                <Text style={styles.tileBack}>?</Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    paddingVertical: Spacing.xxl,
    alignItems: 'center',
    gap: Spacing.md,
  },
  emptyEmoji: {
    fontSize: 64,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.95)',
    fontWeight: '700',
  },
  statValue: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '900',
    marginTop: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  tile: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: Radius.lg,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  tileEmoji: {
    fontSize: 48,
  },
  tileWord: {
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  tileBack: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  resultWrap: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.sm,
  },
  resultEmoji: {
    fontSize: 96,
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  resultLine: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  resultScore: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  resultActions: {
    width: '100%',
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
});
