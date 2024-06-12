import {Pressable} from "react-native";
import { useState , useEffect} from "react";
import { GestureHandlerRootView, TextInput } from "react-native-gesture-handler";
import { ThemedText } from '@/components/ThemedText';
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { ThemedView } from "../ThemedView";
import { validateName , validatePhoneNo, validateDateOfBirth , validateNIC , validateAccountNo , validateBankName , validateBranchName , validateOTP} from "./FormFunctions";
import { formStyles } from "./FormStyles";

/********************************************************** Personal Info Page ***********************************************************/

export const OwnerFormPage1 = ({ name, setName, phoneNo, setPhoneNo, dateOfBirth, setDateOfBirth, nic, setNIC, setNextVisible, setBackVisible, currentPos}: any) => {
  const [nameError, setNameError] = useState(false);
  const [phoneNoError, setPhoneNoError] = useState(false);
  const [dobError, setDOBError] = useState(false);
  const [nicError, setNICError] = useState(false);

  // Make "Next" button visible
  useEffect (() => {
    if (!nameError && !phoneNoError && !dobError && !nicError && name != '' && phoneNo != '' && dateOfBirth != '' && nic != '') {
      setNextVisible(true);
    } else {
      setNextVisible(false);
    }
  }, [name, phoneNo, dateOfBirth, nic, currentPos]);

  // Hide "Back" button
  useEffect (() => {
    if (currentPos == 0) {
      setBackVisible(false);
    }
  }, [currentPos]);

  return (
    <GestureHandlerRootView>
      <ThemedText lightColor="#777" darkColor="#777">Full name with initials</ThemedText>
      <TextInput style={[formStyles.inputField, nameError && formStyles.inputFieldInvalid]} value={name} placeholder="A.B.C. Perera" onChangeText={(text) => validateName(text, setName, setNameError)} pointerEvents={'auto'}/>
      {nameError && <ThemedText style={formStyles.formError}>an error message</ThemedText>}

      <ThemedText lightColor="#777" darkColor="#777">Phone number</ThemedText>
      <TextInput style={[formStyles.inputField, phoneNoError && formStyles.inputFieldInvalid]} value={phoneNo} placeholder="0123456789" onChangeText={(text) => validatePhoneNo(text, setPhoneNo, setPhoneNoError)} pointerEvents={'auto'}/>
      {phoneNoError && <ThemedText style={formStyles.formError}>an error message</ThemedText>}

      <ThemedText lightColor="#777" darkColor="#777">Date of birth</ThemedText>
      <TextInput style={[formStyles.inputField, dobError && formStyles.inputFieldInvalid]} value={dateOfBirth} placeholder="DD/MM/YYYY" onChangeText={(text) => validateDateOfBirth(text, setDateOfBirth, setDOBError)} pointerEvents={'auto'}/>
      {dobError && <ThemedText style={formStyles.formError}>an error message</ThemedText>}

      <ThemedText lightColor="#777" darkColor="#777">NIC</ThemedText>
      <TextInput style={[formStyles.inputField, nicError && formStyles.inputFieldInvalid]} value={nic} placeholder="NIC" onChangeText={(text) => validateNIC(text, setNIC, setNICError)} pointerEvents={'auto'}/>
      {nicError&& <ThemedText style={formStyles.formError}>an error message</ThemedText>}
    </GestureHandlerRootView>
  );
}



/********************************************************** Bank Details Page ***********************************************************/

