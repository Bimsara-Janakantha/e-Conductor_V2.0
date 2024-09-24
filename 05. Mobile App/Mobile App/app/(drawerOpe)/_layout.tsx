import {
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Drawer } from "expo-router/drawer";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import CustomDrawerContent from "@/components/CustomDrawerContent";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faBars,
  faBusAlt,
  faChartLine,
  faCog,
  faHome,
  faInfoCircle,
  faMoneyBillTransfer,
  faTable,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { ThemedView } from "@/components/CommonModules/ThemedView";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { color } from "react-native-elements/dist/helpers";
import { AppContext, AppProvider } from "@/context/AppContext";

export default function DrawerLayout() {
  const navigation = useNavigation();
  const theme = useColorScheme() ?? "light";
  const iconSize = 24;

  return (
      <GestureHandlerRootView>
        <Drawer
          drawerContent={CustomDrawerContent}
          screenOptions={{
            //drawerHideStatusBarOnOpen: true,
            drawerInactiveBackgroundColor: "transparent",
            drawerActiveBackgroundColor: theme === "dark" ? "#4de4" : "#4de8",
            drawerType: "front",
            drawerStyle: {
              backgroundColor: theme === "dark" ? "#333" : "#fff",
              width: 250,
            },
            drawerActiveTintColor: theme === "dark" ? "#2ff" : "#05c",
            drawerInactiveTintColor: theme === "dark" ? "#eee" : "#777",
            drawerAllowFontScaling: true,
            headerShadowVisible: false,
            headerTitle: () => (
              <View style={styles.drawerHeader}>
                <Image
                  source={
                    theme === "dark"
                      ? require("@/assets/logos/logo_darkmode.png")
                      : require("@/assets/logos/logo_darkmode.png")
                  }
                  style={styles.logo}
                />
              </View>
            ),
            headerTitleAlign: "center",
            headerBackground: ({}) => (
              <ThemedView
                style={{
                  flex: 1,
                  backgroundColor: theme === "dark" ? "#5fb5e5" : "#5fb5e5",
                }}
              />
            ),
            headerLeft: () => (
              <Pressable
                style={{
                  backgroundColor: "transparent",
                  borderWidth: 0,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                }}
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              >
                <FontAwesomeIcon
                  icon={faBars}
                  size={24}
                  color={theme === "dark" ? "#fff" : "#fff"}
                />
              </Pressable>
            ),
          }}
        >
          <Drawer.Screen
            name="home"
            options={{
              drawerLabel: "Home",
              drawerIcon: ({ color }) => (
                <FontAwesomeIcon icon={faHome} size={iconSize} color={color} />
              ),
            }}
          />

          <Drawer.Screen
            name="profile"
            options={{
              drawerLabel: "Profile",
              drawerIcon: ({ color }) => (
                <FontAwesomeIcon icon={faUser} size={iconSize} color={color} />
              ),
              headerTitle: "Profile",
              headerTintColor: "#fff",
            }}
          />
          <Drawer.Screen
            name="settings"
            options={{
              drawerLabel: "Settings",
              drawerIcon: ({ color }) => (
                <FontAwesomeIcon icon={faCog} size={iconSize} color={color} />
              ),
              headerTitle: "Settings",
              headerTintColor: "#fff",
            }}
          />
          <Drawer.Screen
            name="about"
            options={{
              drawerLabel: "About",
              drawerIcon: ({ color }) => (
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  size={iconSize}
                  color={color}
                />
              ),
              headerTitle: "About",
              headerTintColor: "#fff",
            }}
          />
        </Drawer>
      </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    height: 60,
    width: 60,
    borderRadius: 15,
  },
  headerIconContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginHorizontal: 10,
  },
});
