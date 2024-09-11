import { ThemedText } from "@/components/CommonModules/ThemedText";
import { ThemedView } from "@/components/CommonModules/ThemedView";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Href, router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { useAppContext } from "@/context/AppContext";
import MyBusView from "@/components/UIComponents/MyBusView";

export default function Buses() {
  const { myBuses } = useAppContext();
  const theme = useColorScheme() ?? "light";

  function openAddBusForm() {
    router.navigate("/modals/addBusModal" as Href<string>);
  }

  return (
    <ThemedView style={styles.mainBody}>
      <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
        <Pressable
          style={[styles.addButton, { backgroundColor: "#19e" }]}
          onPress={openAddBusForm}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              gap: 10,
            }}
          >
            <FontAwesomeIcon
              icon={faPlus}
              size={25}
              color={theme === "dark" ? "#fff" : "#fff"}
              style={{ alignSelf: "center" }}
            />
            <ThemedText type="s4" lightColor={"#fff"} darkColor={"#fff"}>
              Add
            </ThemedText>
          </View>
        </Pressable>
      </View>
      <FlatList
        style={styles.flatList}
        data={myBuses}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <MyBusView bus={item} />}
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
  busDetails: {
    marginVertical: 5,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#aac4",
  },
  addButton: {
    alignItems: "center",
    marginHorizontal: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  horizontalLine: {
    flex: 1,
    height: 2,
    marginHorizontal: 5,
    borderWidth: 0,
    backgroundColor: "#aaa",
  },
});
