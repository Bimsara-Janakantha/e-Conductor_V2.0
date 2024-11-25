import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useColorScheme } from "react-native";
import { useAppContext } from "../../context/AppContext";
import axios from "axios";
import { Dropdown } from "react-native-element-dropdown";

export default function OwnBusLocation() {
  const { baseURL, myBuses } = useAppContext();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);
  const [selectedBusLocation, setSelectedBusLocation] = useState<{
    latitude: number;
    longitude: number;
    speed: number;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const theme = useColorScheme() ?? "light";
  const iconColor = theme === "dark" ? "#eee" : "#777";
  const iconSize = 20;

  // Format the dropdown data, ensuring unique regNo
const dropdownData = myBuses.reduce((acc, bus) => {
  acc.push({
    label: bus.regNo,
    value: bus.regNo, // Set the entire bus object as the value
  });
  return acc;
}, [] as { label: string; value: string }[]);

  // Request location permissions
  const requestPermissions = async (): Promise<void> => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }
  };

  // Get user's current location
  const getLocation = async (): Promise<Location.LocationObject | null> => {
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

  // Fetch the selected bus location
  const fetchBusLocation = async (regNo: string) => {
    try {
      const response = await axios.get(`${baseURL}/tracking/trk1`, {
        params: { data: regNo },
      });

      const { lat, lng, speed } = response.data;
      setSelectedBusLocation({
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        speed: parseFloat(speed),
      });
    } catch (err) {
      console.error("Failed to fetch bus location", err);
      setSelectedBusLocation(null);
    }
  };

  // On mount, request permissions and get user location
  useEffect(() => {
    (async () => {
      await requestPermissions();
      let loc = await getLocation();
      setLocation(loc);
    })();
  }, []);

  // Fetch bus location whenever the selected bus changes
  useEffect(() => {
    if (selectedBusId) {
      fetchBusLocation(selectedBusId);
    }
  }, [selectedBusId]);

  return (
    <View style={styles.container}>
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
              value={selectedBusId ? selectedBusId : null} 
              onChange={(item) => {
                setSelectedBusId(item.value);
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
              region={
                selectedBusLocation
                  ? {
                      latitude: selectedBusLocation.latitude,
                      longitude: selectedBusLocation.longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }
                  : undefined
              }
              showsUserLocation
            >
              {selectedBusLocation && (
                <Marker
                  coordinate={{
                    latitude: selectedBusLocation.latitude,
                    longitude: selectedBusLocation.longitude,
                  }}
                  pinColor="blue"
                >
                  <Image
                    source={require("../../assets/icons/bus_location_icon.png")}
                    style={{ width: 50, height: 50 }}
                  />
                </Marker>
              )}
            </MapView>
          </View>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }, inputDropdown: {
    width: 300,
    color: "#333",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    elevation: 3,
    zIndex: 2,
    margin: 12
  },
});
