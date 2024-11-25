import React from "react";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowRotateBack } from "@fortawesome/free-solid-svg-icons";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import * as Location from "expo-location";
import axios from "axios";
import { LocationObject } from "expo-location";
import { TabBar, TabView } from "react-native-tab-view";

import { useAppContext, VehicleDetails } from "../../../context/AppContext";
import { ThemedText } from "../../../components/CommonModules/ThemedText";
import OperatorTabScreen from "../../../components/UIComponents/OperatorTabScreen";
import LoadingScreen from "../../../components/CommonScreens/LoadingScreen";
import ErrorScreen from "../../../components/CommonScreens/ErrorScreen";
import { ThemedView } from "../../../components/CommonModules/ThemedView";

/**
 * Dashboard component for bus operators.
 * Provides functionality to manage and monitor buses, including schedule display,
 * seat availability, and real-time tracking using location updates.
 */
export default function Dashboard() {
  const { baseURL, id, setSeatNos, busScheduleDetails, setBusScheduleDetails } =
    useAppContext(); // Extracting global context values
  // Extracting global context values
  const theme = useColorScheme() ?? "light"; // Detect current theme (light or dark mode)
  const iconColor = theme === "dark" ? "#aaa" : "#777"; // Adjust icon color based on theme
  const initialLayout = { width: Dimensions.get("window").width }; // Tab layout configuration
  const [errorPermission, setErrorPermission] = useState<string | null>(null); // Tracks location permission errors
  const [isTracking, setIsTracking] = useState<boolean>(false); // Tracks whether location updates are active
  const [updateInterval, setUpdateInterval] = useState<{
    label: string;
    value: number;
  }>({ label: "2 seconds", value: 2000 }); // Interval for tracking location updates
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null); // Reference to the tracking interval
  const [index, setIndex] = useState(0); // Index for the current active tab
  const [loading, setLoading] = useState<boolean>(false); // Loading state for data fetching
  const [error, setError] = useState<string>(""); // Error state for fetching data
  const [routes, setRoutes] = useState(
    busScheduleDetails.map((vehicleDetail, index) => ({
      key: `tab${index}`,
      title: `${vehicleDetail.vehicleRegNo}|${vehicleDetail.departureTime}`,
    }))
  ); // Dynamic tab routes based on fetched bus schedules
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  ); // Default date (today) for schedule filtering

  //================================================ Functions ===============================================//

  /**
   * Requests location permissions from the user.
   * If denied, stops tracking and updates the error state.
   */
  const requestPermissions = async (): Promise<void> => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorPermission("Permission to access location was denied");
      stopTracking();
      return;
    }
    setErrorPermission(null); // Clear error if permissions are granted
  };

  /**
   * Fetches the current device location.
   * @returns {Promise<LocationObject | null>} The current location object or null if an error occurs.
   */
  const getLocation = async (): Promise<LocationObject | null> => {
    try {
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setErrorPermission(null);
      return location;
    } catch (error) {
      startTracking();
      return null;
    }
  };

  /**
   * Starts periodic location updates for the bus, sending data to the backend.
   * Ensures no multiple intervals are started simultaneously.
   */
  const startTracking = async () => {
    await requestPermissions();
    if (intervalRef.current) return;

    intervalRef.current = setInterval(async () => {
      const loc = await getLocation();
      if (loc) {
        await updateBusLocation(
          busScheduleDetails[index].vehicleRegNo,
          loc.coords.latitude,
          loc.coords.longitude,
          loc.coords.speed
        );
        console.log(
          "Updated Location:",
          loc.coords,
          "Speed:",
          loc.coords.speed
        );
      }
    }, updateInterval.value);
    setIsTracking(true);
  };

  /**
   * Stops periodic location updates.
   * Clears the tracking interval and updates the tracking state.
   */
  const stopTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsTracking(false);
    }
  };

  /**
   * Updates the `seatNos` in the AppContext based on the currently selected tab.
   * @param {object} route - The current route object containing tab details.
   */
  function updateSeats(route: { key: string; title: string }) {
    if (route) {
      let vehicleDetail = busScheduleDetails[index];
      const numberArray: number[] = vehicleDetail
        ? vehicleDetail.bookedSeats.map((str) => +str)
        : [];
      setSeatNos(numberArray);
    }
  }

  //================================================ Backend Calls ===============================================//

  /**
   * Fetches scheduled bus details for the selected operator and date.
   * Updates the state with fetched data and dynamically configures tabs.
   */
  const fetchBusDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`${baseURL}/schedule/sdl2`, {
        id,
        date: selectedDate,
      });

      if (response.status === 200 && response.data.length > 0) {
        setBusScheduleDetails(response.data);
        console.log("Fetched vehicle details:", response.data);

        const newRoutes = response.data.map(
          (vehicleDetail: VehicleDetails, index: number) => ({
            key: `tab${index}`,
            title: `${vehicleDetail.vehicleRegNo}|${vehicleDetail.departureTime}`,
          })
        );

        setRoutes(newRoutes);
      } else {
        Alert.alert("No Data", "No scheduled buses are found for today");
      }
    } catch (error) {
      console.error(error);
      setError(String(error));
      Alert.alert("Error", "Failed to fetch vehicle details");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Updates the current bus location in the backend database.
   * @param {string} regNo - The bus registration number.
   * @param {number} lat - The latitude of the current location.
   * @param {number} lng - The longitude of the current location.
   * @param {number | null} speed - The current speed of the bus.
   */
  const updateBusLocation = async (
    regNo: string,
    lat: number,
    lng: number,
    speed: number | null
  ) => {
    setError("");
    try {
      const response = await axios.post(`${baseURL}/tracking/trk2`, {
        regNo,
        lat,
        lng,
        speed,
      });

      if (response.status === 200) {
        console.log(response.data.message);
      } else {
        Alert.alert("Unsuccessful", "Failed to update location successfully");
      }
    } catch (error) {
      console.error("Error sending location:", error);
      Alert.alert("Error", "Failed to send location");
      startTracking();
    }
  };

  //================================================ Use Effects ===============================================//

  /**
   * Fetch bus details on the component mount
   */
  useEffect(() => {
    fetchBusDetails();
  }, []);

  /**
   * Clean up the location tracking interval when the component is unmounted.
   */
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  /**
   * Restart location tracking if the tracking interval changes.
   * Stops the current tracking process and restarts with the updated interval.
   */
  useEffect(() => {
    if (isTracking) {
      stopTracking();
      startTracking();
    }
  }, [updateInterval]);

  /**
   * Updates the `seatNos` array in the AppContext when the tab routes are updated.
   */
  useEffect(() => {
    updateSeats(routes[0]);
  }, [routes]);

  /**
   * Updates the `seatNos` array in the AppContext when the active tab index changes.
   */
  useEffect(() => {
    updateSeats(routes[index]);
  }, [index]);

  //================================================ UI Control ===============================================//

  /**
   * Renders the scene for each tab based on the selected bus schedule details.
   * Displays either the bus schedule information or a fallback message if no data is available.
   */
  const renderScene = ({ route }: { route: any }) => {
    const [regNo, time] = route.title.split("|");
    const vehicleDetail = busScheduleDetails.find(
      (detail) => detail.vehicleRegNo === regNo && detail.departureTime === time
    );

    if (!vehicleDetail) {
      return (
        <View style={{ alignItems: "center", marginTop: 200 }}>
          <ThemedText type="h5" lightColor="#666" darkColor="#ccc">
            No bus schedules are available today
          </ThemedText>
        </View>
      );
    }

    return (
      <OperatorTabScreen
        updateInterval={updateInterval}
        setUpdateInterval={setUpdateInterval}
        vehicleDetail={vehicleDetail}
        fetchBusDetails={fetchBusDetails}
        isTracking={isTracking}
        startTracking={startTracking}
        stopTracking={stopTracking}
        errorPermission={errorPermission}
      />
    );
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error !== "" && !loading) {
    return <ErrorScreen error={error} retry={fetchBusDetails} />;
  }

  return (
    <ThemedView style={styles.mainBody}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : busScheduleDetails && busScheduleDetails.length > 0 ? (
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={(newIndex) => {
            setIndex(newIndex);
          }}
          initialLayout={initialLayout}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: "transparent" }}
              style={{
                alignItems: "center",
                height: 45,
                backgroundColor: "#8BE7FF",
                marginHorizontal: 15,
                paddingVertical: 5,
                marginTop: 10,
                borderRadius: 30,
              }}
              renderTabBarItem={({ route, onPress, onLongPress, style }) => (
                <Pressable
                  onPress={onPress}
                  onLongPress={onLongPress}
                  style={
                    props.navigationState.index === routes.indexOf(route)
                      ? styles.activeTab
                      : styles.inactiveTab
                  }
                >
                  <ThemedText
                    type="h6"
                    style={{
                      color:
                        props.navigationState.index === routes.indexOf(route)
                          ? "white"
                          : "black",
                    }}
                  >
                    {route.title.split("|")[0]}
                  </ThemedText>
                  <ThemedText
                    type="s7"
                    style={{
                      color:
                        props.navigationState.index === routes.indexOf(route)
                          ? "white"
                          : "black",
                    }}
                  >
                    {route.title.split("|")[1]}
                  </ThemedText>
                </Pressable>
              )}
            />
          )}
        />
      ) : (
        <View style={{ alignItems: "center", marginTop: 200 }}>
          <ThemedText type="h5" lightColor="#666" darkColor="#ccc">
            No bus schedules are available today
          </ThemedText>
          <Pressable
            style={{
              marginTop: 10,
              flexDirection: "row",
              gap: 5,
            }}
            onPress={fetchBusDetails}
          >
            <FontAwesomeIcon
              icon={faArrowRotateBack}
              size={18}
              color={iconColor}
              style={{ alignSelf: "center" }}
            />
            <ThemedText type="s5" lightColor={iconColor} darkColor={iconColor}>
              Refresh
            </ThemedText>
          </Pressable>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
  },
  scene: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tab: {
    padding: 5,
    borderRadius: 10,
  },
  activeTab: {
    alignItems: "center",
    backgroundColor: "#0F6F87",
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  inactiveTab: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 20,
    paddingHorizontal: 20,
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
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 20,
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
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
