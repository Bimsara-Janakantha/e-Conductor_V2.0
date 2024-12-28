import { useEffect, useState } from "react";
import axios from "axios";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";

import { useAppContext } from "../../../context/AppContext";
import { ThemedText } from "../../../components/CommonModules/ThemedText";
import { Ticket } from "../../../controller/Ticket";
import { AvailableTicket } from "../../../components/UIComponents/AvailableTicket";
import StringToDate from "../../../components/CommonModules/StringToDateTime";
import ErrorScreen from "../../../components/CommonScreens/ErrorScreen";
import LoadingScreen from "../../../components/CommonScreens/LoadingScreen";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { ThemedView } from "../../../components/CommonModules/ThemedView";
import { TodayTicket } from "../../../components/UIComponents/TodayTicket";
import { AccountDeatils } from "../../../components/UIComponents/AccountDetails";

/**
 * Represents the structure of ticket
 */
type AvailableTicket = {
  refNo: string;
  date: string;
  from: string;
  to: string;
  departure: string;
  fromT: string;
  toT: string;
  seats: string;
  full: string;
  half: string;
  price: string;
  regNo: string;
  org: string;
  service: string;
  route: string;
  tracking: boolean;
  cancel: boolean;
};

/**
 * Dashboard component for bus passengers.
 * This component provides an overview of today's tickets, available tickets,
 * and ticket details for user. It interacts with the backend to fetch available
 * tickets and their details, and displays them in a user-friendly manner.
 */
