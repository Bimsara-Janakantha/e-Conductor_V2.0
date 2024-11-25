import { View, Pressable, useColorScheme, StyleSheet } from "react-native";
import { Dispatch, SetStateAction } from "react";
import { useAppContext } from "../../context/AppContext";
import { ThemedText } from "../CommonModules/ThemedText";
import { Schedule } from "../../app/(drawerPas)/home/tickets";

type Props = {
  schedule: Schedule;
  today: string;
  setSelectedSchedule: Dispatch<SetStateAction<Schedule | undefined>>;
  setSeats: Dispatch<SetStateAction<number>>;
  setDisplaySeatsModel: Dispatch<SetStateAction<boolean>>;
  setDisplayQTModal: Dispatch<SetStateAction<boolean>>;
};

export const BusSchedule = ({
  schedule,
  today,
  setDisplaySeatsModel,
  setSeats,
  setSelectedSchedule,
  setDisplayQTModal,
}: Props) => {
  const { profileImage, credits, fName, lName } = useAppContext();
  const theme = useColorScheme() ?? "light";

  function checkQTAvailability(closingDate: string) {
    if (closingDate <= today) {
      return true;
    } else {
      return false;
    }
  }

  // Display seat layout to choose seat(s)
  const pressBuy = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setSeats(schedule.seats);
    setDisplaySeatsModel(true);
  };

  const pressQuickTicket = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setDisplayQTModal(true);
  };

  return (
    <View
      style={{
        marginBottom: 15,
        marginHorizontal: 10,
        borderRadius: 10,
        backgroundColor: theme === "dark" ? "#555" : "#fff",
        elevation: 5,
      }}
    >
      <View
        style={{
          backgroundColor: theme === "dark" ? "#f91" : "#f91",
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          paddingVertical: 5,
          paddingHorizontal: 10,
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <ThemedText type="h6" lightColor="#fff" darkColor="#fff">
          Booking Closing Date: {schedule.closing}
        </ThemedText>
      </View>
      <View style={{ margin: 10 }}>
        <View
          style={{
            paddingHorizontal: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <View>
            <ThemedText type="h6">Origin</ThemedText>
            <ThemedText type="h4">{schedule.departure}</ThemedText>
            <ThemedText type="h4">
              {schedule.from?.split(",")[0]?.trim()}
            </ThemedText>
          </View>
          <View>
            <ThemedText type="h6">Destination</ThemedText>
            <ThemedText type="h4">{schedule.arrival}</ThemedText>
            <ThemedText type="h4">
              {schedule.to?.split(",")[0]?.trim()}
            </ThemedText>
          </View>
        </View>
        <View style={{ marginVertical: 5, marginHorizontal: 10 }}>
          <ThemedText type="s6" lightColor="#999" darkColor="#ddd">
            {schedule.org} | {schedule.service} | {schedule.routeType} | Route:{" "}
            {schedule.routeNo}
          </ThemedText>
        </View>
        <View
          style={{
            paddingHorizontal: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 5,
            marginBottom: 5,
            alignItems: "center",
          }}
        >
          <View>
            <ThemedText type="h4">Price: LKR {schedule.price}</ThemedText>
          </View>
          <View style={{ justifyContent: "space-between" }}>
            {checkQTAvailability(schedule.closing) ? (
              <Pressable
                style={{
                  flex: 1,
                  alignSelf: "center",
                  backgroundColor: "#59f",
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  marginVertical: 10,
                  borderRadius: 50,
                  alignItems: "center",
                }}
                onPress={() => pressQuickTicket(schedule)}
              >
                <ThemedText type="h4" lightColor="#fff">
                  Quick Ticket
                </ThemedText>
              </Pressable>
            ) : (
              <Pressable
                style={{
                  flex: 1,
                  alignSelf: "center",
                  backgroundColor: "#e28",
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  marginVertical: 10,
                  borderRadius: 50,
                  alignItems: "center",
                }}
                onPress={() => pressBuy(schedule)}
              >
                <ThemedText type="h4" lightColor="#fff">
                  Buy Ticket
                </ThemedText>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileImage: {
    height: 40,
    width: 40,
    borderRadius: 60,
  },
});
