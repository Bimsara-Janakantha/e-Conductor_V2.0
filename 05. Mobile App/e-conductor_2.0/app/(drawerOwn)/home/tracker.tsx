import React, { useState, useEffect } from "react";
import { StyleSheet, View, useColorScheme } from "react-native";
import * as Location from "expo-location";

import OwnBusLocation from "../../../components/UIComponents/OwnBusLocation";
import ErrorScreen from "../../../components/CommonScreens/ErrorScreen";
import LoadingScreen from "../../../components/CommonScreens/LoadingScreen";

/**
 * Tracker component responsible for tracking the bus's current location.
 * This component requests location permissions, retrieves the current location,
 * and displays the location of the bus using the OwnBusLocation component.
 */
export default function Tracker() {
  const theme = useColorScheme() ?? "light"; // Get the current theme ('light' or 'dark')
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  ); // Store the bus's location
  const [errorPermission, setErrorPermission] = useState<string | null>(null); // Store permission error messages
  const [loading, setLoading] = useState(true); // Track loading state for location fetch
  const [error, setError] = useState<string>(""); // Store any general errors

  //================================================ Functions ===============================================//

  /**
   * Requests permission to access the user's location.
   * If permission is granted, returns true; otherwise, sets an error message.
   * @returns {Promise<boolean>} Whether the location permission was granted
   */
  const requestPermissions = async (): Promise<boolean> => {
    setLoading(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorPermission("Permission to access location was denied");
      return false;
    }
    return true;
  };

  /**
   * Fetches the current location of the device with high accuracy.
   * If successful, updates the location state; if an error occurs, sets an error message.
   */
  const getLocation = async (): Promise<void> => {
    try {
      let loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(loc);
    } catch (error) {
      setErrorPermission("Error getting location: " + error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reloads the location by first requesting permission and then fetching the location.
   * Includes a slight delay before fetching the location to avoid repeated requests.
   */
  const reloadLocation = async (): Promise<void> => {
    (async () => {
      const hasPermission = await requestPermissions();
      if (hasPermission) {
        // Adding a slight delay before getting the location
        setTimeout(async () => {
          await getLocation();
        }, 1000);
      } else {
        setLoading(false);
      }
    })();
  };

  //================================================ Use Effects ===============================================//

  /**
   * Effect that runs on component mount to request location permission and
   * retrieve the current location if permission is granted.
   */
  useEffect(() => {
    (async () => {
      const hasPermission = await requestPermissions();
      if (hasPermission) {
        // Adding a slight delay before getting the location
        setTimeout(async () => {
          await getLocation();
        }, 1000);
      } else {
        setLoading(false);
      }
    })();
  }, []);

  //================================================ UI Control ===============================================//

  if (loading) {
    return <LoadingScreen />;
  }

  if (error !== "" && !loading) {
    return <ErrorScreen error={error} retry={reloadLocation} />;
  }

  return <View style={styles.container}>{location && <OwnBusLocation />}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  reloadButton: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: "transparent",
  },
});
