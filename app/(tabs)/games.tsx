import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { GameMeta, GAMES } from '@/data/games';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useProgress } from '@/hooks/use-progress';

export default function GamesScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { progress } = useProgress();

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>🎮</Text>
        <Text style={[styles.title, { color: theme.text, fontFamily: Fonts?.rounded }]}>
          Mini Game
        </Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>
          Chơi vui và luyện từ vựng đã học
        </Text>
      </View>

      {GAMES.map((game) => {
        const unlocked = progress.completedLessons.length >= game.unlockAfter;
        const highScore = progress.gameHighScores[game.id] ?? 0;
        return (
          <GameCard
            key={game.id}
            game={game}
            unlocked={unlocked}
            highScore={highScore}
            onPress={() => router.push(`/game/${game.id}`)}
          />
        );
      })}
    </Screen>
  );
}

function GameCard({
  game,
  unlocked,
  highScore,
  onPress,
}: {
  game: GameMeta;
  unlocked: boolean;
  highScore: number;
  onPress: () => void;
}) {
  return (
    <Card
      onPress={unlocked ? onPress : undefined}
      disabled={!unlocked}
      background={game.color}
      style={styles.card}>
      <View style={styles.row}>
        <View style={styles.emojiWrap}>
          <Text style={styles.emoji}>{game.emoji}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.titleVi}>{game.titleVi}</Text>
          <Text style={styles.titleEn}>{game.title}</Text>
          <Text style={styles.desc} numberOfLines={2}>
            {game.description}
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        {unlocked ? (
          <View style={styles.score}>
            <IconSymbol name="trophy.fill" size={16} color="#FFFFFF" />
            <Text style={styles.scoreText}>Kỷ lục: {highScore}</Text>
          </View>
        ) : (
          <View style={styles.locked}>
            <IconSymbol name="lock.fill" size={16} color="#FFFFFF" />
            <Text style={styles.scoreText}>
              Mở khóa sau {game.unlockAfter} bài học
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
}

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
  card: {
    marginBottom: Spacing.md,
    borderRadius: Radius.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  emojiWrap: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 40,
  },
  titleVi: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  titleEn: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    marginBottom: 4,
  },
  desc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.92)',
    lineHeight: 18,
  },
  footer: {
    marginTop: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  score: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
    gap: 6,
  },
  locked: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
    gap: 6,
  },
  scoreText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
