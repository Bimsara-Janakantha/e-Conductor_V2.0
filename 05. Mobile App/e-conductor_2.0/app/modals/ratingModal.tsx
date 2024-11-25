import {
  Alert,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
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
import StarRating from "../../components/UIComponents/StarRating";

type Props = {
  isVisible: boolean;
  onClose: (event?: GestureResponderEvent) => void;
  refNo: string;
};

export default function RatingModal({ isVisible, onClose, refNo }: Props) {
  const { baseURL, id } = useAppContext();
  const [stars, setStars] = useState(0);
  const [filled, setFilled] = useState(false);

  //================================================ Functions ===============================================//

  // Update user data in the database and redirect to the correct dashboard
  function pressSubmit() {
    updateBusRatings(id, refNo, stars);
    onClose();
  }

  //================================================ Backend Calls ===============================================//

  // Update bus ratings in the database
  const updateBusRatings = async (
    id: string,
    refNo: string,
    stars: number
  ) => {
    try {
      const response = await axios.post(`${baseURL}/bus/rating`, {
        userID: id,
        refNo,
        stars,
      });

      if (response.status === 200) {
        Alert.alert("Success", "Feedback sent successfully");
      } else {
        Alert.alert("Unsuccessful", "Failed to send feeedback successfully");
      }
    } catch (error) {
      console.error("Error sending feedback:", error);
      Alert.alert("Error", "Failed to send the feedback");
    }
  };

  //================================================ Use Effects ===============================================//

  // Reset input fields
  useEffect(() => {
    setStars(0);
  }, [isVisible]);

  // Check if all the fields are filled
  useEffect(() => {
    if (stars != 0) {
      setFilled(true);
    } else {
      setFilled(false);
    }
  }, [stars]);

  //================================================ UI Control ===============================================//

  return (
    <Modal
      isVisible={isVisible}
      backdropColor="rgba(0, 0, 0, 0.5)"
      backdropOpacity={0.5}
    >
      <Pressable style={styles.cancelIcon} onPress={onClose}>
        <FontAwesomeIcon icon={faXmark} size={32} color={"#ccc"} />
      </Pressable>
      <View style={styles.container}>
        <View style={{ marginBottom: 20 }}>
          <StarRating
            rating={stars}
            maxStars={5}
            starSize={30}
            onRatingChange={(rating: number) => {
              setStars(rating);
            }}
          />
        </View>
        <Pressable
          style={[
            styles.submitButton,
            filled && { backgroundColor: "#1eceda" },
          ]}
          disabled={!filled}
          onPress={pressSubmit}
        >
          <ThemedText type="subtitle" lightColor="#fff" darkColor="#fff">
            Submit
          </ThemedText>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    paddingTop: 30,
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
    marginHorizontal: 5,
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
