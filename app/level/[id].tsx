import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/card';
import { ProgressBar } from '@/components/progress-bar';
import { Screen } from '@/components/screen';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { getLessonsByLevel, getLevelMeta, Lesson, LevelId } from '@/data/lessons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useProgress } from '@/hooks/use-progress';

export default function LevelScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { progress } = useProgress();

  const levelId = (id ?? 'tiny') as LevelId;
  const level = getLevelMeta(levelId);
  const lessons = getLessonsByLevel(levelId);

  if (!level) {
    return (
      <Screen>
        <Text style={{ color: theme.text }}>Không tìm thấy cấp độ này.</Text>
      </Screen>
    );
  }

  const completedInLevel = lessons.filter((l) =>
    progress.completedLessons.includes(l.id),
  ).length;

  return (
    <Screen background={level.color}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>{level.emoji}</Text>
        <Text style={[styles.headerTitle, { fontFamily: Fonts?.rounded }]}>
          {level.titleVi}
        </Text>
        <Text style={styles.headerSubtitle}>
          {level.title} · {level.ageRange}
        </Text>
        <Text style={styles.headerDesc}>{level.description}</Text>
        <View style={styles.headerProgress}>
          <ProgressBar
            value={completedInLevel / lessons.length}
            color="#FFFFFF"
            background="rgba(255,255,255,0.3)"
          />
          <Text style={styles.headerProgressText}>
            {completedInLevel} / {lessons.length} bài
          </Text>
        </View>
      </View>

      <View style={styles.lessonsContainer}>
        <Text style={styles.sectionTitle}>Bài học</Text>
        {lessons.map((lesson, idx) => (
          <LessonCard
            key={lesson.id}
            index={idx}
            lesson={lesson}
            completed={progress.completedLessons.includes(lesson.id)}
            score={progress.lessonScores[lesson.id] ?? 0}
            onPress={() => router.push(`/lesson/${lesson.id}`)}
          />
        ))}
      </View>
    </Screen>
  );
}

function LessonCard({
  index,
  lesson,
  completed,
  score,
  onPress,
}: {
  index: number;
  lesson: Lesson;
  completed: boolean;
  score: number;
  onPress: () => void;
}) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  return (
    <Card onPress={onPress} background={theme.surface} style={styles.lessonCard}>
      <View style={styles.lessonRow}>
        <View style={[styles.lessonNumber, { backgroundColor: lesson.color }]}>
          <Text style={styles.lessonNumberText}>{index + 1}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.lessonEmoji]}>{lesson.emoji}</Text>
          <Text style={[styles.lessonTitleVi, { color: theme.text }]}>
            {lesson.titleVi}
          </Text>
          <Text style={[styles.lessonTitleEn, { color: theme.muted }]}>
            {lesson.title} · {lesson.words.length} từ
          </Text>
        </View>
        <View style={styles.lessonRight}>
          {completed ? (
            <View style={[styles.statusBadge, { backgroundColor: theme.success }]}>
              <IconSymbol name="checkmark.circle.fill" size={16} color="#FFFFFF" />
              <Text style={styles.statusText}>{Math.round(score * 100)}%</Text>
            </View>
          ) : (
            <View style={[styles.statusBadge, { backgroundColor: lesson.color }]}>
              <IconSymbol name="play.fill" size={16} color="#FFFFFF" />
              <Text style={styles.statusText}>Học</Text>
            </View>
          )}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  headerEmoji: {
    fontSize: 56,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  headerDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.95)',
    marginTop: Spacing.sm,
    lineHeight: 20,
  },
  headerProgress: {
    marginTop: Spacing.lg,
  },
  headerProgressText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '700',
    marginTop: Spacing.xs,
    textAlign: 'right',
  },
  lessonsContainer: {
    backgroundColor: '#FFFFFFEE',
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginTop: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1F2937',
    marginBottom: Spacing.md,
  },
  lessonCard: {
    marginBottom: Spacing.sm,
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  lessonNumber: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonNumberText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 18,
  },
  lessonEmoji: {
    fontSize: 22,
  },
  lessonTitleVi: {
    fontSize: 18,
    fontWeight: '800',
  },
  lessonTitleEn: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  lessonRight: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
});
