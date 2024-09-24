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
  
  export default function QuickTicketModal() {
    const theme = useColorScheme() ?? "light";
    const [modalVisible, setModalVisible] = useState(true);
    const { seatNo, myTickets, setMyTickets } = useAppContext();
  
    const closeModal = () => {
      setModalVisible(false);
      router.back();
    };
  
    function buyTicket() {
      const newTicketId = 'QTicket12';
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
  