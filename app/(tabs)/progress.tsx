import { StyleSheet, Text, View } from 'react-native';

import { BigButton } from '@/components/big-button';
import { Card } from '@/components/card';
import { ProgressBar } from '@/components/progress-bar';
import { Screen } from '@/components/screen';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { GAMES } from '@/data/games';
import { getLessonById, getLessonsByLevel, LEVELS } from '@/data/lessons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useProgress } from '@/hooks/use-progress';

export default function ProgressScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { progress, resetProgress } = useProgress();

  const totalLessons = LEVELS.reduce(
    (sum, l) => sum + getLessonsByLevel(l.id).length,
    0,
  );
  const completedTotal = progress.completedLessons.length;
  const overallPct = totalLessons > 0 ? completedTotal / totalLessons : 0;

  const avgScore =
    Object.values(progress.lessonScores).length > 0
      ? Object.values(progress.lessonScores).reduce((a, b) => a + b, 0) /
        Object.values(progress.lessonScores).length
      : 0;

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>📊</Text>
        <Text style={[styles.title, { color: theme.text, fontFamily: Fonts?.rounded }]}>
          Tiến độ học tập
        </Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>
          Theo dõi hành trình của bé
        </Text>
      </View>

      <Card background={theme.surface} style={styles.bigCard}>
        <Text style={[styles.cardLabel, { color: theme.muted }]}>Tổng quan</Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: theme.primary }]}>
              {completedTotal}
            </Text>
            <Text style={[styles.statLabel, { color: theme.muted }]}>Bài đã học</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: theme.secondary }]}>
              {Math.round(avgScore * 100)}%
            </Text>
            <Text style={[styles.statLabel, { color: theme.muted }]}>Điểm TB</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: theme.accent }]}>
              {Object.values(progress.gameHighScores).reduce((a, b) => a + b, 0)}
            </Text>
            <Text style={[styles.statLabel, { color: theme.muted }]}>Điểm game</Text>
          </View>
        </View>
        <View style={{ marginTop: Spacing.md }}>
          <ProgressBar value={overallPct} color={theme.primary} />
          <Text style={[styles.overallText, { color: theme.muted }]}>
            {completedTotal} / {totalLessons} bài học
          </Text>
        </View>
      </Card>

      {LEVELS.map((level) => {
        const lessons = getLessonsByLevel(level.id);
        return (
          <View key={level.id} style={styles.levelSection}>
            <View style={styles.levelHeader}>
              <Text style={styles.levelEmoji}>{level.emoji}</Text>
              <Text style={[styles.levelTitle, { color: theme.text }]}>
                {level.titleVi}
              </Text>
            </View>
            {lessons.map((lesson) => {
              const done = progress.completedLessons.includes(lesson.id);
              const score = progress.lessonScores[lesson.id] ?? 0;
              return (
                <Card
                  key={lesson.id}
                  background={theme.surface}
                  style={styles.lessonRow}>
                  <View style={styles.lessonInner}>
                    <Text style={styles.lessonEmoji}>{lesson.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.lessonTitle, { color: theme.text }]}>
                        {lesson.titleVi}
                      </Text>
                      <Text style={[styles.lessonStatus, { color: theme.muted }]}>
                        {done
                          ? `Đã hoàn thành - ${Math.round(score * 100)}%`
                          : 'Chưa học'}
                      </Text>
                    </View>
                    <Text style={styles.lessonBadge}>
                      {done ? '✅' : '⏳'}
                    </Text>
                  </View>
                </Card>
              );
            })}
          </View>
        );
      })}

      <View style={styles.gamesSection}>
        <Text style={[styles.levelTitle, { color: theme.text }]}>🎮 Thành tích mini-game</Text>
        {GAMES.map((game) => {
          const score = progress.gameHighScores[game.id] ?? 0;
          return (
            <Card
              key={game.id}
              background={theme.surface}
              style={styles.lessonRow}>
              <View style={styles.lessonInner}>
                <Text style={styles.lessonEmoji}>{game.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.lessonTitle, { color: theme.text }]}>
                    {game.titleVi}
                  </Text>
                  <Text style={[styles.lessonStatus, { color: theme.muted }]}>
                    Kỷ lục: {score} điểm
                  </Text>
                </View>
              </View>
            </Card>
          );
        })}
      </View>

      {completedTotal > 0 ? (
        <View style={styles.resetContainer}>
          <BigButton
            label="Đặt lại tiến độ"
            color={theme.danger}
            onPress={resetProgress}
            emoji="🔄"
          />
        </View>
      ) : null}
      <View style={{ height: Spacing.xxl }} />
    </Screen>
  );
}

// keep helper for potential future use (avoids unused warnings)
export const _internal = { getLessonById };

const styles = StyleSheet.create({
  header: {
    marginBottom: Spacing.lg,
  },
  headerEmoji: {
    fontSize: 44,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    marginTop: Spacing.xs,
  },
  subtitle: {
    fontSize: 15,
    marginTop: 2,
  },
  bigCard: {
    marginBottom: Spacing.lg,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    gap: Spacing.md,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '900',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  overallText: {
    marginTop: Spacing.sm,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  levelSection: {
    marginBottom: Spacing.md,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  levelEmoji: {
    fontSize: 24,
  },
  levelTitle: {
    fontSize: 20,
    fontWeight: '900',
  },
  lessonRow: {
    marginBottom: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  lessonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  lessonEmoji: {
    fontSize: 28,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  lessonStatus: {
    fontSize: 12,
    marginTop: 2,
  },
  lessonBadge: {
    fontSize: 22,
  },
  gamesSection: {
    marginTop: Spacing.lg,
  },
  resetContainer: {
    marginTop: Spacing.xl,
  },
});
