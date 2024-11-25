import React from "react";
import { View, Text, StyleSheet, Pressable, Image, useColorScheme } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { DrawerActions } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const CustomHeader = () => {
  const navigation = useNavigation();
  const theme = useColorScheme() ?? "light";

  return (
    <View style={[styles.headerContainer, { backgroundColor: theme === "dark" ? "#333" : "#5fb5e5" }]}>
      <Pressable
        style={styles.menuButton}
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      >
        <FontAwesomeIcon icon={faBars} size={24} color="#fff" />
      </Pressable>
      <Image
        source={require("@/assets/logos/logo_darkmode.png")}
        style={styles.logo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 10,
    height: 60,
  },
  menuButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  logo: {
    height: 40,
    width: 40,
    borderRadius: 10,
  },
});

export default CustomHeader;
