import { Bus } from "@/controller/Bus";
import {
  faChartLine,
  faChevronCircleRight,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { router, Href } from "expo-router";
import { Pressable, View, StyleSheet, useColorScheme } from "react-native";
import { StringTime } from "../CommonModules/StringDateTime";
import { ThemedText } from "../CommonModules/ThemedText";
import StarRating from "./StarRating";

type MyBusViewProps = {
  bus: Bus;
};

export default function MyBusView({ bus }: MyBusViewProps) {
  const theme = useColorScheme() ?? "light";
  const iconColor = theme === "dark" ? "#eee" : "#555";
  const iconSize = 14;
  return (
    <View style={styles.busDetails}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <StarRating rating={1} ratingCount={100} starSize={20} />

      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            gap: 10,
            borderRadius: 15,
          }}
        >
          <View>
            <ThemedText
              type="s6"
              style={{ textAlign: "left" }}
              lightColor={iconColor}
              darkColor={iconColor}
            >
              Reg: {bus.regNo}
            </ThemedText>
            <ThemedText
              type="s6"
              style={{ textAlign: "left" }}
              lightColor={iconColor}
              darkColor={iconColor}
            >
              NTC: {bus.ntcNo}
            </ThemedText>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          margin: 10,
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <View
          style={{
            alignItems: "center",
          }}
        >
          <ThemedText type="h5">{bus.departure}</ThemedText>
          <ThemedText type="s6">{StringTime(bus.departureTime)}</ThemedText>
        </View>

        <View style={styles.horizontalLine}></View>
        <FontAwesomeIcon
          icon={faChevronCircleRight}
          size={18}
          color={"#aaa"}
          style={{ alignSelf: "center" }}
        />
        <View style={styles.horizontalLine}></View>
        <View
          style={{
            alignItems: "center",
          }}
        >
          <ThemedText type="h5">{bus.terminal}</ThemedText>
          <ThemedText type="s6">{StringTime(bus.terminalTime)}</ThemedText>
        </View>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ justifyContent: "space-between" }}>
          <ThemedText type="h6">NTC license numbers</ThemedText>
          <ThemedText type="s6" lightColor={iconColor} darkColor={iconColor}>
            Driver: {bus.ntcDriver.get(1)}{" "}
            {bus.ntcDriver.size > 1 ? "  " + bus.ntcDriver.get(2) : ""}
          </ThemedText>
          <ThemedText type="s6" lightColor={iconColor} darkColor={iconColor}>
            Conductor: {bus.ntcConductor.get(1)}{" "}
            {bus.ntcConductor.size > 1 ? "  " + bus.ntcConductor.get(2) : ""}
          </ThemedText>
        </View>
        <Pressable
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            alignSelf: "flex-end",
            gap: 10,
          }}
          onPress={() => router.replace("/index" as Href<string>)}
        >
          <FontAwesomeIcon
            icon={faEdit}
            size={iconSize}
            color={iconColor}
            style={{ alignSelf: "center" }}
          />
          <ThemedText type="s6" lightColor={iconColor} darkColor={iconColor}>
            Edit
          </ThemedText>
        </Pressable>
      </View>
    </View>
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
