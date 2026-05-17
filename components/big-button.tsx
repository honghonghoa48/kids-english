import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { Colors, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface Props {
  label: string;
  onPress?: () => void;
  color?: string;
  textColor?: string;
  disabled?: boolean;
  emoji?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function BigButton({
  label,
  onPress,
  color,
  textColor,
  disabled,
  emoji,
  iconLeft,
  iconRight,
  fullWidth = true,
  style,
}: Props) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const bg = disabled ? theme.muted : color ?? theme.primary;
  const fg = textColor ?? '#FFFFFF';

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: bg,
          opacity: pressed && !disabled ? 0.85 : 1,
          transform: [{ scale: pressed && !disabled ? 0.98 : 1 }],
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        style,
      ]}>
      <View style={styles.inner}>
        {iconLeft ? <View style={styles.icon}>{iconLeft}</View> : null}
        {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
        <Text style={[styles.label, { color: fg }]}>{label}</Text>
        {iconRight ? <View style={styles.icon}>{iconRight}</View> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: Radius.xl,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  emoji: {
    fontSize: 26,
  },
  label: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  icon: {
    marginHorizontal: 2,
  },
});
