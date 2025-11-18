import { Platform } from 'react-native';

export interface ColorVariation {
  text: string
  background: string,
  card: string,
  border: string,
  tint: string,
  icon: string,
  tabIconDefault: string,
  tabIconSelected: string,
  shadow: string,
  button: string
}

interface ThemeColors{ 
  light: ColorVariation,
  dark: ColorVariation
}

const tintColorLight = "#2563EB";
const tintColorDark = "#60A5FA";

export const Colors: ThemeColors = {
  light: {
    text: "#1E293B",
    background: "#F9FAFB",
    card: "#FFFFFF",
    border: "#E2E8F0",
    tint: tintColorLight,
    icon: "#475569",
    tabIconDefault: "#94A3B8",
    tabIconSelected: tintColorLight,
    shadow: "#00000020",
    button: "#2563EB",
  },
  dark: {
    text: "#F3F4F6",
    background: "#0F172A",
    card: "#1E293B",
    border: "#334155",
    tint: tintColorDark,
    icon: "#CBD5E1",
    tabIconDefault: "#64748B",
    tabIconSelected: tintColorDark,
    shadow: "#00000040",
    button: "#3B82F6",
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
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
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
