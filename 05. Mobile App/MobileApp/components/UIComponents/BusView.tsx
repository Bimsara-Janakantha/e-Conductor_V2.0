import { Pressable, View, StyleSheet } from "react-native";
import { ThemedText } from "../CommonModules/ThemedText";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { StringTime } from "../CommonModules/StringDateTime";
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Href, router } from "expo-router";
import { Bus } from "@/controller/Bus";

type BusViewProps = {
  bus: Bus;
};

export default function BusView({ bus }: BusViewProps) {
  const iconSize = 20;

  function openSeats() {
    router.navigate("/modals/seatsModal" as Href<string>);
  }

  return (
    <View style={styles.searchResult}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <View style={{ marginRight: 5, marginBottom: 12 }}>
            <FontAwesomeIcon
              icon={faLocationDot}
              size={iconSize}
              color={"#4c4"}
              style={{ alignSelf: "center" }}
            />
            <View style={styles.horizontalLine}></View>
            <FontAwesomeIcon
              icon={faLocationDot}
              size={iconSize}
              color={"#4af"}
              style={{ alignSelf: "center" }}
            />
          </View>
          <View style={{ justifyContent: "space-between", marginTop: -5 }}>
            <View>
              <ThemedText type="s4" lightColor="#000" darkColor="#fff">
                {bus.departure}
              </ThemedText>
              <ThemedText type="s7" lightColor="#666" darkColor="#ccc">
                Departure
              </ThemedText>
            </View>
            <View>
              <ThemedText type="s4" lightColor="#000" darkColor="#fff">
                {bus.terminal}
              </ThemedText>
              <ThemedText type="s7" lightColor="#666" darkColor="#ccc">
                Terminal
              </ThemedText>
            </View>
          </View>
        </View>
        <View style={{ justifyContent: "space-between" }}>
          <ThemedText
            type="h4"
            lightColor="#000"
            darkColor="#fff"
            style={{ textAlign: "right" }}
          >
            Rs. 200
          </ThemedText>
          <ThemedText type="s5" style={{ textAlign: "right" }}>
            Depart at: {StringTime(bus.departureTime)}
          </ThemedText>
          <Pressable
            style={{
              backgroundColor: "#e28",
              borderWidth: 0,
              borderRadius: 50,
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
            onPress={openSeats}
          >
            <ThemedText
              type={"s4"}
              style={{ textAlign: "center" }}
              lightColor="#fff"
              darkColor="#fff"
            >
              Buy Ticket
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainBody: {
    padding: 10,
    flex: 1,
    zIndex: 1,
    position: "relative",
  },
  inputDropdown: {
    width: 280,
    color: "#333",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: -10,
    marginBottom: 10,
    backgroundColor: "#fff",
    elevation: 3,
  },
  flatList: {
    marginHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  searchResult: {
    marginVertical: 5,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#fc55",
  },
  horizontalLine: {
    flex: 1,
    width: 2,
    height: 40,
    margin: 5,
    borderWidth: 0,
    backgroundColor: "#aaa",
    alignSelf: "center",
  },
});
