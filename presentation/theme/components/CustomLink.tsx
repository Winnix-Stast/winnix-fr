import { Colors } from "@/presentation/styles";
import { Link, LinkProps } from "expo-router";
import { StyleSheet } from "react-native";
import { Fonts } from "../../styles/global-styles";

interface Props extends LinkProps {
  label: string;
  style?: object;
  href: LinkProps["href"];
}

export const CustomLink = ({ label, href, style }: Props) => {
  return (
    <Link href={href} style={[styles.label, style]}>
      {label}
    </Link>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: Fonts.normal,
    fontWeight: "bold",
    textDecorationLine: "underline",
    color: Colors.actions_primary_bg,
  },
});
