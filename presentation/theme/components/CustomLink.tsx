import { colors, typography } from "@styles";
import { Link, LinkProps } from "expo-router";
import { StyleSheet } from "react-native";

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
    fontSize: typography.body_m_bold.size,
    fontWeight: typography.body_m_bold.weight.toLowerCase() as "bold",
    textDecorationLine: "underline",
    color: colors.text_brand,
  },
});
