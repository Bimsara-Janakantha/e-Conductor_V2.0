import {
  Alert,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

import { useAppContext } from "../../context/AppContext";
import { ThemedText } from "../../components/CommonModules/ThemedText";
import axios from "axios";
import Modal from "react-native-modal";

type Props = {
  isVisible: boolean;
  onClose: (event?: GestureResponderEvent) => void;
};

export default function MessageModal({ isVisible, onClose }: Props) {
  const { baseURL, id, messages, setMessages } = useAppContext();
  const theme = useColorScheme() ?? "light";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  //================================================ Backend Calls ===============================================//

  // Fetch messages
  const fetchMessages = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`${baseURL}/notification/reqMessages`, {
        userID: id,
      });
      console.log(response.data);
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError(String(error));
      Alert.alert("Error", "Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  //================================================ Use Effects ===============================================//

  // Check if all the fields are filled
  useEffect(() => {
    fetchMessages();
  }, []);

  //================================================ UI Control ===============================================//

  return (
    <Modal
      isVisible={isVisible}
      backdropColor="rgba(0, 0, 0, 0.5)"
      backdropOpacity={0.5}
      onBackdropPress={onClose}
      style={{
        marginHorizontal: 10,
        position: "absolute",
        right: 0,
        top: 0
      }}
    >
      <Pressable style={styles.cancelIcon} onPress={onClose}>
        <FontAwesomeIcon icon={faXmark} size={32} color={"#ffffff"} />
      </Pressable>
      <View
        style={{
          justifyContent: "center",
          padding: 15,
          borderRadius: 20,
          backgroundColor: theme === "dark" ? "#555" : "#fff",
          elevation: 5
        }}
      >
        {messages.length != 0 ? (
          messages.map((message, index) => (
            <View
              key={index}
              style={{
                borderBottomWidth: 1,
                borderBottomColor: theme === "dark" ? "#ddd" : "#777",
                margin: 5,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <ThemedText type="h6">{message.title}</ThemedText>
                <ThemedText type="h6" lightColor="#777" darkColor="#bbb">
                  {message.date}
                </ThemedText>
              </View>
              <ThemedText type="s6">{message.message}</ThemedText>
            </View>
          ))
        ) : (
          <View
            style={{
              alignItems: "center",
            }}
          >
            <ThemedText type="h6" lightColor="#777" darkColor="#ddd">
              No messages found
            </ThemedText>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 20,
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
  submitButton: {
    alignItems: "center",
    backgroundColor: "gray",
    marginVertical: 20,
    marginHorizontal: 20,
    paddingHorizontal: 60,
    paddingVertical: 10,
    borderRadius: 30,
  },
  footer: {
    position: "absolute",
    bottom: 150,
    alignSelf: "center",
  },
});
