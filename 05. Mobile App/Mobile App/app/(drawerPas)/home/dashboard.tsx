import { ThemedText } from "@/components/CommonModules/ThemedText";
import { ThemedView } from "@/components/CommonModules/ThemedView";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faUser,
  faArrowRight,
  faChevronRight,
  faC,
} from "@fortawesome/free-solid-svg-icons";
import { Href, router } from "expo-router";
import {
  Button,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { Ticket } from "@/controller/Ticket";
import { TicketView } from "@/components/UIComponents/TicketView";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useAppContext } from "@/context/AppContext";
import { requestPermissions } from "@/components/LocationUpdate";
import { useState } from "react";
import * as Location from "expo-location";
import BusList from "@/components/BusList";
import axios from "axios";

var ticketsAvailable = true;

interface user {
  userType: string;
  empType: string;
  fName: string;
  lName: string;
  email: string;
  mobile: string;
  nic: string;
  birthDay: string;
  ntc: string;
  licence: string;
  accName: string;
  accNo: string;
  bank: string;
  branch: string;
}

export default function Dashboard() {
  const addUser = async (userData: user) => {
    try {
      const response = await axios.post(`${baseURL}/mobileAPI/user/users`, {
        type: "Req3", // Specify the request type for adding a user
        data: userData, // This should include all necessary user details
      });
      console.log(response.data); // Should return "success" or "error"
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  // Example user data for an employee
  const newUser = {
    userType: "employee", // or "passenger" or "owner"
    empType: "staff", // Relevant for employee and owner
    fName: "Jane",
    lName: "Doe",
    email: "e20035@eng.pdn.ac.lk",
    mobile: "0767601948",
    nic: "NIC123456",
    birthDay: "1990-01-01",
    ntc: "NTC123456",
    licence: "LIC123456",
    accName: "Jane Doe",
    accNo: "123456789",
    bank: "Some Bank",
    branch: "Main Branch",
  };

  const getUserInfo = async (phoneNumber: string) => {
    try {
      const response = await axios.post(
        `${baseURL}/mobileAPI/user/users/info`,
        {
          type: "Req1", // Specify the request type for fetching user info
          data: phoneNumber, // Phone number to search for
        }
      );

      if (response.data.error) {
        console.error("Error fetching user info:", response.data.error);
      } else {
        console.log("User info retrieved successfully:", response.data);
        // Handle the retrieved user data here
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  interface VerifyOTPResponse {
    error?: string;
    success?: string;
    verified?: boolean;
  }

  // Example user phone number
  const phoneNumber = "94703406796";

  // Example user data

  const { baseURL, credits, myTickets } = useAppContext();
  const theme = useColorScheme() ?? "light";

  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  // const handleStartTracking = () => {
  //   requestPermissions();
  // };

  return (
    <ScreenWrapper>
      <View style={styles.mainBody}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: 20,
            paddingVertical: 3,
            paddingHorizontal: 5,
            marginHorizontal: "10%",
          }}
        >
          <ThemedText
            type={"h4"}
            lightColor={"#fff"}
            darkColor={"#fff"}
            style={{ marginLeft: 5 }}
          >
            Rs. {credits}
          </ThemedText>
          <Pressable
            style={[
              styles.rechargeButton,
              {
                borderColor: "#fff",
                borderWidth: 2,
              },
            ]}
            onPress={() => router.replace("/index" as Href<string>)}
          >
            <ThemedText type="h6" lightColor={"#fff"} darkColor={"#fff"}>
              Recharge
            </ThemedText>
          </Pressable>
        </View>

        <ThemedText
          type={"h4"}
          style={styles.cardHeader}
          lightColor="#fff"
          darkColor="#fff"
        >
          Available Tickets
        </ThemedText>

        <ScrollView>
          {[...myTickets.values()].map((ticket) => (
            <TicketView key={ticket.id} ticket={ticket} />
          ))}
          {myTickets.size == 0 && (
            <View>
              <ThemedText
                type="s5"
                lightColor="#eee"
                style={{ alignSelf: "center", marginBottom: 20 }}
              >
                No tickets are available
              </ThemedText>
              <ThemedText
                type="s5"
                lightColor="#444"
                style={{ alignSelf: "center", marginBottom: 50, textAlign: 'justify' }}
              >
                To purchase tickets go to Tickets tab
              </ThemedText>
            </View>
          )}
          <Pressable
            style={{
              backgroundColor: "#a8f",
              borderWidth: 0,
              borderRadius: 10,
              marginHorizontal: 10,
              padding: 10,
              marginTop: 10,
            }}
            onPress={() =>
              router.navigate("/modals/quickTicketModal" as Href<string>)
            }
          >
            <ThemedText
              type={"s5"}
              style={{ textAlign: "center" }}
              lightColor="#fff"
              darkColor="#fff"
            >
              Quick ticket
            </ThemedText>
          </Pressable>
          {/* <BusList /> */}
          {/* <Pressable
            style={styles.rechargeButton}
            //onPress={() => getUserInfo(phoneNumber)}
            onPress={() => addUser(newUser)}
          >
            <ThemedText>add new entry</ThemedText>
          </Pressable> */}
          {/* <View>
            <Button title="Start Tracking" onPress={handleStartTracking} />
          </View> */}
          {/* <View>
            <Button title="Start Tracking" onPress={handleStartTracking} />
            {location && (
              <Text>
                Latitude: {location.coords.latitude}, Longitude:{" "}
                {location.coords.longitude}
              </Text>
            )}
          </View> */}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  mainBody: {
    padding: 10,
    flex: 1,
  },
  flatList: {
    margin: 10,
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  rechargeButton: {
    alignItems: "center",
    backgroundColor: "#fff2",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 20,
  },
  cardBody: {
    borderWidth: 0,
    borderRadius: 10,
    marginHorizontal: 10,
    elevation: 3,
  },
  cardHeader: {
    marginTop: 15,
    marginBottom: 5,
    marginHorizontal: 15,
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
});
