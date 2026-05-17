import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/card';
import { ProgressBar } from '@/components/progress-bar';
import { Screen } from '@/components/screen';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { getLessonsByLevel, LEVELS, LevelMeta } from '@/data/lessons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useProgress } from '@/hooks/use-progress';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { progress } = useProgress();

  const totalLessons = LEVELS.reduce(
    (sum, l) => sum + getLessonsByLevel(l.id).length,
    0,
  );
  const completedTotal = progress.completedLessons.length;
  const overallPct = totalLessons > 0 ? completedTotal / totalLessons : 0;

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.greetingEmoji}>👋</Text>
        <Text style={[styles.greeting, { color: theme.text, fontFamily: Fonts?.rounded }]}>
          Xin chào bé!
        </Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>
          Hôm nay bé muốn học gì nào?
        </Text>
      </View>

      <Card background={theme.surface} style={styles.overviewCard}>
        <View style={styles.overviewRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.overviewLabel, { color: theme.muted }]}>Tiến độ tổng</Text>
            <Text style={[styles.overviewValue, { color: theme.text }]}>
              {completedTotal} / {totalLessons} bài
            </Text>
          </View>
          <Text style={styles.overviewEmoji}>🌟</Text>
        </View>
        <View style={{ marginTop: Spacing.md }}>
          <ProgressBar value={overallPct} color={theme.primary} />
        </View>
      </Card>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Chọn cấp độ</Text>

      {LEVELS.map((level) => (
        <LevelCard
          key={level.id}
          level={level}
          completed={
            progress.completedLessons.filter((id) =>
              getLessonsByLevel(level.id).some((l) => l.id === id),
            ).length
          }
          total={getLessonsByLevel(level.id).length}
          onPress={() => router.push(`/level/${level.id}`)}
        />
      ))}
    </Screen>
  );
}

function LevelCard({
  level,
  completed,
  total,
  onPress,
}: {
  level: LevelMeta;
  completed: number;
  total: number;
  onPress: () => void;
}) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const pct = total > 0 ? completed / total : 0;

  return (
    <Card onPress={onPress} background={level.color} style={styles.levelCard}>
      <View style={styles.levelRow}>
        <View style={styles.levelEmojiWrap}>
          <Text style={styles.levelEmoji}>{level.emoji}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.levelTitleVi}>{level.titleVi}</Text>
          <Text style={styles.levelTitleEn}>{level.title}</Text>
          <Text style={styles.levelAge}>{level.ageRange}</Text>
        </View>
      </View>
      <Text style={styles.levelDesc} numberOfLines={2}>
        {level.description}
      </Text>
      <View style={styles.levelFooter}>
        <View style={{ flex: 1, marginRight: Spacing.md }}>
          <ProgressBar value={pct} color={theme.surface} background="rgba(255,255,255,0.35)" />
        </View>
        <Text style={styles.levelProgressText}>
          {completed}/{total}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: Spacing.lg,
  },
  greetingEmoji: {
    fontSize: 44,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '900',
    marginTop: Spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 2,
  },
  overviewCard: {
    marginBottom: Spacing.xl,
  },
  overviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overviewLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  overviewValue: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 2,
  },
  overviewEmoji: {
    fontSize: 36,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: Spacing.md,
  },
  levelCard: {
    marginBottom: Spacing.md,
    borderRadius: Radius.xl,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  levelEmojiWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelEmoji: {
    fontSize: 40,
  },
  levelTitleVi: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  levelTitleEn: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  levelAge: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  levelDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.95)',
    lineHeight: 19,
    marginBottom: Spacing.md,
  },
  levelFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelProgressText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    minWidth: 36,
    textAlign: 'right',
  },
});
