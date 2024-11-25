import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
  Image,
} from "react-native";
import { ThemedView } from "../../../components/CommonModules/ThemedView";
import { ThemedText } from "../../../components/CommonModules/ThemedText";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-native-modal";

type Props = {
  isVisible: boolean;
  onClose: (event: GestureResponderEvent) => void;
  valid: boolean;
  regNo: string;
  departureTime: string;
  from: string;
  to: string;
  seatNos: string;
  full: string; half: string
  isQuickTicket: boolean
};

export default function TicketScan({
  isVisible,
  onClose,
  valid,
  regNo,
  departureTime,
  from,
  to,
  seatNos,
  full,
  half,
  isQuickTicket
}: Props) {
  const theme = useColorScheme() ?? "light";

  return (
    <Modal isVisible={isVisible}>
      <ThemedView style={styles.pageBody} lightColor="#fff" darkColor="#222">
        <Pressable style={styles.cancelIcon} onPress={onClose}>
          <FontAwesomeIcon icon={faXmark} size={32} color={"gray"} />
        </Pressable>
        <Image
          source={
            (valid || isQuickTicket)
              ? require("../../../assets/icons/valid.png")
              : require("../../../assets/icons/invalid.png")
          }
          style={styles.validityIcon}
        />
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <ThemedText lightColor="#fff">Reg No: {regNo}</ThemedText>
          <ThemedText lightColor="#fff">
            Departure time: {departureTime}
          </ThemedText>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <ThemedText type="h6" lightColor="#fff">From:</ThemedText>
            <ThemedText type="h4" lightColor="#fff">{from}</ThemedText>
          </View>
          <View>
            <ThemedText type="h6" lightColor="#fff">To:</ThemedText>
            <ThemedText type="h4" lightColor="#fff">{to}</ThemedText>
          </View>
        </View>
        <View style={{ alignItems: "center", marginVertical: 20, gap: 10 }}>
          {(seatNos == undefined || seatNos.length == 0) ? (
            <ThemedText type="h3" lightColor="#fff">Quick Ticket</ThemedText>
          ) : (
            <ThemedText type="h3" lightColor="#fff">Seat No(s): {seatNos}</ThemedText>
          )}
          <ThemedText type="h3" lightColor="#fff">Adult: {full} | Child: {half}</ThemedText>
        </View>
        <Pressable style={styles.scanButton} onPress={onClose}>
      <ThemedText type="h3" lightColor="#fff">Scan</ThemedText>
        </Pressable>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  pageBody: {
    backgroundColor: "#555",
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  titleContainer: {
    backgroundColor: "transparent",
    padding: 10,
    alignItems: "center",
  },
  cancelIcon: {
    marginTop: 20,
    flexDirection: "row",
    alignSelf: "flex-end",
  },
  scanButton: {
    backgroundColor: '#0af',
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 50,
    marginHorizontal: 10,
    marginVertical: 20,
    flexDirection: "row",
    alignSelf: 'center',
  },
  validityIcon: {
    height: 125,
    width: 125,
    margin: 10,
    alignSelf: "center",
  },
});
