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
import { LineGraph } from "@/components/UIComponents/LineGraph";

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

  const bus1 = [
    {
      value: 21600,
      date: "11 Apr 2022",
      label: "11 Apr",
    },
    {
      value: 29500,
      date: "12 Apr 2022",
      label: "12 Apr",
    },
    {
      value: 10950,
      date: "13 Apr 2022",
      label: "13 Apr",
    },
    {
      value: 10700,
      date: "14 Apr 2022",
      label: "14 Apr",
    },
    {
      value: 9900,
      date: "15 Apr 2022",
      label: "15 Apr",
    },
    {
      value: 26300,
      date: "16 Apr 2022",
      label: "16 Apr",
    },
  ];

  const bus2 = [
    {
      value: 21600,
      date: "11 Apr 2022",
      label: "11 Apr",
    },
    {
      value: 29500,
      date: "12 Apr 2022",
      label: "12 Apr",
    },
    {
      value: 10950,
      date: "13 Apr 2022",
      label: "13 Apr",
    },
    {
      value: 30700,
      date: "14 Apr 2022",
      label: "14 Apr",
    },
    {
      value: 39900,
      date: "15 Apr 2022",
      label: "15 Apr",
    },
    {
      value: 26300,
      date: "16 Apr 2022",
      label: "16 Apr",
    },
  ];
  const bus3 = [
    {
      value: 31600,
      date: "11 Apr 2022",
      label: "11 Apr",
    },
    {
      value: 29500,
      date: "12 Apr 2022",
      label: "12 Apr",
    },
    {
      value: 10950,
      date: "13 Apr 2022",
      label: "13 Apr",
    },
    {
      value: 10700,
      date: "14 Apr 2022",
      label: "14 Apr",
    },
    {
      value: 19900,
      date: "15 Apr 2022",
      label: "15 Apr",
    },
    {
      value: 16300,
      date: "16 Apr 2022",
      label: "16 Apr",
    },
  ];
  const bus4 = [
    {
      value: 21600,
      date: "11 Apr 2022",
      label: "11 Apr",
    },
    {
      value: 49500,
      date: "12 Apr 2022",
      label: "12 Apr",
    },
    {
      value: 30950,
      date: "13 Apr 2022",
      label: "13 Apr",
    },
    {
      value: 30700,
      date: "14 Apr 2022",
      label: "14 Apr",
    },
    {
      value: 39900,
      date: "15 Apr 2022",
      label: "15 Apr",
    },
    {
      value: 36300,
      date: "16 Apr 2022",
      label: "16 Apr",
    },
  ];

  return (
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
            lightColor={"#000"}
            darkColor={"#fff"}
            style={{ marginLeft: 5 }}
          >
            Rs. {credits}
          </ThemedText>
          <Pressable
            style={[
              styles.rechargeButton,
              {
                borderColor: "#000",
                borderWidth: 2,
              },
            ]}
            onPress={() => router.replace("/index" as Href<string>)}
          >
            <ThemedText type="h6" lightColor={"#000"} darkColor={"#fff"}>
              Recharge
            </ThemedText>
          </Pressable>
        </View>

        <ScrollView>
          <View style={{ marginVertical: 20 }}>
          <ThemedText
            type="h4"
            style={{ marginTop: 25, marginBottom: 10, marginHorizontal: 5 }}
          >
            NA-35678
          </ThemedText>
          <LineGraph
            input={bus1}
            lineColorDark="#0f8"
            lineColorLight="#0d8"
            startColorDark="#0f8"
            startColorLight="#0d8"
            endColorDark="#0f8"
            endColorLight="#0d8"
            xSpacing={55}
            xLabelWidth={90}
            yLabelWidth={45}
          />
        </View>
        <View style={{ marginVertical: 20 }}>
          <ThemedText
            type="h4"
            style={{ marginTop: 25, marginBottom: 10, marginHorizontal: 5 }}
          >
            NA-35678
          </ThemedText>
          <LineGraph
            input={bus2}
            lineColorDark="#0f8"
            lineColorLight="#0d8"
            startColorDark="#0f8"
            startColorLight="#0d8"
            endColorDark="#0f8"
            endColorLight="#0d8"
            xSpacing={55}
            xLabelWidth={90}
            yLabelWidth={45}
          />
        </View><View style={{ marginVertical: 20 }}>
          <ThemedText
            type="h4"
            style={{ marginTop: 25, marginBottom: 10, marginHorizontal: 5 }}
          >
            NA-35678
          </ThemedText>
          <LineGraph
            input={bus3}
            lineColorDark="#0f8"
            lineColorLight="#0d8"
            startColorDark="#0f8"
            startColorLight="#0d8"
            endColorDark="#0f8"
            endColorLight="#0d8"
            xSpacing={55}
            xLabelWidth={90}
            yLabelWidth={45}
          />
        </View><View style={{ marginVertical: 20 }}>
          <ThemedText
            type="h4"
            style={{ marginTop: 25, marginBottom: 10, marginHorizontal: 5 }}
          >
            NA-35678
          </ThemedText>
          <LineGraph
            input={bus4}
            lineColorDark="#0f8"
            lineColorLight="#0d8"
            startColorDark="#0f8"
            startColorLight="#0d8"
            endColorDark="#0f8"
            endColorLight="#0d8"
            xSpacing={55}
            xLabelWidth={90}
            yLabelWidth={45}
          />
        </View>
        </ScrollView>
      </View>
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
