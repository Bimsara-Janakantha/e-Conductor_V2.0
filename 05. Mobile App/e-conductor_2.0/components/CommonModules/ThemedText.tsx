import { Text, type TextProps, StyleSheet } from "react-native";

import { useThemeColor } from "../../hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "drawerHeader"
    | "buttonText"
    | "header1"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "s1"
    | "s2"
    | "s3"
    | "s4"
    | "s5"
    | "s6"
    | "s7"
    | "s8"
    | "s9"
    | "cardHeader";
};

export function ThemedText({
  style,
  lightColor="#5a5a5a",
  darkColor="#ffffff",
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "header1" ? styles.header1 : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        type === "drawerHeader" ? styles.drawerHeader : undefined,
        type === "buttonText" ? styles.buttonText : undefined,
        type === "cardHeader" ? styles.cardHeader : undefined,
        type === "h1" ? styles.h1 : undefined,
        type === "h2" ? styles.h2 : undefined,
        type === "h3" ? styles.h3 : undefined,
        type === "h4" ? styles.h4 : undefined,
        type === "h5" ? styles.h5 : undefined,
        type === "h6" ? styles.h6 : undefined,
        type === "s1" ? styles.s1 : undefined,
        type === "s2" ? styles.s2 : undefined,
        type === "s3" ? styles.s3 : undefined,
        type === "s4" ? styles.s4 : undefined,
        type === "s5" ? styles.s5 : undefined,
        type === "s6" ? styles.s6 : undefined,
        type === "s7" ? styles.s7 : undefined,
        type === "s8" ? styles.s8 : undefined,
        type === "s9" ? styles.s9 : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 14,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    backgroundColor: "transparent",
  },
  header1: {
    fontSize: 35,
    fontWeight: "bold",
    backgroundColor: "transparent",
  },
  h1: {
    fontSize: 35,
    fontWeight: "bold",
    backgroundColor: "transparent",
  },
  h2: {
    fontSize: 30,
    fontWeight: "bold",
    backgroundColor: "transparent",
  },
  h3: {
    fontSize: 25,
    fontWeight: "bold",
    backgroundColor: "transparent",
  },
  h4: {
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "transparent",
  },
  h5: {
    fontSize: 17,
    fontWeight: "bold",
    backgroundColor: "transparent",
  },
  h6: {
    fontSize: 14,
    fontWeight: "bold",
    backgroundColor: "transparent",
  },
  s1: {
    fontSize: 35,
    backgroundColor: "transparent",
  },
  s2: {
    fontSize: 30,
    backgroundColor: "transparent",
  },
  s3: {
    fontSize: 25,
    backgroundColor: "transparent",
  },
  s4: {
    fontSize: 20,
    backgroundColor: "transparent",
  },
  s5: {
    fontSize: 17,
    backgroundColor: "transparent",
  },
  s6: {
    fontSize: 14,
    backgroundColor: "transparent",
  },
  s7: {
    marginTop: -2,
    fontSize: 11,
    backgroundColor: "transparent",
  },
  s8: {
    fontSize: 9,
    backgroundColor: "transparent",
  },
  s9: {
    fontSize: 6.5,
    backgroundColor: "transparent",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    fontSize: 16,
    lineHeight: 30,
    color: "#0a7ea4",
  },
  drawerHeader: {
    fontSize: 16,
    lineHeight: 16,
    paddingTop: 20,
    paddingBottom: 50,
    alignSelf: "center",
  },
  cardHeader: {
    fontSize: 20,
  },
});
