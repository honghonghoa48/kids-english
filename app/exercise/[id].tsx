import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BigButton } from '@/components/big-button';
import { Card } from '@/components/card';
import { ProgressBar } from '@/components/progress-bar';
import { Screen } from '@/components/screen';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { Exercise, getLessonById } from '@/data/lessons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useProgress } from '@/hooks/use-progress';
import { useTTS } from '@/hooks/use-tts';

type Status = 'idle' | 'correct' | 'wrong';

export default function ExerciseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { speak } = useTTS();
  const { completeLesson } = useProgress();

  const lesson = useMemo(() => (id ? getLessonById(id) : undefined), [id]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [savedScore, setSavedScore] = useState<number | null>(null);

  if (!lesson) {
    return (
      <Screen>
        <Text style={{ color: theme.text }}>Không tìm thấy bài học.</Text>
      </Screen>
    );
  }

  const total = lesson.exercises.length;

  if (finished) {
    const score = correctCount / total;
    if (savedScore === null) {
      completeLesson(lesson.id, score);
      setSavedScore(score);
    }
    return (
      <Screen background={lesson.color}>
        <View style={styles.resultContainer}>
          <Text style={styles.resultEmoji}>{score >= 0.8 ? '🏆' : score >= 0.5 ? '🌟' : '💪'}</Text>
          <Text style={[styles.resultTitle, { fontFamily: Fonts?.rounded }]}>
            {score >= 0.8 ? 'Tuyệt vời!' : score >= 0.5 ? 'Tốt lắm!' : 'Cố gắng nhé!'}
          </Text>
          <Text style={styles.resultSubtitle}>
            Bé làm đúng {correctCount} / {total} câu
          </Text>
          <Text style={styles.resultScore}>{Math.round(score * 100)}%</Text>

          <View style={styles.resultActions}>
            <BigButton
              label="Học lại"
              emoji="🔄"
              color="rgba(255,255,255,0.35)"
              textColor="#FFFFFF"
              onPress={() => {
                setIndex(0);
                setSelected(null);
                setStatus('idle');
                setCorrectCount(0);
                setFinished(false);
                setSavedScore(null);
              }}
            />
            <BigButton
              label="Chơi Mini Game"
              emoji="🎮"
              color="#FFFFFF"
              textColor={lesson.color}
              onPress={() => router.replace('/(tabs)/games')}
            />
            <BigButton
              label="Về trang chủ"
              emoji="🏠"
              color="rgba(255,255,255,0.35)"
              textColor="#FFFFFF"
              onPress={() => router.replace('/(tabs)')}
            />
          </View>
        </View>
      </Screen>
    );
  }

  const ex = lesson.exercises[index];
  const progress = (index + (status !== 'idle' ? 1 : 0)) / total;

  const handleSelect = (optIndex: number) => {
    if (status !== 'idle') return;
    setSelected(optIndex);
    const isCorrect = optIndex === ex.correctIndex;
    setStatus(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setCorrectCount((c) => c + 1);

    // Read aloud the correct word when relevant
    const spokenWord = getSpokenWord(ex, optIndex);
    if (isCorrect && spokenWord) speak(spokenWord);
  };

  const handleNext = () => {
    if (index >= total - 1) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
      setStatus('idle');
    }
  };

  return (
    <Screen background={lesson.color}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>{lesson.emoji}</Text>
        <Text style={[styles.title, { fontFamily: Fonts?.rounded }]}>
          Bài tập: {lesson.titleVi}
        </Text>
      </View>

      <View style={styles.progressWrap}>
        <ProgressBar value={progress} color="#FFFFFF" background="rgba(255,255,255,0.35)" />
        <Text style={styles.progressText}>
          Câu {index + 1} / {total}
        </Text>
      </View>

      <Card background="#FFFFFF" style={styles.questionCard}>
        <ExerciseQuestion exercise={ex} onSpeak={speak} />
        <View style={styles.optionsContainer}>
          {renderOptions(ex).map((opt, i) => {
            const isSelected = selected === i;
            const isCorrect = i === ex.correctIndex;
            let bg = theme.surface;
            let border = theme.border;
            let textColor = theme.text;
            if (status !== 'idle') {
              if (isCorrect) {
                bg = '#DCFCE7';
                border = theme.success;
                textColor = theme.success;
              } else if (isSelected && !isCorrect) {
                bg = '#FEE2E2';
                border = theme.danger;
                textColor = theme.danger;
              }
            } else if (isSelected) {
              bg = '#FDF2F8';
              border = theme.primary;
            }

            return (
              <Pressable
                key={i}
                onPress={() => handleSelect(i)}
                style={({ pressed }) => [
                  styles.option,
                  {
                    backgroundColor: bg,
                    borderColor: border,
                    opacity: pressed && status === 'idle' ? 0.85 : 1,
                  },
                ]}>
                {opt.emoji ? <Text style={styles.optionEmoji}>{opt.emoji}</Text> : null}
                <Text style={[styles.optionLabel, { color: textColor }]}>{opt.label}</Text>
                {status !== 'idle' && isCorrect ? (
                  <IconSymbol name="checkmark.circle.fill" size={24} color={theme.success} />
                ) : null}
                {status !== 'idle' && isSelected && !isCorrect ? (
                  <IconSymbol name="xmark.circle.fill" size={24} color={theme.danger} />
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </Card>

      {status !== 'idle' ? (
        <View style={styles.feedback}>
          <Text style={styles.feedbackText}>
            {status === 'correct' ? '🎉 Đúng rồi! Giỏi quá!' : '🤔 Sai mất rồi. Thử lại nhé!'}
          </Text>
          <BigButton
            label={index >= total - 1 ? 'Xem kết quả' : 'Câu tiếp theo'}
            emoji={index >= total - 1 ? '🏁' : '➡️'}
            color="#FFFFFF"
            textColor={lesson.color}
            onPress={handleNext}
          />
        </View>
      ) : null}
    </Screen>
  );
}

function ExerciseQuestion({
  exercise,
  onSpeak,
}: {
  exercise: Exercise;
  onSpeak: (word: string) => void;
}) {
  if (exercise.type === 'listen_choose') {
    return (
      <View style={styles.questionInner}>
        <Text style={styles.questionLabel}>Nghe và chọn từ đúng</Text>
        <Pressable
          onPress={() => onSpeak(exercise.promptWord)}
          style={({ pressed }) => [
            styles.bigSpeakBtn,
            { opacity: pressed ? 0.85 : 1 },
          ]}>
          <IconSymbol name="speaker.wave.2.fill" size={48} color="#FFFFFF" />
          <Text style={styles.bigSpeakText}>Bấm để nghe</Text>
        </Pressable>
      </View>
    );
  }
  if (exercise.type === 'match_word') {
    return (
      <View style={styles.questionInner}>
        <Text style={styles.questionLabel}>Hình này là gì?</Text>
        <Text style={styles.bigEmoji}>{exercise.promptEmoji}</Text>
      </View>
    );
  }
  return (
    <View style={styles.questionInner}>
      <Text style={styles.questionLabel}>Chọn đáp án đúng</Text>
      {exercise.emoji ? <Text style={styles.bigEmoji}>{exercise.emoji}</Text> : null}
      <Text style={styles.questionText}>{exercise.questionVi}</Text>
    </View>
  );
}

function renderOptions(ex: Exercise): { label: string; emoji?: string }[] {
  if (ex.type === 'listen_choose') {
    return ex.options.map((o) => ({ label: o.word, emoji: o.emoji }));
  }
  if (ex.type === 'match_word') {
    return ex.options.map((o) => ({ label: o }));
  }
  return ex.options.map((o) => ({ label: o }));
}

function getSpokenWord(ex: Exercise, optIndex: number): string | null {
  if (ex.type === 'listen_choose') return ex.options[optIndex]?.word ?? null;
  if (ex.type === 'match_word') return ex.options[optIndex] ?? null;
  return ex.options[optIndex] ?? null;
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  headerEmoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  progressWrap: {
    marginBottom: Spacing.lg,
  },
  progressText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'right',
    marginTop: 4,
  },
  questionCard: {
    marginBottom: Spacing.md,
  },
  questionInner: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  questionLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  bigEmoji: {
    fontSize: 96,
    marginBottom: Spacing.md,
  },
  questionText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  bigSpeakBtn: {
    backgroundColor: '#FF6B9D',
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.lg,
    gap: 4,
  },
  bigSpeakText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  optionsContainer: {
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 2,
    gap: Spacing.md,
  },
  optionEmoji: {
    fontSize: 28,
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: '800',
    flex: 1,
  },
  feedback: {
    marginTop: Spacing.md,
    gap: Spacing.md,
  },
  feedbackText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  resultContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  resultEmoji: {
    fontSize: 96,
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: Spacing.md,
  },
  resultSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.95)',
    fontWeight: '600',
    marginTop: 4,
  },
  resultScore: {
    fontSize: 56,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: Spacing.lg,
  },
  resultActions: {
    width: '100%',
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
});
