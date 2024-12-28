import {
  View,
  Pressable,
  useColorScheme,
  Image,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { ThemedText } from "../CommonModules/ThemedText";
import { Href, router } from "expo-router";
import { ThemedView } from "../CommonModules/ThemedView";

type Props = {
  showRecharge: boolean;
};

export const AccountDeatils = ({ showRecharge }: Props) => {
  const { profileImage, credits, fName, lName } = useAppContext();
  const theme = useColorScheme() ?? "light";

  return (
    <ThemedView
      style={{
        backgroundColor: theme === "light" ? "#A8E3F9" : "#5cf9",
        borderRadius: 20,
        marginVertical: 15,
        padding: 15,
        marginHorizontal: 15,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Image
          source={
            profileImage != ""
              ? { uri: profileImage }
              : require("../../assets/images/blank-profile-picture.png")
          }
          style={styles.profileImage}
        />
        <View>
          <ThemedText type="s7">Welcome</ThemedText>
          <ThemedText type="h4">
            {fName} {lName}
          </ThemedText>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: showRecharge ? "space-between" : "center",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 10,
          }}
        >
          <ThemedText type={"h4"} lightColor="#00658A" darkColor="#CEEEFA">
            Balance:
          </ThemedText>
          <ThemedText type={"s4"} lightColor="#00658A" darkColor="#CEEEFA">
            LKR {credits}
          </ThemedText>
        </View>
        {showRecharge && (
          <Pressable
            style={{
              backgroundColor: "#01BAFE",
              paddingHorizontal: 10,
              paddingVertical: 7,
              borderRadius: 20,
            }}
            onPress={() => router.replace("/index")}
          >
            <ThemedText type="h6" lightColor="#ffffff" darkColor="#ffffff">
              Recharge
            </ThemedText>
          </Pressable>
        )}
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  profileImage: {
    height: 40,
    width: 40,
    borderRadius: 60,
  },
});
