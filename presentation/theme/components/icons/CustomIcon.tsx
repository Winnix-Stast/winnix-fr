import React from "react";
import { DimensionValue, StyleProp, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { IconLibrary, IconName } from "./IconLibrary";

interface CustomIconProps extends SvgProps {
  name: IconName;
  size?: number | string;
  containerStyle?: StyleProp<ViewStyle>;
}

export const CustomIcon = ({ name, size, containerStyle, ...rest }: CustomIconProps) => {
  const IconComponent = IconLibrary[name];

  if (!IconComponent) {
    return null;
  }

  const width = (size || "100%") as DimensionValue;
  const height = (size || "100%") as DimensionValue;

  return (
    <View style={[{ width, height, aspectRatio: 1, justifyContent: "center", alignItems: "center" }, containerStyle]}>
      <IconComponent width='100%' height='100%' {...rest} />
    </View>
  );
};
