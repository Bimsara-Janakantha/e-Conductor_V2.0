import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, useColorScheme, Image } from "react-native";
import MapView, { Marker, Polyline, Region } from "react-native-maps";
import * as Location from "expo-location";
import { LocationObject } from "expo-location";
import MapViewDirections from "react-native-maps-directions";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useAppContext } from "@/context/AppContext";

export default function PasBusLocation() {
  const { baseURL, myTickets } = useAppContext();
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [destination, setDestination] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const theme = useColorScheme() ?? "light";

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

  //Fetch destination coordinates from the server
  const fetchDestination = async (regNo: string) => {
    try {
      const response = await axios.get(`${baseURL}/mobileAPI/bus/busloc`, {
        params: { regNo },
      });

      const { lat, lng } = response.data;

      // Convert lat and lng to numbers to ensure MapViewDirections receives valid coordinates
      setDestination({
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
      });

      console.log("Fetched destination:", response.data);
    } catch (error) {
      console.error("Error fetching destination:", error);
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
      await fetchDestination("NA-5083");
    }, 2000);

    return () => clearInterval(interval);
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
              // latitude: location.coords.latitude,
              // longitude: location.coords.longitude,
              latitude: 7.264831,
              longitude: 80.596882,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation
          >
            <Marker
              coordinate={{
                // latitude: location.coords.latitude,
                // longitude: location.coords.longitude,
                latitude: 7.264831,
                longitude: 80.596882,
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
                    // latitude: location.coords.latitude,
                    // longitude: location.coords.longitude,
                    latitude: 7.264831,
                    longitude: 80.596882,
                  }}
                  destination={{
                    latitude: destination.latitude,
                    longitude: destination.longitude,
                  }}
                  apikey="AIzaSyB8KTu2cHiVsaBQAjxVFfe5YSjUaQHZVec"
                  strokeWidth={6}
                  strokeColor="#d17"
                  onError={(errorMessage) => {
                    console.error("MapViewDirections Error:", errorMessage);
                  }}
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
