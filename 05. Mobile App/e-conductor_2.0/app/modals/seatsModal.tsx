import {
  Alert,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { ThemedView } from "../../components/CommonModules/ThemedView";
import { ThemedText } from "../../components/CommonModules/ThemedText";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Seat44Layout,
  Seat54Layout,
  SeatLegend,
} from "../../components/UIComponents/SeatLayouts";
import axios from "axios";
import {
  DateToString,
  TimeToString,
} from "../../components/CommonModules/DateTimeToString";
import NumberPicker from "../../components/UIComponents/NumberPicker";
import Modal from "react-native-modal";
import { useAppContext } from "../../context/AppContext";

interface TicketData {
  userID: string;
  issuedDate: string;
  issuedTime: string;
  date: string;
  aproxDepT: string;
  aproxAriT: string;
  from: string;
  to: string;
  journey: string;
  half: number;
  full: number;
  unitPrice: number;
  totalPrice: number;
  seatNos: number[];
  status: string;
  scheduleId: string;
  discount: number;
}

type Props = {
  isVisible: boolean;
  onClose: (event?: GestureResponderEvent) => void;
  scheduleId: string;
  seats: number;
  departureDate: string;
  aproxDepT: string;
  aproxAriT: string;
  journey: string;
  fromID: string;
  toID: string;
  unitPrice: number;
  discount: number;
};

export default function SeatsModal({
  isVisible,
  onClose,
  scheduleId,
  seats,
  departureDate,
  aproxDepT,
  aproxAriT,
  journey,
  fromID,
  toID,
  unitPrice,
  discount,
}: Props) {
  const theme = useColorScheme() ?? "light";
  const [half, setHalf] = useState(0);
  const [full, setFull] = useState(0);

  const { baseURL, id, credits, setCredits, seatNos, setSeatNos } =
    useAppContext();

  function pressCancel() {
    setSeatNos([]);
    setFull(0);
    setHalf(0);
    onClose();
  }

  const handleBooking = async () => {
    if (!seatNos) {
      Alert.alert("Please choose atleat one seat");
      return;
    }

    let withoutDiscount: number = parseFloat(
      (unitPrice * (half / 2 + full)).toFixed(2)
    );
    let discountValue = (withoutDiscount * discount) / 100;

    const ticket: TicketData = {
      userID: id,
      issuedDate: DateToString(new Date()),
      issuedTime: TimeToString(new Date()),
      date: departureDate,
      aproxDepT: aproxDepT,
      aproxAriT: aproxAriT,
      from: fromID,
      to: toID,
      journey: journey,
      half: half,
      full: full,
      unitPrice: unitPrice,
      totalPrice: withoutDiscount - discountValue,
      seatNos: seatNos,
      status: "Available",
      scheduleId: scheduleId,
      discount: discountValue,
    };

    try {
      const response = await axios.post(`${baseURL}/tickets/tkt3`, {
        data: ticket,
      });

      if (response.data === "success") {
        Alert.alert("Booking successful!");
        setSeatNos([]);
        setCredits(credits - withoutDiscount + discountValue);
        onClose();
      } else if (response.data === "insufficient") {
        Alert.alert("Insufficient credits for this booking.");
      } else {
        Alert.alert("Booking failed.");
      }
    } catch (error) {
      console.error("Error booking ticket:", error);
      Alert.alert("Error booking ticket. Please try again.");
    }
  };

  return (
    <Modal isVisible={isVisible}>
      <Pressable style={styles.cancelIcon} onPress={pressCancel}>
        <FontAwesomeIcon icon={faXmark} size={32} color={"gray"} />
      </Pressable>
      <ThemedView style={styles.pageBody} lightColor="#fff" darkColor="#222">
        <ThemedView style={styles.titleContainer}>
          {seats == 42 && <Seat44Layout />}
          {seats == 54 && <Seat54Layout />}
          <SeatLegend />
          <View style={{ flexDirection: "row", gap: 20, marginVertical: 10 }}>
            <View style={{ gap: 10 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <ThemedText type="h4" lightColor="#a07070" darkColor="#b09090">
                  Full:{" "}
                </ThemedText>
                <NumberPicker value={full} setValue={setFull} />
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <ThemedText type="h4" lightColor="#a07070" darkColor="#b09090">
                  Half:{" "}
                </ThemedText>
                <NumberPicker value={half} setValue={setHalf} />
              </View>
            </View>

            <Pressable
              disabled={seatNos.length == 0 && full == 0 && half == 0}
              style={{
                flex: 1,
                alignSelf: "center",
                backgroundColor:
                  seatNos.length == full + half
                    ? "#0eaedf"
                    : "#999a",
                paddingHorizontal: 10,
                paddingVertical: 20,
                borderRadius: 50,
                alignItems: "center",
              }}
              onPress={handleBooking}
            >
              <ThemedText type="h4" lightColor="#fff">
                Book seat
              </ThemedText>
            </Pressable>
          </View>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  pageBody: {
    flex: 1,
    paddingHorizontal: 10,
    borderRadius: 30,
  },
  titleContainer: {
    backgroundColor: "transparent",
    padding: 10,
    alignItems: "center",
  },
  cancelIcon: {
    marginHorizontal: 10,
    flexDirection: "row",
    alignSelf: "flex-end",
  },
});
