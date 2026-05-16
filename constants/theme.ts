import { Platform } from 'react-native';

const tintColorLight = '#FF6B9D';
const tintColorDark = '#FF8FB5';

export const Colors = {
  light: {
    text: '#1F2937',
    background: '#FFF8F0',
    surface: '#FFFFFF',
    tint: tintColorLight,
    primary: '#FF6B9D',
    secondary: '#4ECDC4',
    accent: '#FFB84D',
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
    muted: '#6B7280',
    icon: '#6B7280',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: tintColorLight,
    border: '#F3E8FF',
  },
  dark: {
    text: '#F9FAFB',
    background: '#1F2937',
    surface: '#374151',
    tint: tintColorDark,
    primary: '#FF8FB5',
    secondary: '#5EEAD4',
    accent: '#FBBF24',
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
    muted: '#9CA3AF',
    icon: '#9CA3AF',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: tintColorDark,
    border: '#4B5563',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'Nunito', 'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};
