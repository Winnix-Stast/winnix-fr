import { Colors } from "@/presentation/styles";
import { ReactNode } from "react";
import { SafeAreaView, StyleSheet } from "react-native";

interface Props {
  children: ReactNode;
  paddingTop?: boolean;
}

export const MainContainerView = ({ children, paddingTop }: Props) => {
  return <SafeAreaView style={styles.contentView}>{children}</SafeAreaView>;
};

const styles = StyleSheet.create({
  contentView: {
    flex: 1,
    backgroundColor: Colors.surface_base,
  },
});
