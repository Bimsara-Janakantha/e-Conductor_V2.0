import {
  faArrowRotateBack,
  faArrowsRotate,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  View,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  ScrollView,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { ThemedText } from "../CommonModules/ThemedText";
import { Seat44Layout, Seat54Layout, OperatorSeatLegend } from "./SeatLayouts";
import { Dispatch, SetStateAction } from "react";
import { VehicleDetails } from "../../context/AppContext";

type Props = {
  updateInterval: {
    label: string;
    value: number;
  };
  setUpdateInterval: Dispatch<
    SetStateAction<{
      label: string;
      value: number;
    }>
  >;
  vehicleDetail: VehicleDetails;
  fetchBusDetails: any;
  isTracking: boolean;
  startTracking: any;
  stopTracking: any;
  errorPermission: string | null;
};
export default function OperatorTabScreen({
  updateInterval,
  setUpdateInterval,
  vehicleDetail,
  fetchBusDetails,
  isTracking,
  startTracking,
  stopTracking,
  errorPermission,
}: Props) {
  const theme = useColorScheme() ?? "light";
  const iconColor = theme === "dark" ? "#aaa" : "#777";
  const dropdownData = [
    { label: "1 second", value: 1000 },
    { label: "2 seconds", value: 2000 },
    { label: "5 seconds", value: 5000 },
    { label: "10 seconds", value: 10000 },
  ];

  return (
    <ScrollView style={{ flex: 1, marginHorizontal: 10 }} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          <Dropdown
            style={styles.inputDropdown}
            placeholderStyle={{ color: "gray" }}
            data={dropdownData}
            labelField="label"
            valueField="value"
            placeholder="Select a time interval"
            value={updateInterval}
            onChange={(item) => {
              setUpdateInterval(item);
            }}
          />
          <Pressable
            style={styles.trackingButton}
            onPress={isTracking ? stopTracking : startTracking}
          >
            <Text style={styles.buttonText}>
              {isTracking && !errorPermission
                ? "Stop Tracking"
                : "Start Tracking"}
            </Text>
          </Pressable>
        </View>
        {errorPermission && (
          <Text style={styles.errorText}>{errorPermission}</Text>
        )}

        <View
          style={{
            marginHorizontal: 40,
            backgroundColor: "transparent",
            borderRadius: 20,
            paddingHorizontal: 10,
          }}
        >
          <View style={{ alignSelf: "center" }}>
            <Pressable
              style={{
                flexDirection: "row",
                gap: 7,
                backgroundColor: theme === "dark" ? "#555" : "#fff",
                alignSelf: "flex-end",
                alignItems: "center",
                paddingVertical: 10,
                paddingHorizontal: 10,
                marginTop: 10,
                marginBottom: -10,
                borderRadius: 50,
                elevation: 5,
              }}
              onPress={fetchBusDetails}
            >
              <ThemedText type="h5" lightColor="#666" darkColor="#ccc">
                Refresh Seats
              </ThemedText>
              <FontAwesomeIcon
                icon={faArrowsRotate}
                size={20}
                color={theme === "dark" ? "#ccc" : "#444"}
              />
            </Pressable>
          </View>
          {vehicleDetail.seats == 42 && <Seat44Layout />}
          {vehicleDetail.seats == 54 && <Seat54Layout />}
          <OperatorSeatLegend />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tab: {
    padding: 10,
    borderRadius: 20,
  },
  activeTab: {
    alignItems: "center",
    backgroundColor: "blue",
  },
  inactiveTab: {
    alignItems: "center",
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  locationText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  trackingButton: {
    backgroundColor: "#0384DB",
    padding: 10,
    borderRadius: 20,
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  pickerLabel: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
  },
  picker: {
    backgroundColor: "#dd1",
    height: 50,
    width: 200,
    marginBottom: 20,
  },
  mainBody: {
    padding: 10,
    flex: 1,
  },
  flatList: {
    margin: 10,
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  rechargeButton: {
    alignItems: "center",
    backgroundColor: "#fff2",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 20,
  },
  cardBody: {
    borderWidth: 0,
    borderRadius: 10,
    marginHorizontal: 10,
    elevation: 3,
  },
  cardHeader: {
    marginTop: 15,
    marginBottom: 5,
    marginHorizontal: 15,
    backgroundColor: "transparent",
  },
  drawerHeader: {
    flexDirection: "row",
    backgroundColor: "transparent",
    gap: 10,
  },
  logo: {
    height: 60,
    width: 60,
    borderRadius: 15,
  },
  inputDropdown: {
    width: 220,
    color: "#333",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    elevation: 3,
    zIndex: 2,
    margin: 12,
  },
});
