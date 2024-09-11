import {
  Modal,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { ThemedView } from "@/components/CommonModules/ThemedView";
import { ThemedText } from "@/components/CommonModules/ThemedText";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { router } from "expo-router";
import { useState } from "react";
import {Seat44Layout, Seat54Layout} from "@/components/UIComponents/SeatLayouts";
import { AppProvider, useAppContext } from "@/context/AppContext";
import { Ticket } from "@/controller/Ticket";

export default function Seats() {
  const theme = useColorScheme() ?? "light";
  const [modalVisible, setModalVisible] = useState(true);
  const seatColors = new Map<String, string>([
    ["Available", "#999a"],
    ["Selected", "#0af"],
    ["Not-Available", "#f30e"],
    ["Reserved", "#f90"],
  ]);
  const { seatNo, myTickets, setMyTickets } = useAppContext();

  const closeModal = () => {
    setModalVisible(false);
    router.back();
  };

  function bookSeat() {
    const newTicketId = 'c12345';
    const newTicket = new Ticket(newTicketId);
    const updatedMyTickets = new Map(myTickets);
    updatedMyTickets.set(newTicketId, newTicket);
    setMyTickets(updatedMyTickets);
    closeModal();
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <ThemedView style={styles.pageBody} lightColor="#fff" darkColor="#222">
        <Pressable
          style={styles.cancelIcon}
          onPress={() => {
            closeModal();
          }}
        >
          <FontAwesomeIcon icon={faXmark} size={32} color={"gray"} />
        </Pressable>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="h3" lightColor="#33aefc" darkColor="#33aefc">
            Seat Layout
          </ThemedText>
          <Seat54Layout />
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 2, marginTop: 20 }}>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <View
                  style={{
                    height: 20,
                    width: 20,
                    backgroundColor: seatColors.get("Available"),
                    borderRadius: 10,
                  }}
                ></View>
                <ThemedText>Available</ThemedText>
              </View>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <View
                  style={{
                    height: 20,
                    width: 20,
                    backgroundColor: seatColors.get("Selected"),
                    borderRadius: 10,
                  }}
                ></View>
                <ThemedText>Selected</ThemedText>
              </View>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <View
                  style={{
                    height: 20,
                    width: 20,
                    backgroundColor: seatColors.get("Not-Available"),
                    borderRadius: 10,
                  }}
                ></View>
                <ThemedText>Not-Available</ThemedText>
              </View>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <View
                  style={{
                    height: 20,
                    width: 20,
                    backgroundColor: seatColors.get("Reserved"),
                    borderRadius: 10,
                  }}
                ></View>
                <ThemedText>Reserved</ThemedText>
              </View>
            </View>
            <Pressable
              style={{
                flex: 1,
                alignSelf: "flex-end",
                backgroundColor: seatNo != 0 ? "green" : "gray",
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 20,
                alignItems: "center",
              }}
              onPress={bookSeat}
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
    marginTop: 10,
    flexDirection: "row",
    alignSelf: "flex-end",
  },
});
