import axios from "axios";
import { ScrollView } from "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";

import { useAppContext } from "../../context/AppContext";
import { ThemedText } from "../../components/CommonModules/ThemedText";
import ErrorScreen from "./ErrorScreen";
import LoadingScreen from "./LoadingScreen";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

/**
 * Represents the structure of transaction data.
 */
interface TransactionData {
  id: string;
  date: string;
  time: string;
  description: string;
  amount: string;
}

/**
 * Transaction screen for displaying a list of transactions made by the user.
 * Allows users to see the histroy of transactions they made and their details.
 */
export default function TransactionScreen() {
  const { baseURL, id } = useAppContext();
  const theme = useColorScheme() ?? "light";
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  //================================================ Backend Calls ===============================================//

  /**
   * Fetch transaction history from the backend.
   * This function makes an API call to retrieve transaction data based on the user's ID.
   */
  const fetchTransactionHistory = async () => {
    setLoading(true);
    setError("");
    setTransactions([]);

    try {
      const response = await axios.get(`${baseURL}/transactions/trans1`, {
        params: {
          data: id,
        },
      });

      if (response.status === 200) {
        if (response.data.transaction && response.data.transaction.length > 0) {
          setTransactions(response.data.transaction);
        } else {
          setTransactions([]);
        }
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 404) {
          setTransactions([]);
        } else {
          console.error("Error fetching transaction history:", error);
          setError("Failed to fetch transaction history");
          Alert.alert("Error", "Failed to fetch transaction history");
        }
      } else {
        // Handle non-Axios errors
        console.error("Unexpected error:", error);
        setError("Failed to fetch transaction history");
        Alert.alert("Error", "Failed to fetch transaction history");
      }
    } finally {
      setLoading(false);
    }
  };

  //================================================ Use Effects ===============================================//

  /**
   * Fetch transaction history when the component mounts.
   * Here, we simulate data with dummy data (you can replace this with the actual API call if necessary).
   */
  useEffect(() => {
    if (transactions.length == 0) {
      fetchTransactionHistory();
    }
    setTransactions(dummyTransactionData);
  }, []);

  const dummyTransactionData: TransactionData[] = [
    {
      id: "TRX12345",
      date: "2024-11-20",
      time: "10:30 AM",
      description: "Bus Ticket Purchase - Route 101",
      amount: "500.00",
    },
    {
      id: "TRX12346",
      date: "2024-11-21",
      time: "02:15 PM",
      description: "Refund for Ticket - Route 202",
      amount: "-200.00",
    },
    {
      id: "TRX12347",
      date: "2024-11-22",
      time: "08:45 AM",
      description: "Bus Ticket Purchase - Route 303",
      amount: "600.00",
    },
    {
      id: "TRX12348",
      date: "2024-11-23",
      time: "05:00 PM",
      description: "Recharge Wallet",
      amount: "1000.00",
    },
    {
      id: "TRX12349",
      date: "2024-11-24",
      time: "12:00 PM",
      description: "Ticket Cancellation Fee - Route 404",
      amount: "-50.00",
    },
  ];

  //================================================ UI Control ===============================================//

  if (loading) {
    return <LoadingScreen />;
  }

  if (error !== "" && !loading) {
    return <ErrorScreen error={error} retry={fetchTransactionHistory} />;
  }

  return (
    <ScrollView
      style={{ backgroundColor: theme === "dark" ? "#202020" : "#ffffff" }}
    >
      <View style={{ paddingHorizontal: 15 }}>
        <Pressable
          style={{
            backgroundColor: theme === "dark" ? "#555" : "#fff",
            alignSelf: "flex-end",
            alignItems: "center",
            paddingVertical: 10,
            paddingHorizontal: 10,
            marginTop: 10,
            marginBottom: 10,
            borderRadius: 50,
            elevation: 5,
          }}
          onPress={fetchTransactionHistory}
        >
          <FontAwesomeIcon
            icon={faArrowsRotate}
            size={20}
            color={theme === "dark" ? "#ccc" : "#444"}
          />
        </Pressable>

        {transactions.length > 0 ? (
          transactions.map((trans) => (
            <View
              key={trans.id}
              style={{
                marginBottom: 15,
                borderRadius: 10,
                backgroundColor: theme === "dark" ? "#555" : "#fff",
                elevation: 5,
              }}
            >
              <View
                style={{
                  backgroundColor: "#62edb5",
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <ThemedText type="h6" lightColor="#2B644D" darkColor="#2B644D">
                  Reference No: {trans.id}
                </ThemedText>
                <ThemedText type="h6" lightColor="#2B644D" darkColor="#2B644D">
                  {trans.date}
                  {` / `}
                  {trans.time}
                </ThemedText>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 10,
                }}
              >
                <ThemedText type="h5">{trans.description}</ThemedText>
                <ThemedText type="h5">LKR {trans.amount}</ThemedText>
              </View>
            </View>
          ))
        ) : (
          <View style={{ flex: 1, alignItems: "center", marginTop: 250 }}>
            <ThemedText type="h5" lightColor="#777" darkColor="#ddd">
              No transactions found
            </ThemedText>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainBody: {
    padding: 10,
    flex: 1,
    position: "relative",
  },
  flatList: {
    margin: 10,
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  searchResult: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#aaa4",
  },
});
