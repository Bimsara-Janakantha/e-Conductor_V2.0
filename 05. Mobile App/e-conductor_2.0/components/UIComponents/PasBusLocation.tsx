import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  useColorScheme,
  Image,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { LocationObject } from "expo-location";
import MapViewDirections from "react-native-maps-directions";
import axios from "axios";
import { useAppContext } from "../../context/AppContext";
import { Dropdown } from "react-native-element-dropdown";
import ErrorScreen from "../CommonScreens/ErrorScreen";
import { ThemedView } from "../CommonModules/ThemedView";

type Bus = {
  regNo: string;
  routeNo: string;
  route: string;
};

export default function PasBusLocation() {
  const { baseURL, apiKey, myTickets } = useAppContext();
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [busLocation, setBusLocation] = useState<{
    latitude: number;
    longitude: number;
    speed: number;
  } | null>(null);
  const theme = useColorScheme() ?? "light";

  const availableBuses: Bus[] = myTickets
    ? Array.from(myTickets.values())
        .filter((ticket) => ticket.tracking) // Only include tickets where tracking is true
        .map((ticket) => ({
          regNo: ticket.vehicalNo || "", // Fallback to an empty string if vehicalNo is undefined
          routeNo: ticket.routeNo || "", // Fallback to an empty string if routeNo is undefined
          route: ticket.route || "", // Fallback to an empty string if route is undefined
        }))
        .filter((bus) => bus.regNo && bus.route) // Filter out any buses with undefined regNo or route
    : [];

  // Use a Set to track seen regNo values
  const seenRegNos = new Set<string>();

  // Format the dropdown data, ensuring unique regNo
  const dropdownData = availableBuses.reduce(
    (acc, bus) => {
      if (!seenRegNos.has(bus.regNo)) {
        seenRegNos.add(bus.regNo); // Mark this regNo as seen
        acc.push({
          label: `${bus.regNo} | ${bus.route}`, // Show vehicalNo and route in the dropdown
          value: bus, // Set the entire bus object as the value
        });
      }
      return acc;
    },
    [] as { label: string; value: Bus }[]
  );

  // Request location permissions
  const requestPermissions = async (): Promise<void> => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }
  };

  // Get current location
  const getLocation = async (): Promise<LocationObject | null> => {
    try {
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      return location;
    } catch (error) {
      setErrorMsg("Error getting location: " + error);
      return null;
    }
  };

  // Fetch bus location
  const fetchBusLocation = async (regNo: string) => {
    console.log("Getting bus location of bus:", regNo);
    try {
      const response = await axios.get(`${baseURL}/tracking/trk1`, {
        params: { data: regNo },
      });

      const { lat, lng, speed } = response.data;
      setBusLocation({
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        speed: parseFloat(speed),
      });
      console.log(response.data);
    } catch (err) {
      console.error("Failed to fetch bus location", err);
      setBusLocation(null);
    }
  };

  useEffect(() => {
    (async () => {
      await requestPermissions();
      let loc = await getLocation();
      setLocation(loc);
      if (loc) {
        console.log("Current Location:", loc.coords);
      }
    })();

    const interval = setInterval(async () => {
      let loc = await getLocation();
      setLocation(loc);
      if (loc) {
        console.log("Updated Location:", loc.coords);
      }
      if (selectedBus) await fetchBusLocation(selectedBus.regNo);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setSelectedBus(availableBuses[0]);
  }, []);

  if (errorMsg) {
    return <ErrorScreen error={errorMsg} retry={getLocation}/>
  }

  return (
    <ThemedView style={styles.container}>
      {errorMsg ? (
        <Text>{errorMsg}</Text>
      ) : (
        location && (
          <View style={StyleSheet.absoluteFillObject}>
            <Dropdown
              style={styles.inputDropdown}
              placeholderStyle={[{ color: "gray" }]}
              data={dropdownData}
              labelField={"label"}
              valueField={"value"}
              placeholder="Select a bus"
              value={selectedBus ? selectedBus.regNo : null}
              onChange={(item) => {
                setSelectedBus(item.value);
              }}
            />
            <MapView
              style={StyleSheet.absoluteFillObject}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              showsUserLocation
            >
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
              />
              {busLocation && (
                <View>
                  <Marker
                    coordinate={{
                      latitude: busLocation.latitude,
                      longitude: busLocation.longitude,
                    }}
                    pinColor="blue"
                  >
                    <Image
                      source={require("../../assets/icons/bus_location_icon.png")}
                      style={{ width: 50, height: 50 }}
                    />
                  </Marker>
                  <MapViewDirections
                    origin={{
                      latitude: location.coords.latitude,
                      longitude: location.coords.longitude,
                    }}
                    destination={{
                      latitude: busLocation.latitude,
                      longitude: busLocation.longitude,
                    }}
                    apikey={apiKey}
                    strokeWidth={6}
                    strokeColor="#d17"
                    onError={(errorMessage) => {
                      console.error("MapViewDirections Error:", errorMessage);
                    }}
                  />
                </View>
              )}
            </MapView>
          </View>
        )
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  inputDropdown: {
    width: 300,
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
