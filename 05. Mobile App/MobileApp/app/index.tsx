import {
  View,
  Image,
  StyleSheet,
  Pressable,
  useColorScheme,
  ImageBackground,
  StatusBar,
} from "react-native";
import { Href, Link, router } from "expo-router";
import React, { useEffect } from "react";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { useRef } from "react";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/CommonModules/ThemedText";
import { ThemedView } from "@/components/CommonModules/ThemedView";

export default function Index() {
  const theme = useColorScheme() ?? "light";
  // useEffect(() => {
  //   StatusBar.setHidden(true);
  // }, []);

  return (
    <ThemedView style={styles.pageBody} lightColor="#fff" darkColor="#222">
      <ImageBackground
        source={require("@/assets/images/main_bg.png")}
        style={styles.backgroundImage}
      >
        <ThemedView style={styles.logoContainer}>
          <Image
            source={
              theme === "dark"
                ? require("@/assets/logos/logo_darkmode.png")
                : require("@/assets/logos/logo_lightmode.png")
            }
            style={styles.logo}
          />
        </ThemedView>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title" lightColor="#21aadd" darkColor="#2ededa">
            Quick tickets, Happy travels
          </ThemedText>
          <ThemedText
            style={{ textAlign: "center" }}
            lightColor="#000a"
            darkColor="#fffa"
          >
            Experience the convenience of instant ticket booking with our quick
            and reliable service
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.buttonContainer}>
          <Pressable
            style={styles.signupButton}
            onPress={() => {
              router.navigate("/signup");
            }}
          >
            <ThemedText type="buttonText" lightColor="#fff" darkColor="#fff">
              Sign Up
            </ThemedText>
          </Pressable>
          <Pressable
            style={styles.loginButton}
            onPress={() => {
              router.navigate("/login");
            }}
          >
            <ThemedText type="buttonText" lightColor="#fff" darkColor="#fff">
              Log In
            </ThemedText>
          </Pressable>
          <Pressable
            style={styles.loginButton}
            onPress={() => {
              router.navigate("/(drawerOwn)/home/dashboard" as Href<string>);
            }}
          >
            <ThemedText type="buttonText" lightColor="#fff" darkColor="#fff">
              Developer Log In
            </ThemedText>
          </Pressable>
        </ThemedView>
      </ImageBackground>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  pageBody: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  logoContainer: {
    margin: 90,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  titleContainer: {
    marginVertical: 30,
    marginHorizontal: 10,
    gap: 10,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  buttonContainer: {
    width: "100%",
    backgroundColor: "transparent",
  },
  signupButton: {
    alignItems: "center",
    backgroundColor: "#1bbcc7",
    marginVertical: 7,
    marginHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 3,
  },
  loginButton: {
    alignItems: "center",
    backgroundColor: "#9595b3",
    marginVertical: 7,
    marginHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 3,
  },
  logo: {
    height: 125,
    width: 125,
    margin: 10,
    borderRadius: 15,
  },
});
