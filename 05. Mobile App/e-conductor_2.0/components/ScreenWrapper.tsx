import React, { ReactNode } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";

interface ScreenWrapperProps {
  children: ReactNode;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children }) => {
  return (
    <ImageBackground
      source={require("../assets/images/home_bg.png")}
      style={styles.background}
    >
      <View style={styles.content}>{children}</View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default ScreenWrapper;
