import {
  Alert,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Href, router } from "expo-router";
import { useEffect, useRef, useState } from "react";

import { useAppContext } from "../../context/AppContext";
import { ThemedText } from "../../components/CommonModules/ThemedText";
import { FormInput } from "../../components/FormComponents/FormInputField";
import {
  validateAccountNo,
  validateBankName,
  validateBranchName,
  validateName,
  validateNIC,
} from "../../components/FormComponents/FormFunctions";
import calculateBirthday from "../../components/CommonModules/CalculateBirthday";
import axios from "axios";
import Modal from "react-native-modal";
import { ThemedView } from "../../components/CommonModules/ThemedView";

type Props = {
  isVisible: boolean;
  onClose: (event?: GestureResponderEvent) => void;
};

export default function OwnSignupModal({ isVisible, onClose }: Props) {
  const {
    baseURL,
    id,
    accountType,
    fName,
    lName,
    phoneNo,
    email,
    nic,
    accountNo,
    accHolderName,
    bankName,
    branchName,
    ntcLicenseNo,
    driverLicenseNo,
    occupation,
    ownerAcc,
    operatorAcc,
    setOwnerAcc,
    setOperatorAcc,
    setAccountType,
    setID,
    setCredits,
    setFName,
    setLName,
    setPhoneNo,
    setEmail,
    setNIC,
    setAccountNo,
    setAccHolderName,
    setBankName,
    setBranchName,
    setNTCLicenseNo,
    setDriverLicenseNo,
    setOccupation,
  } = useAppContext();
  const theme = useColorScheme() ?? "light";
  const [_nic, _setNIC] = useState<string>("");
  const [_accountNo, _setAccountNo] = useState<string>("");
  const [_accHolderName, _setAccHolderName] = useState<string>("");
  const [_bankName, _setBankName] = useState<string>("");
  const [_branchName, _setBranchName] = useState<string>("");
  const [nicError, setNICError] = useState(false);
  const [accNoError, setAccNoError] = useState(false);
  const [accHolderNameError, setAccHolderNameError] = useState(false);
  const [bankNameError, setBankNameError] = useState(false);
  const [branchNameError, setBranchNameError] = useState(false);
  const [filled, setFilled] = useState(false);
  const inputRefs = useRef(
    Array.from({ length: 7 }, () => React.createRef<TextInput>())
  );

  //================================================ Functions ===============================================//

  // Update user data in the database and redirect to the correct dashboard
  const pressSubmit = () => {
    updateUserInfo();
    onClose();
  };

  //================================================ Backend Calls ===============================================//

  // Function to insert a new user
  const updateUserInfo = async () => {
    const userData = {
      userType: "owner",
      empType: occupation,
      fName: fName,
      lName: lName,
      email: email,
      mobile: phoneNo,
      nic: _nic,
      birthDay: calculateBirthday(_nic),
      ntc: ntcLicenseNo,
      licence: driverLicenseNo,
      accName: _accHolderName,
      accNo: _accountNo,
      bank: _bankName,
      branch: _branchName,
      userID: id,
    };
  
    try {
      const response = await axios.post(`${baseURL}/users/req7`, {
        data: { userData },
      });
  
      if (response.status === 200) { // Check for 200 status code
        setOwnerAcc(true);
        const userInfo = await fetchUserInfo();
        if (!userInfo) {
          console.error("Failed to retrieve user info");
        } else {
          router.replace("/(drawerOwn)/home/dashboard");
          Alert.alert("Success", "User updated successfully!");
        }
      }
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", "Failed to update user. Please try again.");
    }
  };  

  // Fetch user data by user ID
  const fetchUserInfo = async (): Promise<any | null> => {
    try {
      const response = await axios.post(`${baseURL}/users/req5`, {
        data: phoneNo,
      });

      if (response.data.error) {
        console.error("Error fetching user info:", response.data.error);
        Alert.alert("Error", "User not found or an error occurred");
        return null;
      }

      const userInfo = response.data;

      // Check if userInfo exists and has expected fields
      if (!userInfo || !userInfo.userID) {
        console.warn("User does not exist or invalid user data returned");
        Alert.alert("Error", "User does not exist");
        return null;
      }

      // Set user info safely using optional chaining in case fields are missing
      setID(userInfo.userID || "");
      setFName(userInfo.fName || "");
      setLName(userInfo.lName || "");
      setPhoneNo(userInfo.mobile || "");
      setEmail(userInfo.email || "");
      setNIC(userInfo.nic || "");
      setAccountNo(userInfo.accNo || "");
      setAccHolderName(userInfo.accName || "");
      setBankName(userInfo.bank || "");
      setBranchName(userInfo.branch || "");
      setNTCLicenseNo(userInfo.ntc || "");
      setDriverLicenseNo(userInfo.licence || "");
      setOccupation(userInfo.empType || "");
      setCredits(userInfo.credits || 0);

      // Account type settings
      if (userInfo.userType === "owner") {
        setOwnerAcc(true);
      }
      if (userInfo.empType || userInfo.empType == "None") {
        setOperatorAcc(true);
      }

      return userInfo;
    } catch (error) {
      console.error("Error fetching user data:", error);
      Alert.alert("Error", "Failed to fetch user details");
      return null;
    }
  };

  //================================================ Use Effects ===============================================//

  // Check if all the fields are filled
  useEffect(() => {
    if (
      !nicError &&
      _nic != "" &&
      !accNoError &&
      !accHolderNameError &&
      !bankNameError &&
      !branchNameError &&
      _accountNo != "" &&
      _accHolderName != "" &&
      _bankName != "" &&
      _branchName != ""
    ) {
      setFilled(true);
    } else {
      setFilled(false);
    }
  }, [_nic, _accHolderName, _accountNo, _bankName, _branchName]);

  useEffect(() => {
    _setNIC("");
    _setAccountNo("");
    _setAccHolderName("");
    _setBankName("");
    _setBranchName("");
  }, []);

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
      <ThemedView
        style={{
          justifyContent: "center",
          paddingTop: 30,
          padding: 15,
          backgroundColor: theme === "dark" ? "#555" : "#fff",
          borderRadius: 20,
        }}
      >
        <View style={{ marginBottom: 10 }}>
          <ThemedText type="h6" lightColor="#1ebffa" darkColor="#1ecefa">
            You don't have a bus owner account. Sign up here to create one
          </ThemedText>
        </View>

        <FormInput
          ref={inputRefs.current[3]}
          title="NIC"
          input={_nic}
          setInput={_setNIC}
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
          input={_accountNo}
          setInput={_setAccountNo}
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
          input={_accHolderName}
          setInput={_setAccHolderName}
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
          input={_bankName}
          setInput={_setBankName}
          error={bankNameError}
          setError={setBankNameError}
          errorMessage={"Invalid bank name"}
          validation={validateBankName}
          maxLength={256}
          placeholder="Bank name"
        />
        <FormInput
          ref={inputRefs.current[3]}
          title="Branch name"
          input={_branchName}
          setInput={_setBranchName}
          error={branchNameError}
          setError={setBranchNameError}
          errorMessage={"Invalid branch name"}
          validation={validateBranchName}
          maxLength={256}
          placeholder="Branch name"
        />
        <Pressable
          style={[
            styles.submitButton,
            filled && { backgroundColor: "#1eceda" },
          ]}
          disabled={!filled}
          onPress={pressSubmit}
        >
          <ThemedText type="subtitle" lightColor="#fff" darkColor="#fff">
            Sign Up
          </ThemedText>
        </Pressable>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  pageBody: {
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
