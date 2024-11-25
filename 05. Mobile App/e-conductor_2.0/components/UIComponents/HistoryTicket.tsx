import { View, Text, Pressable, useColorScheme } from "react-native";
import { useState } from "react";
import {
  faExclamationCircle,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useAppContext } from "../../context/AppContext";
import { ThemedText } from "../CommonModules/ThemedText";
import RatingModal from "../../app/modals/ratingModal";
import ReportModal from "../../app/modals/reportModal";

type Ticket = {
  id: string;
  date: string;
  from: string;
  to: string;
  status: string;
  amount: string;
};

type Props = {
  ticket: Ticket;
};

export const HistoryTicket = ({ ticket }: Props) => {
  const { baseURL } = useAppContext();
  const [displayFullTicket, setDisplayFullTicket] = useState(false);
  const [displayTicketCancel, setDisplayTicketCancel] = useState(false);
  const theme = useColorScheme() ?? "light";
  const iconColor = theme === "dark" ? "#ccc" : "#777";
  const iconSize = 20;
  const iconTitleSize = 10;
  const [displayRatingModal, setDisplayRatingModal] = useState(false);
  const [displayReportModdal, setDisplayReportModal] = useState(false);

  return (
    <View
      key={ticket.id}
      style={{
        marginBottom: 15,
        marginHorizontal: 20,
        borderRadius: 10,
        backgroundColor: theme === "dark" ? "#555" : "#fff",
        elevation: 5,
      }}
    >
      <View
        style={{
          backgroundColor: "#FBCA77",
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          paddingVertical: 5,
          paddingHorizontal: 10,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderRadius: 20,
          }}
        >
          <ThemedText type="h6" lightColor="#B97008" darkColor="#B97008">
            {ticket.status}
          </ThemedText>
        </View>

        <View>
          <ThemedText type="h6" lightColor="#B97008" darkColor="#B97008">
            Reference No: {ticket.id}
          </ThemedText>
          <ThemedText type="h6" lightColor="#B97008" darkColor="#B97008">
            Booked on: {ticket.date}
          </ThemedText>
        </View>
      </View>

      <View
        style={{
          paddingHorizontal: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: 10,
        }}
      >
        <View>
          <ThemedText type="h6">Origin</ThemedText>

          <ThemedText type="h4">
            {ticket.from?.split(",")[0]?.trim()}
          </ThemedText>
        </View>
        <View>
          <ThemedText type="h6">Destination</ThemedText>

          <ThemedText type="h4">{ticket.to?.split(",")[0]?.trim()}</ThemedText>
        </View>
      </View>
      <View
        style={{
          paddingHorizontal: 10,
          marginBottom: 10,
        }}
      >
        <ThemedText type="h4">Price: LKR {ticket.amount}</ThemedText>
      </View>

      <View
        style={{
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          flexDirection: "row",
          justifyContent: "space-evenly",
          backgroundColor: theme === "dark" ? "#444" : "#eeec",
        }}
      >
        <Pressable
          style={{
            padding: 5,
            alignItems: "center",
          }}
          onPress={() => setDisplayRatingModal(true)}
        >
          <FontAwesomeIcon
            icon={faThumbsUp}
            size={iconSize}
            color={iconColor}
          />
          <Text
            style={{
              fontSize: iconTitleSize,
              color: iconColor,
            }}
          >
            Feedback
          </Text>
        </Pressable>

        <Pressable
          style={{
            padding: 5,
            alignItems: "center",
          }}
          onPress={() => setDisplayReportModal(true)}
        >
          <FontAwesomeIcon
            icon={faExclamationCircle}
            size={iconSize}
            color={iconColor}
          />
          <Text style={{ fontSize: iconTitleSize, color: iconColor }}>
            Report
          </Text>
        </Pressable>
      </View>
      <RatingModal
        isVisible={displayRatingModal}
        onClose={() => setDisplayRatingModal(false)}
        refNo={ticket.id}
      />
      <ReportModal
        isVisible={displayReportModdal}
        onClose={() => setDisplayReportModal(false)}
        refNo={ticket.id}
      />
    </View>
  );
};
