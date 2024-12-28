import { View, Text, useColorScheme } from "react-native";
import {
  faCircleInfo,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { ThemedText } from "../CommonModules/ThemedText";
import { Ticket } from "../../controller/Ticket";
import { ThemedView } from "../CommonModules/ThemedView";

type Props = {
  ticket: Ticket;
};

interface RefundData {
  refNo: string;
  billingDate: string;
  billingTime: string;
  cancelDate: string;
  cancelTime: string;
  duration: string;
  amount: string;
  refund: string;
}

export const TodayTicket = ({ ticket }: Props) => {
  const theme = useColorScheme() ?? "light";

  return (
    <ThemedView
      style={{
        marginHorizontal: 5,
        marginBottom: 15,
        borderRadius: 10,
        backgroundColor: theme === "dark" ? "#555" : "#ffffff",
        elevation: 5,
      }}
    >
      <View
        style={{
          backgroundColor: theme == "dark" ? "#876BFF" : "#DDD5FF",
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          paddingVertical: 5,
          paddingHorizontal: 10,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <FontAwesomeIcon
          icon={faClock}
          size={20}
          color={theme === "dark" ? "#D5CEF4" : "#876BFF"}
        />
        <ThemedText type="h6" lightColor="#876BFF" darkColor="#E9E5FD">
          {ticket.fromT}
        </ThemedText>
      </View>
      <View
        style={{
          paddingHorizontal: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 20,
          marginTop: 10,
        }}
      >
        <View>
          <ThemedText type="s7" lightColor="#aaa">
            Origin
          </ThemedText>
          <ThemedText type="h6">
            {ticket.from?.split(",")[0]?.trim()}
          </ThemedText>
        </View>
        <View>
          <ThemedText type="s7" lightColor="#aaa">
            Destination
          </ThemedText>
          <ThemedText type="h6">{ticket.to?.split(",")[0]?.trim()}</ThemedText>
        </View>
      </View>
      <View style={{ marginHorizontal: 10, marginVertical: 10 }}>
        {ticket.seatNos == undefined || ticket.seatNos.length == 0 ? (
          <ThemedText type="h6">Quick Ticket</ThemedText>
        ) : (
          <ThemedText type="h6">
            Seat No(s): {ticket.seatNos.join(", ")}
          </ThemedText>
        )}
      </View>
      {ticket.tracking && (
        <View
          style={{
            marginBottom: 10,
            flexDirection: "row",
            justifyContent: "center",
            gap: 5,
            alignItems: "center",
          }}
        >
          <FontAwesomeIcon
            icon={faCircleInfo}
            size={14}
            color={theme === "dark" ? "#02D47F" : "#07C075"}
          />
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 13,
              color: theme === "dark" ? "#02D47F" : "#07C075",
            }}
          >
            Tracking available
          </Text>
        </View>
      )}
    </ThemedView>
  );
};
