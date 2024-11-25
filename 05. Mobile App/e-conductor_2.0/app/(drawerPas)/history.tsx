import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Alert,
  useColorScheme,
  Pressable,
} from "react-native";
import axios from "axios";

import { useAppContext } from "../../context/AppContext";
import { ThemedText } from "../../components/CommonModules/ThemedText";
import ErrorScreen from "../../components/CommonScreens/ErrorScreen";
import LoadingScreen from "../../components/CommonScreens/LoadingScreen";
import {
  faTrash,
  faMapLocationDot,
  faEye,
  faExclamationCircle,
  faThumbsUp,
  faArrowsRotate,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import RatingModal from "../modals/ratingModal";
import ReportModal from "../modals/reportModal";
import { ThemedView } from "../../components/CommonModules/ThemedView";
import { HistoryTicket } from "../../components/UIComponents/HistoryTicket";

/**
 * Represents the structure of ticket data
 */
type Ticket = {
  id: string;
  date: string;
  from: string;
  to: string;
  status: string;
  amount: string;
};

/**
 * History component that displays a user's ticket history.
 * It fetches ticket data from the backend and displays it in a scrollable list.
 * Users can also refresh the ticket data by pressing a refresh button.
 */
export default function History() {
  const { baseURL, id } = useAppContext(); // Extracting global context values (baseURL and user ID)
  const theme = useColorScheme() ?? "light"; // Detects the current theme (light or dark mode)
  const [tickets, setTickets] = useState<Ticket[]>([]); // State to store the fetched tickets
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState<string>(""); // State to store error messages

  //================================================ Backend Calls ===============================================//

  /**
   * Fetches the ticket history for the user from the backend.
   * This function makes a POST request to the backend to retrieve ticket data.
   * On success, it updates the tickets state with the fetched data. On failure, it sets an error message.
   */
  const fetchTicketHistory = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`${baseURL}/tickets/tkt1`, {
        data: id,
      });
      console.log(response);
      setTickets(response.data.tickets);
    } catch (error) {
      console.error("Error fetching ticket history:", error);
      setError(String(error));
      Alert.alert("Error", "Failed to fetch ticket history");
    } finally {
      setLoading(false);
    }
  };

  //================================================ Use Effects ===============================================//

  /**
   * Effect that runs when the component mounts.
   * It triggers the fetchTicketHistory function to retrieve the user's ticket data.
   */
  useEffect(() => {
    fetchTicketHistory();
  }, []);

  //================================================ UI Control ===============================================//

  if (loading) {
    return <LoadingScreen />;
  }

  if (error !== "" && !loading) {
    return <ErrorScreen error={error} retry={fetchTicketHistory} />;
  }

  return (
    <ThemedView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor: "transparent",
        }}
      >
        <Pressable
          style={{
            backgroundColor: theme === "dark" ? "#555" : "#fff",
            alignSelf: "flex-end",
            alignItems: "center",
            paddingVertical: 10,
            paddingHorizontal: 10,
            marginHorizontal: 20,
            marginBottom: 10,
            borderRadius: 50,
            elevation: 5,
          }}
          onPress={fetchTicketHistory}
        >
          <FontAwesomeIcon
            icon={faArrowsRotate}
            size={20}
            color={theme === "dark" ? "#ccc" : "#444"}
          />
        </Pressable>
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <HistoryTicket key={ticket.id} ticket={ticket} />
          ))
        ) : (
          <View style={{ flex: 1, alignItems: "center", marginTop: 250 }}>
            <ThemedText type="h5" lightColor="#777" darkColor="#ddd">
              No tickets found
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}
