import { View, Text, Pressable, useColorScheme, Alert } from "react-native";
import FullTicket from "./FullTicket";
import { useState } from "react";
import {
  faCircleInfo,
  faEye,
  faMapLocationDot,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useAppContext } from "../../context/AppContext";
import axios from "axios";
import { DateToString, TimeToString } from "../CommonModules/DateTimeToString";
import { ThemedText } from "../CommonModules/ThemedText";
import QRCode from "react-native-qrcode-svg";
import { Ticket } from "../../controller/Ticket";
import { TicketCancelModal } from "../../app/modals/messages/ticketCancel";

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

export const AvailableTicket = ({ ticket }: Props) => {
  const { baseURL } = useAppContext();
  const [displayFullTicket, setDisplayFullTicket] = useState(false);
  const [displayTicketCancel, setDisplayTicketCancel] = useState(false);
  const theme = useColorScheme() ?? "light";
  const iconColor = theme === "dark" ? "#ccc" : "#777";
  const disabledIconColor = theme === "dark" ? "#666" : "#ccc";
  const iconSize = 20;
  const iconTitleSize = 10;
  const [refundData, setRefundData] = useState<RefundData | null>(null);

  const handleRefundRequest = async () => {
    setDisplayTicketCancel(true);
    let cancelDate = DateToString(new Date());
    let cancelTime = TimeToString(new Date());

    try {
      const response = await axios.post(`${baseURL}/tickets/tkt5`, {
        data: {
          refNo: ticket.ticketNo,
          cancelDate,
          cancelTime,
        },
      });
      setRefundData(response.data);
    } catch (err) {
      Alert.alert("Error", "There was an issue processing the refund");
      console.error(err);
    }
  };

  return (
    <View
      style={{
        marginHorizontal: 5,
        marginBottom: 15,
        borderRadius: 10,
        backgroundColor: theme === "dark" ? "#555" : "#fff",
        elevation: 5,
      }}
    >
      <View
        style={{
          backgroundColor: ticket.tracking ? "#62edb5" : "#FBCA77",
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          paddingVertical: 5,
          paddingHorizontal: 10,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <QRCode
          value={`${ticket.vehicalNo}|${TimeToString(ticket.departure)}|${ticket.from?.split(",")[0]?.trim()}|${ticket.to?.split(",")[0]?.trim()}|${ticket.seatNos}|${ticket.full}|${ticket.half}`}
          size={70}
          color={ticket.tracking ? "#227D58" : "#B97008"}
          backgroundColor="transparent"
        />
        <View>
          <ThemedText
            type="h6"
            lightColor={ticket.tracking ? "#227D58" : "#B97008"}
            darkColor={ticket.tracking ? "#227D58" : "#B97008"}
          >
            Reference No: {ticket.ticketNo}
          </ThemedText>
          <ThemedText
            type="h6"
            lightColor={ticket.tracking ? "#227D58" : "#B97008"}
            darkColor={ticket.tracking ? "#227D58" : "#B97008"}
          >
            Departure: {DateToString(ticket.departure)}
            {` / `}
            {TimeToString(ticket.departure)}
          </ThemedText>
        </View>
      </View>

      <View
        style={{
          paddingHorizontal: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 20,
          marginVertical: 10,
        }}
      >
        <View>
          <ThemedText type="h6">Origin</ThemedText>
          <ThemedText type="h4">{ticket.fromT}</ThemedText>
          <ThemedText type="h4">
            {ticket.from?.split(",")[0]?.trim()}
          </ThemedText>
        </View>
        <View>
          <ThemedText type="h6">Destination</ThemedText>
          <ThemedText type="h4">{ticket.toT}</ThemedText>
          <ThemedText type="h4">{ticket.to?.split(",")[0]?.trim()}</ThemedText>
        </View>
      </View>
      <View style={{ paddingHorizontal: 10, marginBottom: 5 }}>
        <ThemedText type="s6" lightColor="#999" darkColor="#ddd">
          {ticket.vehicalNo} | {ticket.org} | {ticket.type} | {ticket.routeNo}{" "}
          {ticket.route}
        </ThemedText>
      </View>
      <View
        style={{
          paddingHorizontal: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 5,
          marginBottom: 5,
        }}
      >
        <View>
          <ThemedText type="h6">Price: LKR {ticket.price}</ThemedText>
          {ticket.seatNos == undefined || ticket.seatNos.length == 0 ? (
            <ThemedText type="h6">Quick Ticket</ThemedText>
          ) : (
            <ThemedText type="h6">
              Seat No(s): {ticket.seatNos.join(", ")}
            </ThemedText>
          )}
        </View>
        <View>
          <ThemedText type="h6">
            Adult: {ticket.full} | Child: {ticket.half}
          </ThemedText>
        </View>
      </View>
      {ticket.tracking && (
        <View
          style={{
            marginVertical: 10,
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
            Tracking is available
          </Text>
        </View>
      )}
      {!ticket.tracking && (
        <View
          style={{
            marginVertical: 10,
            flexDirection: "row",
            justifyContent: "center",
            gap: 5,
            alignItems: "center",
          }}
        >
          <FontAwesomeIcon
            icon={faCircleInfo}
            size={14}
            color={theme === "dark" ? "#F8B43F" : "#F7A416"}
          />
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 13,
              color: theme === "dark" ? "#F8B43F" : "#F7A416",
            }}
          >
            Tracking is available 5 min before the bus departure
          </Text>
        </View>
      )}

      <View
        style={{
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          flexDirection: "row",
          justifyContent: "space-evenly",
          backgroundColor: theme === "dark" ? "#444" : "#eeea",
        }}
      >
        <Pressable
          style={{
            padding: 5,
            alignItems: "center",
          }}
          onPress={handleRefundRequest}
          pointerEvents={ticket.cancel ? "auto" : "none"}
        >
          {ticket.cancel ? (
            <FontAwesomeIcon icon={faTrash} size={iconSize} color={iconColor} />
          ) : (
            <FontAwesomeIcon
              icon={faTrash}
              size={iconSize}
              color={disabledIconColor}
            />
          )}
          <Text
            style={{
              fontSize: iconTitleSize,
              color: ticket.cancel ? iconColor : disabledIconColor,
            }}
          >
            Cancel
          </Text>
        </Pressable>
        <Pressable
          style={{
            padding: 5,
            alignItems: "center",
          }}
          onPress={() => setDisplayFullTicket(true)}
        >
          <FontAwesomeIcon icon={faEye} size={iconSize} color={iconColor} />
          <Text style={{ fontSize: iconTitleSize, color: iconColor }}>
            Full ticket
          </Text>
        </Pressable>
      </View>
      {refundData && (
        <TicketCancelModal
          isVisible={displayTicketCancel}
          onClose={() => setDisplayTicketCancel(false)}
          refNo={refundData.refNo}
          billingDate={refundData.billingDate}
          billingTime={refundData.billingTime}
          cancelDate={refundData.cancelDate}
          cancelTime={refundData.cancelTime}
          duration={refundData.duration}
          amount={refundData.amount}
          refund={refundData.refund}
        />
      )}

      <FullTicket
        isVisible={displayFullTicket}
        onClose={() => setDisplayFullTicket(false)}
        key={ticket.ticketNo}
        ticket={ticket}
      />
    </View>
  );
};
