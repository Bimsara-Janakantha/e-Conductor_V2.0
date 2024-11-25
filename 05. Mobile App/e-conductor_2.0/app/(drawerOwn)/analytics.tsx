import { useEffect, useState } from "react";
import axios from "axios";
import {
  faArrowRotateBack,
  faArrowsRotate,
} from "@fortawesome/free-solid-svg-icons";

import { Dropdown } from "react-native-element-dropdown";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";

import { useAppContext } from "../../context/AppContext";
import { ThemedText } from "../../components/CommonModules/ThemedText";
import { EarningsGraph } from "../../components/UIComponents/EarningGraph";
import ErrorScreen from "../../components/CommonScreens/ErrorScreen";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { ThemedView } from "../../components/CommonModules/ThemedView";
import LoadingScreen from "../../components/CommonScreens/LoadingScreen";

/**
 * Represents the structure of income data for weekly, monthly, and annual statistics.
 */
interface IncomeData {
  weekly: {
    receivedData: number[];
    refundData: number[];
    earningData: number[];
    xLabels: string[];
  };
  monthly: {
    receivedData: number[];
    refundData: number[];
    earningData: number[];
    xLabels: string[];
  };
  annual: {
    receivedData: number[];
    refundData: number[];
    earningData: number[];
    xLabels: string[];
  };
}

/**
 * Analytics screen for visualizing weekly, monthly, and annual income data through graphs.
 * Allows users to toggle between total earnings, refunds, and received data for each time period.
 */
export default function Analytics() {
  const { baseURL, id } = useAppContext(); // Extracting global context values
  const theme = useColorScheme() ?? "light"; // Detect current theme (light or dark mode)
  const dropdownOptions = [
    { label: "Total Earnings", value: "earningData" },
    { label: "Total Refunds", value: "refundData" },
    { label: "Total Received", value: "receivedData" },
  ]; // Dropdown options for selecting data types
  const [incomeData, setIncomeData] = useState<IncomeData | null>(null); // Income data fetched from API.
  const [selectedWeeklyData, setSelectedWeeklyData] =
    useState<string>("earningData"); // Selected weekly data type.
  const [selectedMonthlyData, setSelectedMonthlyData] =
    useState<string>("earningData"); // Selected monthly data type.
  const [selectedAnnualData, setSelectedAnnualData] =
    useState<string>("earningData"); // Selected annual data type.
  const [loading, setLoading] = useState<boolean>(true); // Loading state for data fetch.
  const [error, setError] = useState<string>(""); // Error message for data fetch.

  //============================================== Functions ===============================================//

  /**
   * Transforms weekly income data into a format suitable for graph rendering.
   * @param dataType - Key indicating the type of weekly data (e.g., "earningData").
   * @returns Array of objects with labels and values for the graph.
   */
  const getWeeklyData = (dataType: keyof IncomeData["weekly"]) => {
    if (!incomeData) return [];
    const earningData = incomeData.weekly[dataType];
    return earningData.map((value, idx) => ({
      label: incomeData.weekly.xLabels[idx],
      value: Number(value),
    }));
  };

  /**
   * Transforms monthly income data into a format suitable for graph rendering.
   * @param dataType - Key indicating the type of monthly data (e.g., "earningData").
   * @returns Array of objects with labels and values for the graph.
   */
  const getMonthlyData = (dataType: keyof IncomeData["monthly"]) => {
    if (!incomeData) return [];
    const earningData = incomeData.monthly[dataType];
    return earningData.map((value, idx) => ({
      label: incomeData.monthly.xLabels[idx],
      value: Number(value),
    }));
  };

  /**
   * Transforms annual income data into a format suitable for graph rendering.
   * @param dataType - Key indicating the type of annual data (e.g., "earningData").
   * @returns Array of objects with labels and values for the graph.
   */
  const getAnnualData = (dataType: keyof IncomeData["annual"]) => {
    if (!incomeData) return [];
    const earningData = incomeData.annual[dataType];
    return earningData.map((value, idx) => ({
      label: incomeData.annual.xLabels[idx],
      value: Number(value),
    }));
  };

  //============================================== Backend Calls ===============================================//

  /**
   * Fetches total income data from the backend.
   * Sets the income data in state and handles loading and error states.
   */
  const fetchIncomeData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`${baseURL}/bus/incomeTotal`, { id });
      setIncomeData(response.data);
    } catch (error) {
      console.error("Error fetching total bus income data:", error);
      setError(String(error));
      Alert.alert("Error", "Failed to fetch total income data");
    } finally {
      setLoading(false);
    }
  };

  //================================================ Use Effects ===============================================//

  // Fetch total income data on component mount
  useEffect(() => {
    fetchIncomeData();
  }, []);

  //================================================ UI Control ===============================================//

  if (loading) {
    return <LoadingScreen />;
  }

  if (error !== "" && !loading) {
    return <ErrorScreen error={error} retry={fetchIncomeData} />;
  }

  return (
    <ThemedView style={styles.mainBody}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: "transparent", padding: 20 }}
      >
        {incomeData && (
          <View style={{ marginHorizontal: 5 }}>
            <View
              style={{
                marginBottom: 50,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    justifyContent: "flex-start",
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
                    alignSelf: "flex-end",
                    alignItems: "center",
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    marginBottom: 30,
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
              <EarningsGraph
                data={getWeeklyData(
                  selectedWeeklyData as keyof IncomeData["weekly"]
                )}
              />
            </View>

            <View
              style={{
                marginBottom: 50,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  justifyContent: "flex-start",
                }}
              >
                <ThemedText style={styles.title}>Monthly</ThemedText>
                <Dropdown
                  style={styles.inputDropdown}
                  placeholderStyle={{ color: "gray" }}
                  data={dropdownOptions}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Data Type"
                  value={selectedMonthlyData}
                  onChange={(item) => {
                    setSelectedMonthlyData(item.value); // Update selected data type for monthly
                  }}
                />
              </View>
              <EarningsGraph
                data={getMonthlyData(
                  selectedMonthlyData as keyof IncomeData["monthly"]
                )}
              />
            </View>

            <View
              style={{
                marginBottom: 50,
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
                <ThemedText style={styles.title}>Annual</ThemedText>
                <Dropdown
                  style={styles.inputDropdown}
                  placeholderStyle={{ color: "gray" }}
                  data={dropdownOptions}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Data Type"
                  value={selectedAnnualData}
                  onChange={(item) => {
                    setSelectedAnnualData(item.value); // Update selected data type for annual
                  }}
                />
              </View>
              <EarningsGraph
                data={getAnnualData(
                  selectedAnnualData as keyof IncomeData["annual"]
                )}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  inputDropdown: {
    height: 40,
    width: 150,
    borderColor: "#aaa",
    backgroundColor: "#fff",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
});
