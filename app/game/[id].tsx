import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { MemoryCardsGame } from '@/components/memory-cards-game';
import { Screen } from '@/components/screen';
import { WordMatchGame } from '@/components/word-match-game';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { GameId, getGameMeta } from '@/data/games';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useProgress } from '@/hooks/use-progress';

export default function GameScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { progress, recordGameScore } = useProgress();

  const game = id ? getGameMeta(id as GameId) : undefined;

  if (!game) {
    return (
      <Screen>
        <Text style={{ color: theme.text }}>Không tìm thấy mini-game.</Text>
      </Screen>
    );
  }

  const handleFinish = (score: number) => {
    recordGameScore(game.id, score);
  };

  return (
    <Screen background={game.color}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>{game.emoji}</Text>
        <Text style={[styles.title, { fontFamily: Fonts?.rounded }]}>{game.titleVi}</Text>
        <Text style={styles.subtitle}>{game.description}</Text>
      </View>

      {game.id === 'word-match' ? (
        <WordMatchGame
          completedLessonIds={progress.completedLessons}
          onFinish={handleFinish}
          themeColor={game.color}
        />
      ) : null}

      {game.id === 'memory-cards' ? (
        <MemoryCardsGame
          completedLessonIds={progress.completedLessons}
          onFinish={handleFinish}
          themeColor={game.color}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  headerEmoji: {
    fontSize: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.95)',
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: Spacing.md,
    marginTop: 4,
  },
});
