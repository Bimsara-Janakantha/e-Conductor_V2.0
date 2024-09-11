import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, useColorScheme, Image } from "react-native";
import MapView, { Marker, Polyline, Region } from "react-native-maps";
import * as Location from "expo-location";
import { LocationObject } from "expo-location";
import MapViewDirections from "react-native-maps-directions";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

export default function MapLocation() {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [destination, setDestination] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
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

  useEffect(() => {
    (async () => {
      await requestPermissions();
      let loc = await getLocation();
      setLocation(loc);
      if (loc) {
        // Set a sample destination for demonstration purposes
        setDestination({
          latitude: loc.coords.latitude + 0.04, // Adjust as needed
          longitude: loc.coords.longitude + 0.009, // Adjust as needed
        });
        console.log("Current Location:", loc.coords);
        console.log("Destination:", {
          latitude: loc.coords.latitude + 0.01,
          longitude: loc.coords.longitude + 0.01,
        });
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      {errorMsg ? (
        <Text>{errorMsg}</Text>
      ) : (
        location && (
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
            {destination && (
              <View>
                <Marker
                  coordinate={{
                    latitude: destination.latitude,
                    longitude: destination.longitude,
                  }}
                  pinColor="blue"
                >
                  <Image
                    source={require("@/assets/icons/bus_location_icon.png")}
                    style={{ width: 50, height: 50 }}
                  />
                </Marker>
                <MapViewDirections
                  origin={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                  }}
                  destination={{
                    latitude: destination.latitude,
                    longitude: destination.longitude,
                  }}
                  apikey="AIzaSyAe0QzwhP9SW5wsLN_XekECNUdZJwLieK8"
                  strokeWidth={6}
                  strokeColor="hotpink"
                />
              </View>
            )}
          </MapView>
        )
      )}
    </View>
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
});
