import { router } from "expo-router";
import { useState, useEffect } from "react";
import { Pressable, useColorScheme, View, StyleSheet } from "react-native";
import { ThemedText } from "../CommonModules/ThemedText";
import { useAppContext } from "../../context/AppContext";

type SeatProps = {
  index: number;
  reserved?: boolean;
};

const seatColors = new Map<string, string>([
  ["Available", "#999a"],
  ["Selected", "#0af"],
  ["Not-Available", "#f30e"],
  ["Reserved", "#f90"],
]);

export default function Seat({ index, reserved = false }: SeatProps) {
  const theme = useColorScheme() ?? "light";
  const { accountType, seatNos, setSeatNos } = useAppContext();

  useEffect(() => {
    // This effect ensures the component re-renders when seatNos changes
  }, [seatNos]);

  const updateStatus = () => {
    if (reserved) {
      return;
    }

    const newSeatNos = [...seatNos];
    const seatIndex = seatNos.indexOf(index);

    if (seatIndex === -1) {
      // Add seat to selected seats
      newSeatNos.push(index);
    } else {
      // Remove seat from selected seats
      newSeatNos.splice(seatIndex, 1);
    }

    setSeatNos(newSeatNos);
  };

  const isSelected = seatNos.includes(index);

  return (
    <Pressable
      pointerEvents={accountType === "passenger" ? "auto" : "none"}
      style={[
        styles.seatButton,
        {
          backgroundColor: reserved
            ? seatColors.get("Reserved")
            : isSelected
            ? seatColors.get("Selected")
            : seatColors.get("Available"),
        },
      ]}
      onPress={updateStatus}
    >
      <ThemedText type="h4" lightColor="#fff">
        {index}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  seatButton: {
    margin: 5,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: "center",
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
