import { ThemedText } from "@/components/CommonModules/ThemedText";
import { ThemedView } from "@/components/CommonModules/ThemedView";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faLocationDot,
  faLocationCrosshairs,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { Href, router } from "expo-router";
import {
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { useRef, useState } from "react";
import {
  DateTimeInputSquare,
  SearchInput,
} from "@/components/FormComponents/FormInputField";
import React from "react";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { faCalendarDays } from "@fortawesome/free-regular-svg-icons";
import { StringTime } from "@/components/CommonModules/StringDateTime";
import { Owner } from "@/controller/Owner";
import { Bus } from "@/controller/Bus";
import { Ticket } from "@/controller/Ticket";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useAppContext } from "@/context/AppContext";
import BusView from "@/components/UIComponents/BusView";

export default function Tickets() {
  const { busData } = useAppContext();
  const iconSize = 20;
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [openDate, setOpenDate] = useState(false);
  const [openTime, setOpenTime] = useState(false);

  const filteredBusData = busData.filter(
    (bus) => bus.departure === from && bus.terminal === to
  );

  const inputRefs = useRef(
    Array.from({ length: 2 }, () => React.createRef<TextInput>())
  );

  function openSeats() {
    router.navigate("/seats" as Href<string>);
  }

  return (
    <View style={styles.mainBody}>
      <SearchInput
        ref={inputRefs.current[0]}
        nextFocus={inputRefs.current[1]}
        input={from}
        setInput={setFrom}
        placeholder="From"
        iconName={faLocationCrosshairs}
        layer={3}
      />

      <SearchInput
        ref={inputRefs.current[1]}
        input={to}
        setInput={setTo}
        placeholder="To"
        iconName={faLocationDot}
        layer={2}
      />

      <View style={{ backgroundColor: "transparent" }}>
        <DateTimeInputSquare
          input={date}
          setInput={setDate}
          iconName={faCalendarDays}
          placeholder={"Date"}
          type={"Date"}
          setOpenPicker={setOpenDate}
        />

        {openDate && (
          <DateTimePicker
            value={date}
            mode="date"
            display="spinner"
            onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
              if (event.type === "set" && selectedDate) {
                setDate(selectedDate);
              }
              setOpenDate(false);
            }}
          />
        )}

        <DateTimeInputSquare
          input={time}
          setInput={setTime}
          iconName={faClock}
          placeholder={"Time"}
          type={"Time"}
          setOpenPicker={setOpenTime}
        />

        {openTime && (
          <DateTimePicker
            value={time}
            mode="time"
            display="spinner"
            onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
              if (event.type === "set" && selectedDate) {
                setTime(selectedDate);
              }
              setOpenTime(false);
            }}
          />
        )}
      </View>

      {/********************************************* Search Result ****************************************************/}

      <FlatList
        style={styles.flatList}
        data={filteredBusData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <BusView bus={item} />}
      />

      {filteredBusData.length == 0 && (
        <View style={{ alignSelf: "center", marginBottom: 200 }}>
          <ThemedText type="s5" lightColor="#666" darkColor="#ccc">
            No buses are available
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainBody: {
    padding: 10,
    flex: 1,
    zIndex: 1,
    position: "relative",
  },
  inputDropdown: {
    width: 280,
    color: "#333",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: -10,
    marginBottom: 10,
    backgroundColor: "#fff",
    elevation: 3,
  },
  flatList: {
    marginHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  searchResult: {
    marginVertical: 5,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#fc55",
  },
  horizontalLine: {
    flex: 1,
    width: 2,
    height: 40,
    margin: 5,
    borderWidth: 0,
    backgroundColor: "#aaa",
    alignSelf: "center",
  },
});
