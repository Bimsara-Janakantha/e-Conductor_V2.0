import {
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native";
import { ThemedText } from "@/components/CommonModules/ThemedText";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Href, router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import React from "react";
import {
  FormInput,
} from "@/components/FormComponents/FormInputField";
import {
  validateAccountNo,
  validateName,
  validateNIC,
} from "@/components/FormComponents/FormFunctions";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function SignupModal() {
  const [nic, setNIC] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [accHolderName, setAccHolderName] = useState("");
  const [bankName, setBankName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [nicError, setNICError] = useState(false);
  const [accNoError, setAccNoError] = useState(false);
  const [accHolderNameError, setAccHolderNameError] = useState(false);
  const [bankNameError, setBankNameError] = useState(false);
  const [branchNameError, setBranchNameError] = useState(false);

  const [agree, setAgree] = useState(false);

  const inputRefs = useRef(
    Array.from({ length: 7 }, () => React.createRef<TextInput>())
  );
  const [modalVisible, setModalVisible] = useState(true);
  useAppContext();

  const closeModal = () => {
    setModalVisible(false);
    router.back();
  };

  useEffect(() => {
    if (
      !nicError &&
      nic != "" &&
      !accNoError &&
      !accHolderNameError &&
      !bankNameError &&
      !branchNameError &&
      accountNo != "" &&
      accHolderName != "" &&
      bankName != "" &&
      branchName != ""
    ) {
      setAgree(true);
    } else {
      setAgree(false);
    }
  }, [nic, accHolderName, accountNo, bankName, branchName]);

  function submitForm() {
    router.navigate("/(drawerOwn)/home/dashboard" as Href<string>);
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
          ref={inputRefs.current[3]}
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
        <FormInput
          ref={inputRefs.current[0]}
          nextFocus={inputRefs.current[1]}
          title="Account No"
          input={accountNo}
          setInput={setAccountNo}
          error={accNoError}
          setError={setAccNoError}
          errorMessage={"Invalid account number"}
          validation={validateAccountNo}
          maxLength={12}
          placeholder="0000 0000 0000"
        />
        <FormInput
          ref={inputRefs.current[1]}
          nextFocus={inputRefs.current[2]}
          title="Name of Account Holder"
          input={accHolderName}
          setInput={setAccHolderName}
          error={accHolderNameError}
          setError={setAccHolderNameError}
          errorMessage={"Invalid name"}
          validation={validateName}
          maxLength={256}
          placeholder="Mr. John Doe"
        />
        <FormInput
          ref={inputRefs.current[2]}
          nextFocus={inputRefs.current[3]}
          title="Bank name"
          input={bankName}
          setInput={setBankName}
          error={bankNameError}
          setError={setBankNameError}
          errorMessage={"Invalid bank name"}
          validation={validateName}
          maxLength={256}
          placeholder="Bank name"
        />
        <FormInput
          ref={inputRefs.current[3]}
          title="Branch name"
          input={branchName}
          setInput={setBranchName}
          error={branchNameError}
          setError={setBranchNameError}
          errorMessage={"Invalid branch name"}
          validation={validateName}
          maxLength={256}
          placeholder="Branch name"
        />
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
  addButton: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: "#33aefc",
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
});
