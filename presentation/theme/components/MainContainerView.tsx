import { colors } from "@styles";
import { ReactNode } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  children: ReactNode;
  paddingTop?: boolean;
}

export const MainContainerView = ({ children, paddingTop }: Props) => {
  const { top } = useSafeAreaInsets();
  return <SafeAreaView style={styles.contentView}>{children}</SafeAreaView>;
};

const styles = StyleSheet.create({
  contentView: {
    flex: 1,
    backgroundColor: colors.surface_screen,
  },
});
