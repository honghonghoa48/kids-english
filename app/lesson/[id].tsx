import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BigButton } from '@/components/big-button';
import { Card } from '@/components/card';
import { ProgressBar } from '@/components/progress-bar';
import { Screen } from '@/components/screen';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { getLessonById } from '@/data/lessons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTTS } from '@/hooks/use-tts';

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { speak } = useTTS();
  const [index, setIndex] = useState(0);

  const lesson = id ? getLessonById(id) : undefined;

  if (!lesson) {
    return (
      <Screen>
        <Text style={{ color: theme.text }}>Không tìm thấy bài học.</Text>
      </Screen>
    );
  }

  const word = lesson.words[index];
  const isLast = index === lesson.words.length - 1;
  const progress = (index + 1) / lesson.words.length;

  return (
    <Screen background={lesson.color}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>{lesson.emoji}</Text>
        <Text style={[styles.title, { fontFamily: Fonts?.rounded }]}>{lesson.titleVi}</Text>
        <Text style={styles.subtitle}>{lesson.title}</Text>
      </View>

      <View style={styles.progressWrap}>
        <ProgressBar value={progress} color="#FFFFFF" background="rgba(255,255,255,0.35)" />
        <Text style={styles.progressText}>
          Từ {index + 1} / {lesson.words.length}
        </Text>
      </View>

      <Card background="#FFFFFF" style={styles.wordCard}>
        <Text style={styles.wordEmoji}>{word.emoji}</Text>
        <Text style={[styles.wordEn, { color: theme.text }]}>{word.en}</Text>
        {word.ipa ? (
          <Text style={[styles.wordIpa, { color: theme.muted }]}>{word.ipa}</Text>
        ) : null}
        <Text style={[styles.wordVi, { color: theme.muted }]}>{word.vi}</Text>

        <Pressable
          onPress={() => speak(word.en)}
          style={({ pressed }) => [
            styles.speakBtn,
            { backgroundColor: lesson.color, opacity: pressed ? 0.85 : 1 },
          ]}>
          <IconSymbol name="speaker.wave.2.fill" size={28} color="#FFFFFF" />
          <Text style={styles.speakBtnText}>Nghe phát âm</Text>
        </Pressable>
      </Card>

      <View style={styles.navRow}>
        <BigButton
          label="Trước"
          color="rgba(255,255,255,0.35)"
          textColor="#FFFFFF"
          fullWidth={false}
          disabled={index === 0}
          onPress={() => setIndex((i) => Math.max(0, i - 1))}
          style={styles.navBtn}
        />
        {isLast ? (
          <BigButton
            label="Làm bài tập"
            color="#22C55E"
            emoji="✏️"
            fullWidth={false}
            style={styles.navBtnMain}
            onPress={() => router.replace(`/exercise/${lesson.id}`)}
          />
        ) : (
          <BigButton
            label="Tiếp"
            color="#FFFFFF"
            textColor={lesson.color}
            fullWidth={false}
            style={styles.navBtnMain}
            onPress={() => setIndex((i) => Math.min(lesson.words.length - 1, i + 1))}
          />
        )}
      </View>

      <View style={styles.allWords}>
        <Text style={styles.allWordsTitle}>Tất cả từ trong bài</Text>
        <View style={styles.wordsGrid}>
          {lesson.words.map((w, i) => (
            <Pressable
              key={w.en}
              onPress={() => {
                setIndex(i);
                speak(w.en);
              }}
              style={({ pressed }) => [
                styles.wordChip,
                {
                  backgroundColor: i === index ? '#FFFFFF' : 'rgba(255,255,255,0.25)',
                  opacity: pressed ? 0.85 : 1,
                },
              ]}>
              <Text style={styles.wordChipEmoji}>{w.emoji}</Text>
              <Text
                style={[
                  styles.wordChipText,
                  { color: i === index ? lesson.color : '#FFFFFF' },
                ]}>
                {w.en}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  headerEmoji: {
    fontSize: 48,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
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
  wordCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    marginBottom: Spacing.lg,
  },
  wordEmoji: {
    fontSize: 96,
    marginBottom: Spacing.md,
  },
  wordEn: {
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  wordIpa: {
    fontSize: 18,
    marginTop: 4,
    fontStyle: 'italic',
  },
  wordVi: {
    fontSize: 18,
    marginTop: Spacing.sm,
    fontWeight: '600',
  },
  speakBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.xl,
    marginTop: Spacing.xl,
  },
  speakBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  navRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  navBtn: {
    flex: 1,
  },
  navBtnMain: {
    flex: 2,
  },
  allWords: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  allWordsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: Spacing.sm,
  },
  wordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  wordChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
  },
  wordChipEmoji: {
    fontSize: 18,
  },
  wordChipText: {
    fontSize: 14,
    fontWeight: '800',
  },
});
