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
import {
  FormDropdown,
  FormInput,
} from "../../components/FormComponents/FormInputField";
import {
  validateLicenseNo,
  validateNIC,
  validateNTCNo,
} from "../../components/FormComponents/FormFunctions";
import calculateBirthday from "../../components/CommonModules/CalculateBirthday";
import axios from "axios";
import Modal from "react-native-modal";
import { ThemedView } from "../../components/CommonModules/ThemedView";

type Props = {
  isVisible: boolean;
  onClose: (event?: GestureResponderEvent) => void;
};

export default function OpeSignupModal({ isVisible, onClose }: Props) {
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
    credits,
    operatorAcc,
    ownerAcc,
    setOperatorAcc,
    setOwnerAcc,
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
  const [_ntcLicenseNo, _setNTCLicenseNo] = useState<string>("");
  const [_driverLicenseNo, _setDriverLicenseNo] = useState<string>("");
  const [_occupation, _setOccupation] = useState<string>("");
  const occupations = [
    { label: "Driver", value: "Driver" },
    { label: "Conductor", value: "Conductor" },
    { label: "Both", value: "Both" },
  ];
  const [nicError, setNICError] = useState(false);
  const [ntcError, setNTCError] = useState(false);
  const [licenseNoError, setLicenseNoError] = useState(false);
  const [filled, setFilled] = useState(false);
  const inputRefs = useRef(
    Array.from({ length: 4 }, () => React.createRef<TextInput>())
  );

  //================================================ Functions ===============================================//

  // Update user data in the database and redirect to the correct dashboard
  function pressSubmit() {
    updateUserInfo();
    onClose();
  }

  //================================================ Backend Calls ===============================================//

  // Function to insert a new user
  const updateUserInfo = async () => {
    const userData = {
      userType: "employee",
      empType: _occupation,
      fName: fName,
      lName: lName,
      email: email,
      mobile: phoneNo,
      nic: _nic,
      birthDay: calculateBirthday(_nic),
      ntc: _ntcLicenseNo,
      licence: _driverLicenseNo,
      accName: accHolderName,
      accNo: accountNo,
      bank: bankName,
      branch: branchName,
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
      !ntcError &&
      _ntcLicenseNo != "" &&
      _occupation != ""
    ) {
      if (_occupation == "Conductor") {
        setFilled(true);
      } else if (!licenseNoError && _driverLicenseNo != "") {
        setFilled(true);
      } else {
        setFilled(false);
      }
    } else {
      setFilled(false);
    }
  }, [_nic, _ntcLicenseNo, _driverLicenseNo, _occupation]);

  useEffect(() => {
    _setNIC("");
    _setNTCLicenseNo("");
    _setOccupation("");
    _setDriverLicenseNo("");
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
            You don't have a bus opetator account. Sign up here to create one
          </ThemedText>
        </View>

        <FormInput
          ref={inputRefs.current[0]}
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
        <FormDropdown
          title="Occupation"
          input={_occupation}
          setInput={_setOccupation}
          dataList={occupations}
          placeholder="Select occupation"
        />
        <FormInput
          ref={inputRefs.current[1]}
          nextFocus={inputRefs.current[2]}
          title="NTC License Number"
          input={_ntcLicenseNo}
          setInput={_setNTCLicenseNo}
          error={ntcError}
          setError={setNTCError}
          errorMessage={"Invalid NTC license number"}
          validation={validateNTCNo}
          maxLength={7}
          placeholder="A-00000"
        />
        {(_occupation == "Driver" || _occupation == "Both") && (
          <FormInput
            ref={inputRefs.current[2]}
            title="Driver's License Number"
            input={_driverLicenseNo}
            setInput={_setDriverLicenseNo}
            error={licenseNoError}
            setError={setLicenseNoError}
            errorMessage={"Invalid driver's license number"}
            validation={validateLicenseNo}
            maxLength={8}
            placeholder="A0000000"
          />
        )}
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
