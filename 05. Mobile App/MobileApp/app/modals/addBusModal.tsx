import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { ThemedView } from "@/components/CommonModules/ThemedView";
import { ThemedText } from "@/components/CommonModules/ThemedText";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faClock, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Href, router } from "expo-router";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import SeatLayout from "@/components/UIComponents/SeatLayout";
import { AppProvider, useAppContext } from "@/context/AppContext";
import React from "react";
import {
  DateTimeInputRound,
  DateTimeInputSquare,
  FormInput,
} from "@/components/FormComponents/FormInputField";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import {
  validateName,
  validateNTCNo,
} from "@/components/FormComponents/FormFunctions";

export default function addBus() {
  const [regNo, setRegNo] = useState("");
  const [ntcNo, setNTCNo] = useState("");
  const [ntcDriver1, setNTCDriver1] = useState("");
  const [ntcConductor1, setNTConductor1] = useState("");
  const [ntcDriver2, setNTCDriver2] = useState("");
  const [ntcConductor2, setNTConductor2] = useState("");
  const [departure, setDeparture] = useState("");
  const [departureTime, setDepartureTime] = useState(new Date());
  const [terminal, setTerminal] = useState("");
  const [terminalTime, setTerminalTime] = useState(new Date());
  const [retrunTime, setReturnTime] = useState(new Date());

  const [openDepartureTime, setOpenDepartureTime] = useState(false);
  const [openTerminalTime, setOpenTerminalTime] = useState(false);
  const [openReturnTime, setOpenReturnTime] = useState(false);

  const inputRefs = useRef(
    Array.from({ length: 7 }, () => React.createRef<TextInput>())
  );
  const [modalVisible, setModalVisible] = useState(true);
  useAppContext();

  const closeModal = () => {
    setModalVisible(false);
    router.back();
  };

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
        <ScrollView style={{ marginHorizontal: 20 }}>
          <FormInput
            ref={inputRefs.current[0]}
            nextFocus={inputRefs.current[1]}
            title="Registration Number"
            input={regNo}
            setInput={setRegNo}
            errorMessage={"Invalid registration number"}
            validation={validateNTCNo}
            maxLength={256}
            placeholder="Registration number"
          />
          <FormInput
            ref={inputRefs.current[1]}
            nextFocus={inputRefs.current[2]}
            title="NTC Registration Number"
            input={ntcNo}
            setInput={setNTCNo}
            errorMessage={"Invalid NTC number"}
            validation={validateNTCNo}
            maxLength={256}
            placeholder="NTC Registration number"
          />
          <FormInput
            ref={inputRefs.current[2]}
            nextFocus={inputRefs.current[3]}
            title="Departure"
            input={departure}
            setInput={setDeparture}
            errorMessage={"Invalid location"}
            validation={validateName}
            maxLength={256}
            placeholder="Departure location"
          />

          <DateTimeInputRound
            input={departureTime}
            setInput={setDepartureTime}
            title={"Departure time"}
            placeholder={"Departure time"}
            type={"Time"}
            setOpenPicker={setOpenDepartureTime}
          />

          {openDepartureTime && (
            <DateTimePicker
              value={departureTime}
              mode="time"
              display="spinner"
              onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                if (event.type === "set" && selectedDate) {
                  setDepartureTime(selectedDate);
                }
                setOpenDepartureTime(false);
              }}
            />
          )}

          <FormInput
            ref={inputRefs.current[3]}
            nextFocus={inputRefs.current[4]}
            title="Terminal"
            input={terminal}
            setInput={setTerminal}
            errorMessage={"Invalid location"}
            validation={validateName}
            maxLength={256}
            placeholder="Terminal location"
          />

          <DateTimeInputRound
            input={terminalTime}
            setInput={setTerminalTime}
            title={"Terminal time"}
            placeholder={"Terminal time"}
            type={"Time"}
            setOpenPicker={setOpenTerminalTime}
          />

          {openTerminalTime && (
            <DateTimePicker
              value={terminalTime}
              mode="time"
              display="spinner"
              onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                if (event.type === "set" && selectedDate) {
                  setTerminalTime(selectedDate);
                }
                setOpenTerminalTime(false);
              }}
            />
          )}

          <DateTimeInputRound
            input={retrunTime}
            setInput={setReturnTime}
            title={"Return time"}
            placeholder={"Return time"}
            type={"Time"}
            setOpenPicker={setOpenReturnTime}
          />

          {openReturnTime && (
            <DateTimePicker
              value={retrunTime}
              mode="time"
              display="spinner"
              onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                if (event.type === "set" && selectedDate) {
                  setReturnTime(selectedDate);
                }
                setOpenReturnTime(false);
              }}
            />
          )}

          <FormInput
            ref={inputRefs.current[4]}
            nextFocus={inputRefs.current[5]}
            title="Driver's NTC Number"
            input={ntcDriver1}
            setInput={setNTCDriver1}
            errorMessage={"Invalid NTC number"}
            validation={validateNTCNo}
            maxLength={256}
            placeholder="Driver's NTC number"
          />
          <FormInput
            ref={inputRefs.current[5]}
            nextFocus={inputRefs.current[6]}
            title="Conductor's NTC Number"
            input={ntcConductor1}
            setInput={setNTConductor1}
            errorMessage={"Invalid NTC number"}
            validation={validateNTCNo}
            maxLength={256}
            placeholder="Conductor's NTC number"
          />

          <FormInput
            ref={inputRefs.current[4]}
            nextFocus={inputRefs.current[5]}
            title="Co-Driver's NTC Number"
            input={ntcDriver2}
            setInput={setNTCDriver2}
            errorMessage={"Invalid NTC number"}
            validation={validateNTCNo}
            maxLength={256}
            placeholder="Co-Driver's NTC number"
          />
          <FormInput
            ref={inputRefs.current[5]}
            nextFocus={inputRefs.current[6]}
            title="Co-Conductor's NTC Number"
            input={ntcConductor2}
            setInput={setNTConductor2}
            errorMessage={"Invalid NTC number"}
            validation={validateNTCNo}
            maxLength={256}
            placeholder="Co-Conductor's NTC number"
          />

          <Pressable
            style={styles.addButton}
            onPress={() => {
              router.replace("/(drawer)/home/dashboard" as Href<string>);
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                gap: 10,
              }}
            >
              <ThemedText type="h5" lightColor={"#fff"} darkColor={"#fff"}>
                DONE
              </ThemedText>
            </View>
          </Pressable>
        </ScrollView>
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
  addButton: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: '#33aefc'
  },
});
