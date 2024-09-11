import {
  StringDate,
} from "@/components/CommonModules/StringDateTime";
import { ThemedText } from "@/components/CommonModules/ThemedText";
import { ThemedView } from "@/components/CommonModules/ThemedView";
import {
  faArrowLeftLong,
  faArrowRightLong,
  faArrowRotateBack,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { useAppContext } from "@/context/AppContext";

export default function Transactions() {
  const { pasTransactions } = useAppContext();
  const theme = useColorScheme() ?? "light";
  const iconSize = 20;

  return (
    <ThemedView style={styles.mainBody}>
      <FlatList
        style={styles.flatList}
        data={pasTransactions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <ThemedView style={styles.searchResult}>
            <View
              style={{
                width: 60,
                backgroundColor: theme === "dark" ? "#000" : "#fff",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 15,
              }}
            >
              {item.type == "recharge" && (
                <FontAwesomeIcon
                  icon={faArrowRightLong}
                  size={iconSize}
                  color={theme === "dark" ? "#4f8" : "#4c8"}
                  style={{ alignSelf: "center" }}
                />
              )}
              {item.type == "payment" && (
                <FontAwesomeIcon
                  icon={faArrowLeftLong}
                  size={iconSize}
                  color={theme === "dark" ? "#f85" : "#f85"}
                  style={{ alignSelf: "center" }}
                />
              )}
              {item.type == "return" && (
                <FontAwesomeIcon
                  icon={faArrowRotateBack}
                  size={iconSize}
                  color={theme === "dark" ? "#fe4" : "#fb4"}
                  style={{ alignSelf: "center" }}
                />
              )}
              <ThemedText
                type="s7"
                style={{ textAlign: "right" }}
                lightColor="#666"
                darkColor="#ccc"
              >
                {item.type}
              </ThemedText>
            </View>

            <View>
              <View style={{ justifyContent: "space-between" }}>
                <ThemedText type="s5" style={{ textAlign: "right" }}>
                  Rs. {item.amount}
                </ThemedText>
                <ThemedText
                  type="s6"
                  style={{ textAlign: "right" }}
                  lightColor="#666"
                  darkColor="#aaa"
                >
                  {StringDate(item.date)}
                </ThemedText>
              </View>
            </View>
          </ThemedView>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainBody: {
    padding: 10,
    flex: 1,
    position: "relative",
  },
  flatList: {
    margin: 10,
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  searchResult: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#aaa4",
  },
});
