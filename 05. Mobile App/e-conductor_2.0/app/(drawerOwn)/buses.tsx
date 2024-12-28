import { ScrollView } from "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import axios from "axios";

import { useAppContext } from "../../context/AppContext";
import { ThemedText } from "../../components/CommonModules/ThemedText";
import { ThemedView } from "../../components/CommonModules/ThemedView";
import StarRating from "../../components/UIComponents/StarRating";
import LoadingScreen from "../../components/CommonScreens/LoadingScreen";
import ErrorScreen from "../../components/CommonScreens/ErrorScreen";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";

/**
 * Buses Component is responsible for displaying a list of buses owned by the user.
 * It fetches the bus data from the backend and displays the bus details such as registration number,
 * service type, seat count, ratings, earnings, and more. It also provides functionality to refresh
 * the bus data.
 */
export default function Buses() {
  const { baseURL, id } = useAppContext(); // Get the base URL and user ID from app context
  const theme = useColorScheme() ?? "light"; // Get current theme (light or dark)
  const { myBuses, setMyBuses } = useAppContext(); // Access buses data and setter function from context
  const [loading, setLoading] = useState(false); // Loading state to manage data fetching process
  const [error, setError] = useState(""); // Error state to handle API errors

  //================================================ Backend Calls ===============================================//

  /**
   * Fetches the list of buses owned by the user by making a POST request to the backend.
   * The request is sent with the user's ID to fetch the relevant data.
   */
  const fetchBuses = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(`${baseURL}/bus/mybuses`, { id });
      console.log(response.data);
      setMyBuses(response.data);
    } catch (error) {
      console.error("Error fetching myBuses:", error);
      setError(String(error));
      Alert.alert("Error", "Failed to fetch bus data");
    } finally {
      setLoading(false);
    }
  };

  //================================================ Use Effects ===============================================//

  /**
   * The component fetches the buses data when the component is first mounted.
   * This effect will run only once (empty dependency array).
   */
  useEffect(() => {
    fetchBuses();
  }, []);

  //================================================ UI Control ===============================================//

  if (loading) {
    return <LoadingScreen />;
  }

  if (error !== "" && !loading) {
    return <ErrorScreen error={error} retry={fetchBuses} />;
  }

  return (
    <ThemedView style={styles.mainBody}>
      <ScrollView>
        <ThemedView
          style={{
            paddingHorizontal: 20,
          }}
        >
          <Pressable
            style={{
              backgroundColor: theme === "dark" ? "#555" : "#fff",
              alignSelf: "flex-end",
              alignItems: "center",
              paddingVertical: 10,
              paddingHorizontal: 10,
              marginBottom: 10,
              borderRadius: 50,
              elevation: 5,
            }}
            onPress={fetchBuses}
          >
            <FontAwesomeIcon
              icon={faArrowsRotate}
              size={20}
              color={theme === "dark" ? "#ccc" : "#444"}
            />
          </Pressable>
          {myBuses.length > 0 ? (
            myBuses.map((bus) => (
              <View
                key={bus.regNo}
                style={{
                  marginBottom: 15,
                  borderRadius: 10,
                  backgroundColor: theme === "dark" ? "#555" : "#fff",
                  elevation: 5,
                }}
              >
                <View
                  style={{
                    backgroundColor: "#33aefc",
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <ThemedText type="h5" lightColor="#fff" darkColor="#fff">
                      {bus.regNo}
                    </ThemedText>
                    <ThemedText type="h6" lightColor="#fff" darkColor="#fff">
                      {bus.service}
                    </ThemedText>
                    <ThemedText type="h6" lightColor="#fff" darkColor="#fff">
                      {bus.seats} Seats
                    </ThemedText>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    <StarRating rating={bus.rating} />
                    <ThemedText type="h5" lightColor="#eee" darkColor="#eee">
                      {bus.rating}
                    </ThemedText>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    marginBottom: 10,
                    paddingTop: 10,
                  }}
                >
                  <View style={{ alignItems: "center" }}>
                    <ThemedText type="h5">Rides</ThemedText>
                    <ThemedText type="h6" lightColor="#888" darkColor="#ccc">
                      {bus.rides}
                    </ThemedText>
                    <ThemedText
                      type="h6"
                      lightColor={
                        bus.ridesIncrement >= 0 ? "#2fbf0f" : "#ff2f0f"
                      }
                      darkColor={
                        bus.ridesIncrement >= 0 ? "#2fff5f" : "#ff500f"
                      }
                    >
                      {bus.ridesIncrement >= 0 ? "+" : ""}
                      {bus.ridesIncrement}%
                    </ThemedText>
                  </View>
                  <View style={{ alignItems: "center" }}>
                    <ThemedText type="h5">Earnings</ThemedText>
                    <ThemedText type="h6" lightColor="#888" darkColor="#ccc">
                      LKR. {bus.earning.toFixed(2)}
                    </ThemedText>
                    <ThemedText
                      type="h6"
                      lightColor={
                        bus.earningIncrement >= 0 ? "#2fbf0f" : "#ff2f0f"
                      }
                      darkColor={
                        bus.earningIncrement >= 0 ? "#2fff5f" : "#ff500f"
                      }
                    >
                      {bus.earningIncrement >= 0 ? "+" : ""}
                      {bus.earningIncrement}%
                    </ThemedText>
                  </View>
                </View>
                <View style={{ padding: 10 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 5,
                    }}
                  >
                    <ThemedText type="h6">Insurance Exp:</ThemedText>
                    <ThemedText type="h6" lightColor="#888" darkColor="#ccc">
                      {bus.insuranceExp}
                    </ThemedText>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 5,
                    }}
                  >
                    <ThemedText type="h6">VRL Exp:</ThemedText>
                    <ThemedText type="h6" lightColor="#888" darkColor="#ccc">
                      {bus.VRL_Exp}
                    </ThemedText>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <ThemedText>No myBuses found</ThemedText>
          )}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
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
    backgroundColor: "#aaf",
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
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
