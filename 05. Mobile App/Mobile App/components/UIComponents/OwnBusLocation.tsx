import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useColorScheme } from "react-native";
import { useAppContext } from "@/context/AppContext";
import { Picker } from "@react-native-picker/picker";

export default function OwnBusLocation() {
  const { myBuses, myBusLocations, setMyBusLocations } = useAppContext();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);
  const [selectedBusLocation, setSelectedBusLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const theme = useColorScheme() ?? "light";
  const iconColor = theme === "dark" ? "#eee" : "#777";
  const iconSize = 20;
  const requestPermissions = async (): Promise<void> => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }
  };

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

  const fetchBusLocations = async () => {
    // Simulate fetching updated bus locations from a server
    const updatedBuses = myBusLocations.map((bus) => ({
      ...bus,
      latitude: bus.latitude + (Math.random() - 2) * 0.0001,
      longitude: bus.longitude + (Math.random() - 2) * 0.0001,
    }));
    setMyBusLocations(updatedBuses);
  };

  useEffect(() => {
    (async () => {
      await requestPermissions();
      let loc = await getLocation();
      setLocation(loc);
    })();

    const interval = setInterval(fetchBusLocations, 1000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedBusId) {
      const selectedBus = myBusLocations.find(
        (bus) => bus.id === selectedBusId
      );
      if (selectedBus) {
        setSelectedBusLocation({
          latitude: selectedBus.latitude,
          longitude: selectedBus.longitude,
        });
      }
    }
  }, [selectedBusId]);

  return (
    <View style={styles.container}>
      {errorMsg ? (
        <Text>{errorMsg}</Text>
      ) : (
        location && (
          <View style={StyleSheet.absoluteFillObject}>
            <Picker
              selectedValue={selectedBusId}
              onValueChange={(itemValue: any) => setSelectedBusId(itemValue)}
              style={{
                position: "absolute",
                zIndex: 2,
                height: 20,
                width: 200,
                backgroundColor: "#fffd",
                margin: 12,
              }}
            >
              {myBusLocations.map((bus) => (
                <Picker.Item
                  key={bus.id}
                  label={myBuses.find((myBus) => myBus.id === bus.id)?.regNo}
                  value={bus.id}
                />
              ))}
            </Picker>
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
              {myBusLocations.map((bus) => (
                <Marker
                  key={bus.id}
                  coordinate={{
                    latitude: bus.latitude,
                    longitude: bus.longitude,
                  }}
                  pinColor="blue"
                >
                  <Image
                    source={require("@/assets/icons/bus_location_icon.png")}
                    style={{ width: 50, height: 50 }}
                  />
                </Marker>
              ))}
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
  },
});
