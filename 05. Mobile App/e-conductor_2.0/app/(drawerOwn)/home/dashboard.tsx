import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowRotateBack,
  faArrowsRotate,
} from "@fortawesome/free-solid-svg-icons";
import { Href, router } from "expo-router";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

import { Bus, useAppContext } from "../../../context/AppContext";
import { ThemedText } from "../../../components/CommonModules/ThemedText";
import { EarningsGraph } from "../../../components/UIComponents/EarningGraph";
import LoadingScreen from "../../../components/CommonScreens/LoadingScreen";
import ErrorScreen from "../../../components/CommonScreens/ErrorScreen";
import { ThemedView } from "../../../components/CommonModules/ThemedView";
import { AccountDeatils } from "../../../components/UIComponents/AccountDetails";

/**
 * Represents the structure of income data for statistics.
 */
interface IncomeData {
  vehicleRegNo: string;
  weekly: {
    receivedData: number[];
    refundData: number[];
    earningData: number[];
    xLabels: string[];
  };
}

/**
 * Dashboard component for bus owners.
 * Provides functionality to monitor bus locations and their earnings,
 */
export default function Dashboard() {
  const { baseURL, id, myBuses, setMyBuses } = useAppContext(); // Extracting global context values
  const theme = useColorScheme() ?? "light"; // Detect current theme (light or dark mode)
  const dropdownOptions = [
    { label: "Earnings", value: "earningData" },
    { label: "Refunds", value: "refundData" },
    { label: "Received", value: "receivedData" },
  ];  // Dropdown options for selecting weekly data type (Earnings, Refunds, or Received)
  const [incomeData, setIncomeData] = useState<IncomeData[]>([]); // Stores income data for the buses
  const [loading, setLoading] = useState<boolean>(false); // Tracks loading state
  const [error, setError] = useState<string>(""); // Tracks error messages
  const [selectedWeeklyData, setSelectedWeeklyData] =
    useState<string>("earningData"); // Tracks selected data type for weekly graph

  //================================================ Functions ===============================================//

   /**
   * Transforms weekly income data into a graphable format.
   * @param dataType - The specific data type (e.g., earningData, refundData, receivedData).
   * @returns An array of objects containing label (day of the week) and value (amount).
   */
  const getWeeklyData = (dataType: keyof IncomeData["weekly"]) => {
    if (!incomeData || incomeData.length === 0) return []; // Check for array and length
    const earningsData = incomeData[0].weekly[dataType]; // Access the weekly property of the first item
    return earningsData.map((value, idx) => ({
      label: incomeData[0].weekly.xLabels[idx],
      value: Number(value),
    }));
  };

  //================================================ Backend Calls ===============================================//

   /**
   * Fetches income data for each bus separately from the backend.
   */
  const fetchIncomeData = async () => {
    setError("");
    try {
      const response = await axios.post(`${baseURL}/bus/incomeIndie`, { id });
      setIncomeData(response.data);
    } catch (error) {
      console.error("Error fetching bus income data:", error);
      setError(String(error));
      Alert.alert("Error", "Failed to fetch income data");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetches the details of owned buses from the backend.
   */
  const fetchBuses = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(`${baseURL}/bus/mybuses`, { id });
      console.log(response.data);
      setMyBuses(response.data);
    } catch (error) {
      console.error("Error fetching buses:", error);
      setError(String(error));
      Alert.alert("Error", "Failed to fetch bus data");
    } finally {
      setLoading(false);
    }
  };

  //================================================ Use Effects ===============================================//

  // Fetch owned buses' details on component mount
  useEffect(() => {
    fetchBuses();
  }, []);

  // Fetch income data of the buses when myBuses updates
  useEffect(() => {
    fetchIncomeData();
  }, [myBuses]);

  //================================================ UI Control ===============================================//

  if (loading) {
    return <LoadingScreen />;
  }

  if (error !== "" && !loading) {
    return <ErrorScreen error={error} retry={fetchBuses} />;
  }

  return (
    <ThemedView style={styles.mainBody}>
      <AccountDeatils showRecharge={false} />
      <ScrollView
        style={{
          paddingHorizontal: 10,
        }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 10,
            marginVertical: 10,
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              justifyContent: "flex-start",
              marginHorizontal: 10,
            }}
          >
            <ThemedText style={styles.title}>Weekly</ThemedText>
            <Dropdown
              style={styles.inputDropdown}
              placeholderStyle={{ color: "gray" }}
              data={dropdownOptions}
              labelField="label"
              valueField="value"
              placeholder="Select Data Type"
              value={selectedWeeklyData}
              onChange={(item) => {
                setSelectedWeeklyData(item.value); // Update selected data type for weekly
              }}
            />
          </View>
          <Pressable
            style={{
              backgroundColor: theme === "dark" ? "#555" : "#fff",
              alignItems: "center",
              paddingVertical: 10,
              paddingHorizontal: 10,
              marginTop: -20,
              borderRadius: 50,
              elevation: 5,
            }}
            onPress={fetchIncomeData}
          >
            <FontAwesomeIcon
              icon={faArrowsRotate}
              size={20}
              color={theme === "dark" ? "#ccc" : "#444"}
            />
          </Pressable>
        </View>
        {incomeData.map((vehicle) => (
          <View
            key={vehicle.vehicleRegNo}
            style={{ marginHorizontal: 10, marginVertical: 15 }}
          >
            <ThemedText style={styles.title}>
              Reg No: {vehicle.vehicleRegNo}
            </ThemedText>
            <EarningsGraph
              data={getWeeklyData(
                selectedWeeklyData as keyof IncomeData["weekly"]
              )}
            />
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
  },
  rechargeButton: {
    alignItems: "center",
    backgroundColor: "#fff2",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  inputDropdown: {
    width: 130,
    height: 40,
    borderColor: "#aaa",
    backgroundColor: "#fff",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
});
