import {
  Image,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { Drawer } from "expo-router/drawer";
import React, { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import CustomDrawerContent from "../../components/CustomDrawerContent";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faBars,
  faBell,
  faBusAlt,
  faChartLine,
  faHome,
  faInfoCircle,
  faMoneyBillTransfer,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { ThemedView } from "../../components/CommonModules/ThemedView";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useAppContext } from "../../context/AppContext";
import MessageModal from "../modals/messageModal";
import { ThemedText } from "../../components/CommonModules/ThemedText";

export default function DrawerLayout() {
  const { navigation } = useAppContext();
  const theme = useColorScheme() ?? "light";
  const iconSize = 24;
  const [displayMessageModal, setDisplayMessageModal] = useState(false);

  return (
      <GestureHandlerRootView>
        <Drawer
        drawerContent={CustomDrawerContent}
        screenOptions={{
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
            <ThemedText type="h4" lightColor="#5a5a5a" darkColor="#ffffff">
              e-Conductor
            </ThemedText>
          ),
          headerTitleAlign: "center",
          headerBackground: ({}) => (
            <ThemedView
              style={{
                flex: 1,
                backgroundColor: theme === "dark" ? "#202020" : "#ffffff",
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
                color={theme === "dark" ? "#ffffff" : "#5a5a5a"}
              />
            </Pressable>
          ),
          headerRight: () => (
            <View style={{ flexDirection: "row" }}>
              <Pressable
                style={{
                  backgroundColor: "transparent",
                  borderWidth: 0,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                }}
                onPress={() => setDisplayMessageModal(!displayMessageModal)}
              >
                <FontAwesomeIcon
                  icon={faBell}
                  size={24}
                  color={theme === "dark" ? "#ffffff" : "#5a5a5a"}
                />
              </Pressable>
              <MessageModal
                isVisible={displayMessageModal}
                onClose={() => setDisplayMessageModal(false)}
              />
            </View>
          ),
        }}
      >
          <Drawer.Screen
            name="home"
            options={{
              drawerLabel: "Home",
              drawerIcon: ({ color }: any) => (
                <FontAwesomeIcon icon={faHome} size={iconSize} color={color} />
              ),
              headerTintColor: theme === "dark" ? "#fff" : "#5a5a5a",
            }}
          />

          <Drawer.Screen
            name="profile"
            options={{
              drawerLabel: "Profile",
              drawerIcon: ({ color }: any) => (
                <FontAwesomeIcon icon={faUser} size={iconSize} color={color} />
              ),
              headerTitle: "Profile",
              headerTintColor: theme === "dark" ? "#fff" : "#5a5a5a",
            }}
          />
          <Drawer.Screen
            name="transactions"
            options={{
              drawerLabel: "Transactions",
              drawerIcon: ({ color }: any) => (
                <FontAwesomeIcon
                  icon={faMoneyBillTransfer}
                  size={iconSize}
                  color={color}
                />
              ),
              headerTitle: "Transactions",
              headerTintColor: theme === "dark" ? "#fff" : "#5a5a5a",
            }}
          />
          <Drawer.Screen
            name="about"
            options={{
              drawerLabel: "About",
              drawerIcon: ({ color }: any) => (
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  size={iconSize}
                  color={color}
                />
              ),
              headerTitle: "About",
              headerTintColor: theme === "dark" ? "#fff" : "#5a5a5a",
            }}
          />
          <Drawer.Screen
            name="buses"
            options={{
              drawerLabel: "Buses",
              drawerIcon: ({ color }: any) => (
                <FontAwesomeIcon
                  icon={faBusAlt}
                  size={iconSize}
                  color={color}
                />
              ),
              headerTitle: "Buses",
              headerTintColor: theme === "dark" ? "#fff" : "#5a5a5a",
            }}
          />
          <Drawer.Screen
            name="analytics"
            options={{
              drawerLabel: "Analytics",
              drawerIcon: ({ color }: any) => (
                <FontAwesomeIcon
                  icon={faChartLine}
                  size={iconSize}
                  color={color}
                />
              ),
              headerTitle: "Analytics",
              headerTintColor: theme === "dark" ? "#fff" : "#5a5a5a",
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