export const OwnerFormPage2 = ({accountNo, setAccountNo, bankName, setBankName, branchName, setBranchName, setNextVisible, setBackVisible, currentPos}: any) => {
  const [accNoError, setAccNoError] = useState(false);
  const [bankNameError, setBankNameError] = useState(false);
  const [branchNameError, setBranchNameError] = useState(false);

  // Make "Next" button visible
  useEffect (() => {
    if (!accNoError && !bankNameError && !branchNameError && accountNo != '' && bankName != '' && branchName != '') {
      setNextVisible(true);
    } else {
      setNextVisible(false);
    }
  }, [accountNo, bankName, branchName, currentPos]);

  // Make "Back" button visible
  useEffect (() => {
    if (currentPos == 300) {
      setBackVisible(true);
    }
  }, [currentPos]);

  return (
    <GestureHandlerRootView>
      <ThemedText lightColor="#777" darkColor="#777">Account No</ThemedText>
      <TextInput style={[formStyles.inputField, accNoError && formStyles.inputFieldInvalid]} value={accountNo} placeholder="1234-5678-8765-4321" onChangeText={(text) => validateAccountNo(text, setAccountNo, setAccNoError)} pointerEvents={'auto'}/>
      {accNoError && <ThemedText style={formStyles.formError}>an error message</ThemedText>}

      <ThemedText lightColor="#777" darkColor="#777">Bank name</ThemedText>
      <TextInput style={[formStyles.inputField, bankNameError && formStyles.inputFieldInvalid]} value={bankName} placeholder="Bank name" onChangeText={(text) => validateBankName(text, setBankName, setBankNameError)} pointerEvents={'auto'}/>
      {bankNameError && <ThemedText style={formStyles.formError}>an error message</ThemedText>}

      <ThemedText lightColor="#777" darkColor="#777">Branch name</ThemedText>
      <TextInput style={[formStyles.inputField, branchNameError && formStyles.inputFieldInvalid]} value={branchName} placeholder="Branch name" onChangeText={(text) => validateBranchName(text, setBranchName, setBranchNameError)} pointerEvents={'auto'}/>
      {branchNameError && <ThemedText style={formStyles.formError}>an error message</ThemedText>}
    </GestureHandlerRootView>
  );
}



/**************************************************************** OTP Page *******************************************************************/

export const OwnerFormPage3 = ({otp, setOTP, setNextVisible, setBackVisible, currentPos}: any) => {
  const [otpError, setOTPError] = useState(false);
  const [isTimeOut, setIsTimeOut] = useState(false);
  const [isTimerPlaying, setIsTimerPlaying] = useState(true);
  const [keyVal, setKeyVal] = useState(0);
  const [input, setInput] = useState({});

  // Make "Back" button visible and hide "Next" button
  useEffect (() => {
    if (currentPos == 600) {
      sendOTP();
      setBackVisible(true);
      setNextVisible(false);
    }
  }, [currentPos]);

  // Enable "Resend OTP" button
  function enableResendOTPButton () {
    setIsTimeOut(true);
    setIsTimerPlaying(false);
  };

  // Sends an OTP and starts the timer
  function sendOTP () {
    setIsTimerPlaying(true);
    setKeyVal(keyVal + 1);
    /*
      Send a new otp
    */
  };

  return (
    <GestureHandlerRootView>
      <ThemedView style={formStyles.timer}>
        <CountdownCircleTimer
          key={keyVal}
          isPlaying={isTimerPlaying}
          size={150}
          duration={120}
          colors={['#0cf', '#0cf' , '#c33']}
          colorsTime={[120, 60 , 0]}
          onComplete={() => { enableResendOTPButton() }}>
          {({remainingTime}) => <ThemedText>{remainingTime}</ThemedText>}
        </CountdownCircleTimer>
      </ThemedView>

      <ThemedText lightColor="#777" darkColor="#777">Enter the code</ThemedText>
      <TextInput style={[formStyles.inputField, otpError && formStyles.inputFieldInvalid]} value={otp} onChangeText={(text) => validateOTP(text, setOTP, setOTPError)} pointerEvents={'auto'}/>
      {otpError && <ThemedText style={formStyles.formError}>an error message</ThemedText>}
      {isTimeOut && !isTimerPlaying && <Pressable style={formStyles.resendOTPButton} onPress={sendOTP} pointerEvents={'auto'}><ThemedText type="subtitle" lightColor="#fff" darkColor="#fff">Resend OTP</ThemedText></Pressable>}
    </GestureHandlerRootView>
  );
}