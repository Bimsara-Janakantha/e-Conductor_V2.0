import { useEffect, useRef, useState } from "react";
import React from "react";
import * as FileSystem from "expo-file-system";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  TextInput,
  View,
  Text,
  Pressable,
  useColorScheme,
} from "react-native";
import {
  faLocationDot,
  faLocationCrosshairs,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import axios from "axios";

import { useAppContext } from "../../../context/AppContext";
import { ThemedText } from "../../../components/CommonModules/ThemedText";
import {
  DateTimeInputSquare,
  BusStopSearchInput,
} from "../../../components/FormComponents/FormInputField";
import { DateToString } from "../../../components/CommonModules/DateTimeToString";
import ErrorScreen from "../../../components/CommonScreens/ErrorScreen";
import { ThemedView } from "../../../components/CommonModules/ThemedView";
import { BusSchedule } from "../../../components/UIComponents/BusSchedule";
import QuickTicketModal from "../../modals/messages/quickTicketModal";
import SeatsModal from "../../modals/seatsModal";

/**
 * Represents the structure of schedule
 */
export type Schedule = {
  id: string;
  from: string;
  to: string;
  regNo: string;
  service: string;
  routeType: string;
  routeNo: string;
  org: string;
  booked: string;
  seats: number;
  closing: string;
  departure: string;
  arrival: string;
  journey: string;
  price: string;
};

/**
 * Represents the structure of busstop
 */
interface BusStop {
  id: number;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
}

/**
 * Represents the structure of busstop id
 */
type BusStopIDs = {
  fromID: string;
  toID: string;
};

/**
 * Tickets component provides users the ability to search for bus schedules, view available seats,
 * and book tickets. If the current time is within 24 hours of departure, seat booking is allowed,
 * otherwise, users can only purchase a Quick Ticket.
 */

export default function Tickets() {
  const { baseURL, discount } = useAppContext(); // Retrieve baseURL and discount from context
  const theme = useColorScheme() ?? "light"; // Detect current theme (light/dark)
  const folderUri = FileSystem.documentDirectory + "docs"; // Path to save JSON file
  const fileUri = folderUri + "/busStops.json"; // Path to save bus stop data
  const today = new Date().toLocaleDateString("en-CA"); // Get today's date in ISO format
  const [displaySeatsModel, setDisplaySeatsModel] = useState(false); // State to manage seat selection modal
  const [from, setFrom] = useState(""); // State to manage 'from' input value
  const [to, setTo] = useState(""); // State to manage 'to' input value
  const [date, setDate] = useState(new Date()); // State to manage selected date
  const [openDate, setOpenDate] = useState(false); // State to manage date picker visibility
  const [schedules, setSchedules] = useState<Schedule[]>([]); // State to hold fetched bus schedules
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule>(); // State to hold selected schedule
  const [busStops, setBusStops] = useState<BusStop[]>([]); // State to hold bus stops data
  const [seats, setSeats] = useState(54); // Default seat count
  const [loading, setLoading] = useState<boolean>(true); // State to manage loading state
  const [error, setError] = useState<string>(""); // State to manage error messages
  const [displayQTModal, setDisplayQTModal] = useState(false); // State to manage Quick Ticket modal visibility
  const [busStopIDs, setBusStopIDs] = useState<BusStopIDs>({
    fromID: "",
    toID: "",
  }); // State to store bus stop IDs for the selected 'from' and 'to'
  const inputRefs = useRef(
    Array.from({ length: 2 }, () => React.createRef<TextInput>())
  ); // Refs for handling input fields

  //================================================ Functions ===============================================//

  /**
   * Finds the bus stop IDs for the selected 'from' and 'to' bus stop names.
   * Retrieves data from a locally stored JSON file.
   */
  const findBusStopID = async (from: string, to: string) => {
    try {
      const fileContent = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      const parsedData = JSON.parse(fileContent);

      // Find the bus stop with the matching 'from' name
      const fromBusStop = parsedData.find(
        (stop: any) => stop.name.toLowerCase() === from.toLowerCase()
      );

      // Find the bus stop with the matching 'to' name
      const toBusStop = parsedData.find(
        (stop: any) => stop.name.toLowerCase() === to.toLowerCase()
      );

      if (fromBusStop && toBusStop) {
        console.log(
          `From Bus Stop ID: ${fromBusStop.id}, To Bus Stop ID: ${toBusStop.id}`
        );
        setBusStopIDs({ fromID: fromBusStop.id, toID: toBusStop.id });
      } else {
        console.error("Bus stop(s) not found");
        setBusStopIDs({ fromID: "", toID: "" });
      }
    } catch (error) {
      console.error("Failed to load bus stops: ", error);
      setBusStopIDs({ fromID: "", toID: "" });
    }
  };

  /**
   * Saves the current bus stop data as a JSON file to local storage.
   * Ensures that the necessary directories are created before saving the file.
   */
  const saveToFile = async () => {
    try {
      // Check if the 'docs' folder exists, if not, create it
      const folderInfo = await FileSystem.getInfoAsync(folderUri);
      if (!folderInfo.exists) {
        await FileSystem.makeDirectoryAsync(folderUri, { intermediates: true });
        console.log("Docs folder created");
      }

      // Convert bus stop data to JSON string
      const jsonString = JSON.stringify(busStops, null, 2);

      // Write the JSON string to a file inside the 'docs' folder
      await FileSystem.writeAsStringAsync(fileUri, jsonString, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      console.log(`File saved successfully at: ${fileUri}`);
    } catch (error) {
      Alert.alert("Error", "Failed to save file.");
      console.error("Error writing file: ", error);
    }
  };

  /**
   * Handles the search process when user clicks on 'Search' button.
   * Validates inputs for 'from', 'to', and 'date', and triggers schedule fetching if valid.
   */
  const handleSearch = () => {
    if (!from || !to || !date) {
      Alert.alert(
        "Error",
        "Please choose 'from' and 'to' locations and the date."
      );
      return;
    } else {
      console.log(from, to, date);
      fetchSchedules();
    }
  };


  //================================================ Backend Calls ===============================================//

  /**
   * Fetches bus schedules based on user input (from, to, date).
   * Sends a POST request to the backend to retrieve matching schedules.
   */
  const fetchSchedules = async () => {
    setLoading(true);
    setError("");

    try {
      await findBusStopID(from, to);

      const localDate = date.toLocaleDateString("en-CA");

      const response = await axios.post(`${baseURL}/schedule/sdl1`, {
        data: {
          from: busStopIDs?.fromID,
          to: busStopIDs?.toID,
          date: localDate,
        },
      });

      setSchedules(response.data);
    } catch (error) {
      console.error("Error fetching bus schedules:", error);
      setError(String(error));
      Alert.alert("Error", "Failed to fetch bus schedule data");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetches bus stop names from the backend.
   * Populates the list of available bus stops to choose from.
   */
  const fetchBusStops = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`${baseURL}/busstops/names`);
      setBusStops(response.data);
    } catch (err) {
      console.error("Error fetching bus stops:", error);
      setError(String(error));
      Alert.alert("Error", "Failed to fetch bus stop data");
    } finally {
      setLoading(false);
    }
  };

  //================================================ Use Effects ===============================================//

  // Save the busStops in a file when busStops updates
  useEffect(() => {
    if (busStops.length > 0) {
      saveToFile();
    }
  }, [busStops]);

  // Fetch the bus stop names on component mount
  useEffect(() => {
    if (busStops.length == 0) {
      fetchBusStops();
    }
  }, []);

  //================================================ UI Control ===============================================//

  if (error !== "" && !loading) {
    return <ErrorScreen error={error} retry={fetchBusStops} />;
  }

  return (
    <ThemedView style={styles.mainBody}>
      <BusStopSearchInput
        ref={inputRefs.current[0]}
        nextFocus={inputRefs.current[1]}
        input={from}
        setInput={setFrom}
        placeholder="From"
        iconName={faLocationCrosshairs}
        layer={3}
      />

      <BusStopSearchInput
        ref={inputRefs.current[1]}
        input={to}
        setInput={setTo}
        placeholder="To"
        iconName={faLocationDot}
        layer={2}
      />

      <View style={{ backgroundColor: "transparent" }}>
        <DateTimeInputSquare
          input={date}
          setInput={setDate}
          iconName={faCalendarDays}
          placeholder={"Date"}
          type={"Date"}
          setOpenPicker={setOpenDate}
        />

        {openDate && (
          <DateTimePicker
            value={date}
            mode="date"
            display="spinner"
            onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
              if (event.type === "set" && selectedDate) {
                setDate(selectedDate);
                console.log(selectedDate.toLocaleString()); // Converts to local string
              }
              setOpenDate(false);
            }}
          />
        )}
      </View>

      {/********************************************* Search Result ****************************************************/}

      <Pressable
        onPress={handleSearch}
        style={{
          backgroundColor: "#38A0DA",
          alignItems: "center",
          borderRadius: 10,
          paddingVertical: 10,
          marginTop: 7,
          marginBottom: 20,
          marginHorizontal: 4,
        }}
      >
        <ThemedText type="h5" lightColor="#fff">
          Search
        </ThemedText>
      </Pressable>

      {loading ? (
        <View style={{ marginTop: 200, alignItems: "center" }}>
          <ActivityIndicator
            size={70}
            color={theme === "dark" ? "#ddd" : "#777"}
          />
        </View>
      ) : (
        <FlatList
          data={schedules}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <BusSchedule
              schedule={item}
              today={today}
              setDisplaySeatsModel={setDisplaySeatsModel}
              setDisplayQTModal={setDisplayQTModal}
              setSeats={setSeats}
              setSelectedSchedule={setSelectedSchedule}
            />
          )}
        />
      )}
      {selectedSchedule && (
        <SeatsModal
          isVisible={displaySeatsModel}
          onClose={() => setDisplaySeatsModel(false)}
          scheduleId={selectedSchedule.id}
          seats={seats}
          departureDate={DateToString(date)}
          aproxDepT={selectedSchedule.departure}
          aproxAriT={selectedSchedule.arrival}
          journey={selectedSchedule.journey}
          fromID={busStopIDs.fromID}
          toID={busStopIDs.toID}
          unitPrice={Number(selectedSchedule.price)}
          discount={discount}
        />
      )}
      {selectedSchedule && (
        <QuickTicketModal
          isVisible={displayQTModal}
          onClose={() => setDisplayQTModal(false)}
          scheduleId={selectedSchedule.id}
          departureDate={DateToString(date)}
          aproxDepT={selectedSchedule.departure}
          aproxAriT={selectedSchedule.arrival}
          journey={selectedSchedule.journey}
          fromID={busStopIDs.fromID}
          toID={busStopIDs.toID}
          unitPrice={Number(selectedSchedule.price)}
          discount={discount}
        />
      )}

      {schedules.length == 0 && !loading && (
        <View style={{ alignSelf: "center", marginBottom: 200 }}>
          <ThemedText type="s5" lightColor="#666" darkColor="#ccc">
            No buses are available
          </ThemedText>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainBody: {
    paddingTop: 10,
    paddingHorizontal: 10,
    flex: 1,
    zIndex: 1,
    position: "relative",
  },
  inputDropdown: {
    width: 280,
    color: "#333",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: -10,
    marginBottom: 10,
    backgroundColor: "#fff",
    elevation: 3,
  },
  flatList: {
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  searchResult: {
    marginVertical: 5,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#fc55",
  },
  horizontalLine: {
    flex: 1,
    width: 2,
    height: 40,
    margin: 5,
    borderWidth: 0,
    backgroundColor: "#aaa",
    alignSelf: "center",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemText: {
    fontSize: 18,
    fontWeight: "500",
  },
  itemSubText: {
    fontSize: 14,
    color: "#555",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 18,
  },
  listContainer: {
    marginTop: 20,
    height: 200,
    backgroundColor: "green",
  },
  busStopItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#4565",
    borderRadius: 5,
  },
  busStopText: {
    fontSize: 16,
  },

  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 8,
  },
  scheduleItem: {
    padding: 15,
    backgroundColor: "#f9f9f9",
    marginVertical: 10,
    borderRadius: 5,
  },
  scheduleText: {
    fontSize: 16,
  },
});
