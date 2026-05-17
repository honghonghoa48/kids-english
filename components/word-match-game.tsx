import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BigButton } from '@/components/big-button';
import { Card } from '@/components/card';
import { ProgressBar } from '@/components/progress-bar';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { getWordPool, shuffle } from '@/data/games';
import { Word } from '@/data/lessons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTTS } from '@/hooks/use-tts';

const ROUND_SIZE = 6;
const OPTIONS_PER_ROUND = 4;

interface Round {
  target: Word;
  options: Word[]; // includes target
}

function buildRounds(pool: Word[]): Round[] {
  if (pool.length < OPTIONS_PER_ROUND) return [];
  const shuffled = shuffle(pool);
  const targets = shuffled.slice(0, Math.min(ROUND_SIZE, shuffled.length));
  return targets.map((target) => {
    const distractors = shuffle(pool.filter((w) => w.en !== target.en)).slice(
      0,
      OPTIONS_PER_ROUND - 1,
    );
    const options = shuffle([target, ...distractors]);
    return { target, options };
  });
}

interface Props {
  completedLessonIds: string[];
  onFinish: (score: number) => void;
  themeColor: string;
}

export function WordMatchGame({ completedLessonIds, onFinish, themeColor }: Props) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { speak } = useTTS();

  const [seed, setSeed] = useState(0);
  const rounds = useMemo(() => {
    void seed; // re-derive rounds whenever the user replays
    const pool = getWordPool(completedLessonIds);
    return buildRounds(pool);
  }, [completedLessonIds, seed]);

  const [roundIdx, setRoundIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);

  if (rounds.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyEmoji}>🔒</Text>
        <Text style={[styles.emptyText, { color: theme.text }]}>
          Cần hoàn thành ít nhất 1 bài học để có đủ từ vựng.
        </Text>
      </View>
    );
  }

  if (finished) {
    const finalScore = score * 10;
    return (
      <View style={styles.resultWrap}>
        <Text style={styles.resultEmoji}>{score >= rounds.length * 0.8 ? '🏆' : '🌟'}</Text>
        <Text style={[styles.resultTitle, { fontFamily: Fonts?.rounded }]}>
          {score} / {rounds.length} đúng
        </Text>
        <Text style={styles.resultScore}>{finalScore} điểm</Text>
        <View style={styles.resultActions}>
          <BigButton
            label="Chơi lại"
            emoji="🔄"
            color="#FFFFFF"
            textColor={themeColor}
            onPress={() => {
              setSeed((s) => s + 1);
              setRoundIdx(0);
              setSelected(null);
              setScore(0);
              setRevealed(false);
              setFinished(false);
            }}
          />
          <BigButton
            label="Xong"
            emoji="✅"
            color="rgba(255,255,255,0.35)"
            textColor="#FFFFFF"
            onPress={() => onFinish(finalScore)}
          />
        </View>
      </View>
    );
  }

  const round = rounds[roundIdx];
  const handleSelect = (i: number) => {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
    const chosen = round.options[i];
    speak(chosen.en);
    if (chosen.en === round.target.en) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (roundIdx >= rounds.length - 1) {
      onFinish(score * 10);
      setFinished(true);
    } else {
      setRoundIdx((i) => i + 1);
      setSelected(null);
      setRevealed(false);
    }
  };

  return (
    <View>
      <View style={styles.progressWrap}>
        <ProgressBar
          value={(roundIdx + (revealed ? 1 : 0)) / rounds.length}
          color="#FFFFFF"
          background="rgba(255,255,255,0.3)"
        />
        <View style={styles.progressRow}>
          <Text style={styles.progressText}>
            Câu {roundIdx + 1} / {rounds.length}
          </Text>
          <Text style={styles.progressText}>Điểm: {score * 10}</Text>
        </View>
      </View>

      <Card background="#FFFFFF" style={styles.questionCard}>
        <Text style={[styles.questionLabel, { color: theme.muted }]}>
          Tìm hình đúng cho từ
        </Text>
        <Text style={[styles.targetWord, { color: theme.text }]}>
          {round.target.en}
        </Text>
        <Pressable
          onPress={() => speak(round.target.en)}
          style={({ pressed }) => [
            styles.speakSmall,
            { backgroundColor: themeColor, opacity: pressed ? 0.85 : 1 },
          ]}>
          <IconSymbol name="speaker.wave.2.fill" size={18} color="#FFFFFF" />
          <Text style={styles.speakSmallText}>Nghe lại</Text>
        </Pressable>
      </Card>

      <View style={styles.optionsGrid}>
        {round.options.map((opt, i) => {
          const isCorrect = opt.en === round.target.en;
          const isSelected = selected === i;
          let bg = '#FFFFFF';
          let border = theme.border;
          if (revealed) {
            if (isCorrect) {
              bg = '#DCFCE7';
              border = theme.success;
            } else if (isSelected) {
              bg = '#FEE2E2';
              border = theme.danger;
            }
          }
          return (
            <Pressable
              key={i}
              onPress={() => handleSelect(i)}
              style={({ pressed }) => [
                styles.optionTile,
                {
                  backgroundColor: bg,
                  borderColor: border,
                  opacity: pressed && !revealed ? 0.85 : 1,
                },
              ]}>
              <Text style={styles.optionEmoji}>{opt.emoji}</Text>
              {revealed ? (
                <Text style={[styles.optionWord, { color: theme.muted }]}>
                  {opt.en}
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>

      {revealed ? (
        <View style={styles.actions}>
          <BigButton
            label={roundIdx >= rounds.length - 1 ? 'Xem kết quả' : 'Tiếp tục'}
            emoji={roundIdx >= rounds.length - 1 ? '🏁' : '➡️'}
            color="#FFFFFF"
            textColor={themeColor}
            onPress={handleNext}
          />
        </View>
      ) : null}
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
  progressWrap: {
    marginBottom: Spacing.md,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  progressText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  questionCard: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  questionLabel: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  targetWord: {
    fontSize: 40,
    fontWeight: '900',
  },
  speakSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: Spacing.sm,
  },
  speakSmallText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  optionTile: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: Radius.lg,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  optionEmoji: {
    fontSize: 60,
  },
  optionWord: {
    fontSize: 14,
    fontWeight: '700',
  },
  actions: {
    marginTop: Spacing.md,
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
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
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