export default function Dashboard() {
  const { baseURL, myTickets, setMyTickets, id } = useAppContext(); // Accessing global context values for baseURL, myTickets, and user ID.
  const theme = useColorScheme() ?? "light"; // Detecting the current theme (light or dark mode) for UI customization.
  const today = new Date().toLocaleDateString("en-CA"); // Getting today's date in "YYYY-MM-DD" format for date comparison.
  const [loading, setLoading] = useState(true); // Loading state for data fetching.
  const [error, setError] = useState<string>(""); // Error state to handle backend errors.
  const [todayTickets, setTodayTickets] = useState<
    Map<string, Ticket> | undefined
  >(); // State to hold today's tickets.

  //================================================ Functions ===============================================//

  /**
   * Checks if a given date is today's date.
   *
   * @param date - The date to check.
   * @returns {boolean} - Returns true if the date is today, otherwise false.
   */
  function isToday(date: Date | undefined): boolean {
    return date?.toISOString().split("T")[0] === today;
  }

  //================================================ Backend Calls ===============================================//

  /**
   * Fetches available tickets for the logged-in user.
   * Makes a POST request to the backend to retrieve tickets.
   * If successful, it fetches detailed information for each available ticket.
   */
  const fetchAvailableTickets = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`${baseURL}/tickets/tkt4`, {
        data: id,
      });

      if (response.status === 200) {
        const fetchedTickets: AvailableTicket[] = response.data;
        console.log(fetchedTickets);
        await fetchTicketDetailsForAll(fetchedTickets);
      } else {
        Alert.alert("Error", "Failed to fetch tickets");
      }
    } catch (error) {
      console.error(error);
      setError(String(error));
      Alert.alert("Error", "An error occurred while fetching tickets");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetches detailed ticket information for each available ticket.
   *
   * @param tickets - Array of available tickets to fetch details for.
   */
  const fetchTicketDetailsForAll = async (tickets: AvailableTicket[]) => {
    const updatedTickets = new Map(myTickets);
    const fetchPromises = tickets.map(async (availableTicket) => {
      const { refNo, org, fromT, toT, tracking, cancel } = availableTicket;
      try {
        const response = await axios.get(`${baseURL}/tickets/tkt2`, {
          params: { refNo },
        });
        const ticket = new Ticket(
          response.data.ticketNo,
          StringToDate(response.data.issuedDate, response.data.issuedTime),
          response.data.vehicleNo,
          org,
          response.data.type,
          response.data.routeNo,
          response.data.route,
          StringToDate(response.data.date, response.data.time),
          response.data.from,
          response.data.to,
          fromT,
          toT,
          response.data.distance,
          response.data.price,
          response.data.discount,
          response.data.unitPrice,
          response.data.transID,
          response.data.full,
          response.data.half,
          response.data.seatNos,
          response.data.status,
          tracking,
          cancel
        );
        updatedTickets.set(refNo, ticket);
      } catch (err) {
        console.error("Error fetching ticket details:", err);
        setError(String(error));
        Alert.alert(
          "Error",
          "An error occurred while fetching ticket details for " +
            availableTicket.refNo
        );
      } finally {
        setLoading(false);
      }
    });

    await Promise.all(fetchPromises);
    setMyTickets(updatedTickets);
  };

  //================================================ Use Effects ===============================================//

  // Fetch tickets on component mount
  useEffect(() => {
    fetchAvailableTickets();
  }, []);

  // Filter tickets for today's date
  useEffect(() => {
    if (!loading && myTickets) {
      const ticketsForToday = new Map(
        Array.from(myTickets.entries()).filter(([, ticket]) =>
          isToday(ticket.departure)
        )
      );
      setTodayTickets(ticketsForToday);
    }
  }, [myTickets]);

  //================================================ UI Control ===============================================//

  if (loading) {
    return <LoadingScreen />;
  }

  if (error !== "" && !loading) {
    return <ErrorScreen error={error} retry={fetchAvailableTickets} />;
  }

  return (
    <ThemedView style={styles.mainBody}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: "transparent" }}
      >
        <AccountDeatils showRecharge={true} />
        <ThemedText type={"h4"} style={styles.title}>
          Today's Tickets
        </ThemedText>
        <View style={{ padding: 12 }}>
          {loading ? (
            <View style={{ marginTop: 50, alignItems: "center" }}>
              <ActivityIndicator
                size={70}
                color={theme === "dark" ? "#ddd" : "#777"}
              />
            </View>
          ) : todayTickets && todayTickets.size != 0 ? (
            <ScrollView
              horizontal={true}
              showsVerticalScrollIndicator={false}
              style={{ backgroundColor: "transparent" }}
            >
              {Array.from(todayTickets.entries()).map(([ticketNo, ticket]) => (
                <TodayTicket key={ticketNo} ticket={ticket} />
              ))}
            </ScrollView>
          ) : (
            <ThemedText
              type="s5"
              lightColor={"#777"}
              style={{ alignSelf: "center", marginVertical: 50 }}
            >
              No tickets are scheduled today
            </ThemedText>
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <ThemedText type={"h4"} style={styles.title}>
            Available Tickets
          </ThemedText>
          <Pressable
            style={{
              backgroundColor: theme === "dark" ? "#555" : "#fff",
              alignSelf: "flex-end",
              alignItems: "center",
              paddingVertical: 10,
              paddingHorizontal: 10,
              marginHorizontal: 20,
              borderRadius: 50,
              elevation: 5,
            }}
            onPress={fetchAvailableTickets}
          >
            <FontAwesomeIcon
              icon={faArrowsRotate}
              size={20}
              color={theme === "dark" ? "#ccc" : "#444"}
            />
          </Pressable>
        </View>

        <View style={{ padding: 12 }}>
          {loading ? (
            <View style={{ marginTop: 200, alignItems: "center" }}>
              <ActivityIndicator
                size={70}
                color={theme === "dark" ? "#ddd" : "#777"}
              />
            </View>
          ) : myTickets && myTickets.size != 0 ? (
            Array.from(myTickets.entries()).map(([ticketNo, ticket]) => (
              <AvailableTicket key={ticketNo} ticket={ticket} />
            ))
          ) : (
            <ThemedText
              type="s5"
              lightColor={"#777"}
              style={{ alignSelf: "center", marginVertical: 70 }}
            >
              No tickets are available
            </ThemedText>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
  },
  cardBody: {
    borderWidth: 0,
    borderRadius: 10,
    marginHorizontal: 10,
    elevation: 3,
  },
  title: {
    marginTop: 10,
    marginBottom: 5,
    marginHorizontal: 20,
    backgroundColor: "transparent",
  },
  drawerHeader: {
    flexDirection: "row",
    backgroundColor: "transparent",
    gap: 10,
  },
  logo: {
    height: 60,
    width: 60,
    borderRadius: 15,
  },
  profileImage: {
    height: 40,
    width: 40,
    borderRadius: 60,
  },
});
