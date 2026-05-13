import { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/presentation/styles/colors';

export type IconName = ComponentProps<typeof Ionicons>['name'];

interface Props {
  name: IconName;
  size?: number;
  color?: string;
  style?: ComponentProps<typeof Ionicons>['style'];
}

export const WinnixIcon = ({
  name,
  size = 24,
  color = Colors.text_primary,
  style,
}: Props) => {
  return <Ionicons name={name} size={size} color={color} style={style} />;
};
