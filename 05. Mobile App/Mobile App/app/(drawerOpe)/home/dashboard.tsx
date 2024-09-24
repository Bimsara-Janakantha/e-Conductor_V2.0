import { ThemedText } from "@/components/CommonModules/ThemedText";
import { ThemedView } from "@/components/CommonModules/ThemedView";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faUser,
  faArrowRight,
  faChevronRight,
  faC,
} from "@fortawesome/free-solid-svg-icons";
import { Href, router } from "expo-router";
import {
  Button,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { Ticket } from "@/controller/Ticket";
import { TicketView } from "@/components/UIComponents/TicketView";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useAppContext } from "@/context/AppContext";
import { requestPermissions } from "@/components/LocationUpdate";
import { useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import BusList from "@/components/BusList";
import axios from "axios";
import { Seat54Layout } from "@/components/UIComponents/SeatLayouts";
import { LocationObject } from "expo-location";
import { Picker } from "@react-native-picker/picker";

var ticketsAvailable = true;

interface user {
  userType: string;
  empType: string;
  fName: string;
  lName: string;
  email: string;
  mobile: string;
  nic: string;
  birthDay: string;
  ntc: string;
  licence: string;
  accName: string;
  accNo: string;
  bank: string;
  branch: string;
}

export default function Dashboard() {
  const addUser = async (userData: user) => {
    try {
      const response = await axios.post(`${baseURL}/mobileAPI/user/users`, {
        type: "Req3", // Specify the request type for adding a user
        data: userData, // This should include all necessary user details
      });
      console.log(response.data); // Should return "success" or "error"
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  // Example user data for an employee
  const newUser = {
    userType: "employee", // or "passenger" or "owner"
    empType: "Both",
    fName: "Jane",
    lName: "Doe",
    email: "e20035@eng.pdn.ac.lk",
    mobile: "0767601948",
    nic: "NIC123456",
    birthDay: "1990-01-01",
    ntc: "NTC123456",
    licence: "LIC123456",
    accName: "Jane Doe",
    accNo: "123456789",
    bank: "Some Bank",
    branch: "Main Branch",
  };

  const seatColors = new Map<String, string>([
    ["Available", "#999a"],
    ["Booked", "#0af"],
    ["Canceled", "#f30e"],
    ["Reserved", "#f90"],
  ]);

  const [location, setLocation] = useState<LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [updateInterval, setUpdateInterval] = useState<number>(2000); // Default to 2 seconds
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null); // Correct typing

  // Request location permissions
  const requestPermissions = async (): Promise<void> => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }
    setErrorMsg(null); // Clear error if permissions are granted
  };

  // Get current location
  const getLocation = async (): Promise<LocationObject | null> => {
    try {
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setErrorMsg(null); // Clear error on success
      return location;
    } catch (error) {
      setErrorMsg("Error getting location: " + error);
      return null;
    }
  };

  // Update bus location on the server
  const updateBusLocation = async (
    regNo: string,
    lat: number,
    lng: number,
    speed: number | null
  ) => {
    try {
      await axios.post(`${baseURL}/mobileAPI/bus/updateBusLoc`, {
        regNo,
        lat,
        lng,
        speed,
      });
      console.log(
        `Updated bus location to Lat: ${lat}, Lng: ${lng}, Speed: ${speed}`
      );
    } catch (error) {
      console.error("Error updating bus location:", error);
    }
  };

  // Start tracking location at the selected interval
  const startTracking = async () => {
    await requestPermissions(); // Ensure permissions are requested
    if (intervalRef.current) return; // Prevent starting multiple intervals

    intervalRef.current = setInterval(async () => {
      const loc = await getLocation();
      if (loc) {
        setLocation(loc);
        // Send the updated location and speed to the server
        await updateBusLocation(
          "NA-5083",
          loc.coords.latitude,
          loc.coords.longitude,
          loc.coords.speed
        ); // Update with your bus registration number
        console.log(
          "Updated Location:",
          loc.coords,
          "Speed:",
          loc.coords.speed
        );
      }
    }, updateInterval); // Use the selected interval
    setIsTracking(true);
  };

  // Stop tracking location
  const stopTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsTracking(false);
    }
  };

  // Manually refresh the location in case of an error
  const refreshLocation = async () => {
    const loc = await getLocation();
    setLocation(loc);
    if (loc) {
      console.log("Refreshed Location:", loc.coords);
      // Optionally, send the refreshed location to the server
      await updateBusLocation(
        "NA-5083",
        loc.coords.latitude,
        loc.coords.longitude,
        loc.coords.speed
      ); // Update with your bus registration number
    }
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Update the interval and restart tracking if necessary
  useEffect(() => {
    if (isTracking) {
      stopTracking(); // Stop the current tracking
      startTracking(); // Restart tracking with the new interval
    }
  }, [updateInterval]); // Trigger effect when updateInterval changes

  const getUserInfo = async (phoneNumber: string) => {
    try {
      const response = await axios.post(
        `${baseURL}/mobileAPI/user/users/info`,
        {
          type: "Req1", // Specify the request type for fetching user info
          data: phoneNumber, // Phone number to search for
        }
      );

      if (response.data.error) {
        console.error("Error fetching user info:", response.data.error);
      } else {
        console.log("User info retrieved successfully:", response.data);
        // Handle the retrieved user data here
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  interface VerifyOTPResponse {
    error?: string;
    success?: string;
    verified?: boolean;
  }

  // Example user phone number
  const phoneNumber = "94703406796";

  // Example user data

  const { baseURL, credits, myTickets } = useAppContext();
  const theme = useColorScheme() ?? "light";

  // const handleStartTracking = () => {
  //   requestPermissions();
  // };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Display error message if any */}
        {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

        {/* Display current location */}
        {location && (
          <Text style={styles.locationText}>
            Current location: Latitude: {location.coords.latitude}, Longitude:{" "}
            {location.coords.longitude}, Speed:{" "}
            {location.coords.speed !== null
              ? location.coords.speed.toFixed(2)
              : "N/A"}{" "}
            m/s
          </Text>
        )}

        {/* Start/Stop tracking button */}
        <Pressable
          style={styles.button}
          onPress={isTracking ? stopTracking : startTracking}
        >
          <Text style={styles.buttonText}>
            {isTracking ? "Stop Tracking" : "Start Tracking"}
          </Text>
        </Pressable>

        {/* Refresh button */}
        <Pressable style={styles.button} onPress={refreshLocation}>
          <Text style={styles.buttonText}>Refresh Location</Text>
        </Pressable>

        {/* Dropdown for selecting update interval */}
        <Text style={styles.pickerLabel}>
          Select Location Update Interval (ms)
        </Text>
        <Picker
          selectedValue={updateInterval}
          style={styles.picker}
          onValueChange={(itemValue) => setUpdateInterval(itemValue)}
        >
          <Picker.Item label="1000 ms (1 sec)" value={1000} />
          <Picker.Item label="2000 ms (2 sec)" value={2000} />
          <Picker.Item label="5000 ms (5 sec)" value={5000} />
          <Picker.Item label="10000 ms (10 sec)" value={10000} />
        </Picker>
      </View>
      <View style={styles.mainBody}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: 20,
            paddingVertical: 3,
            paddingHorizontal: 5,
            marginHorizontal: "10%",
          }}
        ></View>
        <View
          style={{
            marginHorizontal: 40,
            backgroundColor: "#fff",
            borderRadius: 20,
          }}
        >
          <Seat54Layout />
        </View>
        <View style={{ marginHorizontal: 40, marginVertical: 20 }}>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View
              style={{
                height: 20,
                width: 20,
                backgroundColor: seatColors.get("Available"),
                borderRadius: 10,
              }}
            ></View>
            <ThemedText>Available</ThemedText>
          </View>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View
              style={{
                height: 20,
                width: 20,
                backgroundColor: seatColors.get("Booked"),
                borderRadius: 10,
              }}
            ></View>
            <ThemedText>Booked</ThemedText>
          </View>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View
              style={{
                height: 20,
                width: 20,
                backgroundColor: seatColors.get("Canceled"),
                borderRadius: 10,
              }}
            ></View>
            <ThemedText>Canceled</ThemedText>
          </View>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View
              style={{
                height: 20,
                width: 20,
                backgroundColor: seatColors.get("Reserved"),
                borderRadius: 10,
              }}
            ></View>
            <ThemedText>Reserved</ThemedText>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
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
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
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
});
