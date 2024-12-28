import React, { Dispatch, SetStateAction } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { ThemedText } from "../CommonModules/ThemedText";

interface NumberPickerProps {
  value: number;
  setValue: Dispatch<SetStateAction<number>>;
  minValue?: number; // Optional lower limit
  maxValue?: number; // Optional upper limit
}

const NumberPicker: React.FC<NumberPickerProps> = ({
  value,
  setValue,
  minValue = 0, // Default lower limit is 0
  maxValue = 10, // Default upper limit is 10
}) => {
  const decrement = () => {
    if (value > minValue) {
      setValue(value - 1);
    }
  };

  const increment = () => {
    if (value < maxValue) {
      setValue(value + 1);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={decrement}>
        <FontAwesomeIcon icon={faMinusCircle} size={20} color={"#b99"} />
      </Pressable>
      <ThemedText type={"h4"} style={styles.value}>
        {value}
      </ThemedText>
      <Pressable onPress={increment}>
        <FontAwesomeIcon icon={faPlusCircle} size={20} color={"#b99"} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#b995",
    borderRadius: 20,
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  value: {
    marginHorizontal: 10,
    fontSize: 20,
  },
});

export default NumberPicker;
