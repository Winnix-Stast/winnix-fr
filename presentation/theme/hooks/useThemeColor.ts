/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */
import { Colors } from '@/presentation/styles/colors';
import { useColorScheme } from '@/presentation/theme/hooks/useColorScheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: 'text' | 'background' | string,
) {
  const theme = useColorScheme() ?? 'dark';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }

  if (colorName === 'text') return Colors.text_primary;
  if (colorName === 'background') return Colors.surface_base;

  return Colors.text_primary;
}
