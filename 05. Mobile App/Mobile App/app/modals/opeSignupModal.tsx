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
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { AppProvider, useAppContext } from "@/context/AppContext";
import React from "react";
import {
  DateTimeInputRound,
  DateTimeInputSquare,
  FormDropdown,
  FormInput,
} from "@/components/FormComponents/FormInputField";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import {
  validateLicenseNo,
  validateName,
  validateNIC,
  validateNTCNo,
} from "@/components/FormComponents/FormFunctions";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function OpeSignupModal() {
  const [nic, setNIC] = useState("");
  const [nameOnLicense, setNameOnLicense] = useState("");
  const [ntcLicenseNo, setNTCLicenseNo] = useState("");
  const [driverLicenseNo, setDriverLicenseNo] = useState("");
  const [occupation, setOccupation] = useState("");
  const [nicError, setNICError] = useState(false);
  const [licenseNameError, setLicenseNameError] = useState(false);
  const [ntcError, setNTCError] = useState(false);
  const [licenseNoError, setLicenseNoError] = useState(false);

  const [agree, setAgree] = useState(false);

  const occupations = [
    { label: "Driver", value: "Driver" },
    { label: "Conductor", value: "Conductor" },
    { label: "Both", value: "Both" },
  ];

  const inputRefs = useRef(
    Array.from({ length: 4 }, () => React.createRef<TextInput>())
  );

  const [modalVisible, setModalVisible] = useState(true);

  const closeModal = () => {
    setModalVisible(false);
    router.back();
  };

  useEffect(() => {
    if (
      !nicError &&
      nic != "" &&
      !ntcError &&
      ntcLicenseNo != "" &&
      occupation != ""
    ) {
      if (occupation == "Conductor") {
        setAgree(true);
      } else if (
        !licenseNameError &&
        !licenseNoError &&
        nameOnLicense != "" &&
        driverLicenseNo != ""
      ) {
        setAgree(true);
      } else {
        setAgree(false);
      }
    } else {
      setAgree(false);
    }
  }, [nic, nameOnLicense, ntcLicenseNo, driverLicenseNo, occupation]);

  function submitForm() {
    router.navigate("/(drawerOpe)/home/dashboard" as Href<string>);
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <GestureHandlerRootView style={styles.pageBody}>
        <Pressable
          style={styles.cancelIcon}
          onPress={() => {
            closeModal();
          }}
        >
          <FontAwesomeIcon icon={faXmark} size={32} color={"gray"} />
        </Pressable>
        <FormInput
          ref={inputRefs.current[0]}
          title="NIC"
          input={nic}
          setInput={setNIC}
          error={nicError}
          setError={setNICError}
          errorMessage={"Invalid NIC"}
          validation={validateNIC}
          maxLength={12}
          placeholder="NIC"
        />
        <FormDropdown
          title="Occupation"
          input={occupation}
          setInput={setOccupation}
          dataList={occupations}
          placeholder="Select occupation"
        />
        <FormInput
          ref={inputRefs.current[1]}
          nextFocus={inputRefs.current[2]}
          title="NTC License Number"
          input={ntcLicenseNo}
          setInput={setNTCLicenseNo}
          error={ntcError}
          setError={setNTCError}
          errorMessage={"Invalid NTC license number"}
          validation={validateNTCNo}
          maxLength={7}
          placeholder="A-00000"
        />
        {(occupation == "Driver" || occupation == "Both") && (
          <FormInput
            ref={inputRefs.current[2]}
            nextFocus={inputRefs.current[3]}
            title="Name on Driver's License"
            input={nameOnLicense}
            setInput={setNameOnLicense}
            error={licenseNameError}
            setError={setLicenseNameError}
            errorMessage={"Invalid name"}
            validation={validateName}
            maxLength={256}
            placeholder="John Doe"
          />
        )}
        {(occupation == "Driver" || occupation == "Both") && (
          <FormInput
            ref={inputRefs.current[3]}
            title="Driver's License Number"
            input={driverLicenseNo}
            setInput={setDriverLicenseNo}
            error={licenseNoError}
            setError={setLicenseNoError}
            errorMessage={"Invalid driver's license number"}
            validation={validateLicenseNo}
            maxLength={8}
            placeholder="A0000000"
          />
        )}
        <Pressable
          style={[styles.submitButton, agree && { backgroundColor: "#1eceda" }]}
          disabled={!agree}
          onPress={submitForm}
        >
          <ThemedText type="subtitle" lightColor="#fff" darkColor="#fff">
            Sign Up
          </ThemedText>
        </Pressable>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  pageBody: {
    flex: 1,
    paddingHorizontal: 30,
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
