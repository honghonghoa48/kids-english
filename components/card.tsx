import { ReactNode } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';

import { Colors, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface Props {
  children: ReactNode;
  onPress?: () => void;
  background?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Card({ children, onPress, background, disabled, style }: Props) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const bg = background ?? theme.surface;
  const content = (
    <View
      style={[
        styles.card,
        {
          backgroundColor: bg,
          opacity: disabled ? 0.55 : 1,
        },
        style,
      ]}>
      {children}
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => ({
        transform: [{ scale: pressed && !disabled ? 0.98 : 1 }],
      })}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
});
