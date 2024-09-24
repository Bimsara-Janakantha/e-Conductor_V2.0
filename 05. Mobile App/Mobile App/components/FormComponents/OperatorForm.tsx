import { Pressable } from "react-native";
import { useState, useEffect, useRef } from "react";
import {
  GestureHandlerRootView,
  TextInput,
} from "react-native-gesture-handler";
import { ThemedText } from "@/components/CommonModules/ThemedText";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { ThemedView } from "../CommonModules/ThemedView";
import {
  validateName,
  validatePhoneNo,
  validateNIC,
  validateOTP,
  validateNTCNo,
  validateLicenseNo,
  validateEmail,
} from "./FormFunctions";
import { formStyles } from "./FormStyles";
import { FormDropdown, FormInput } from "./FormInputField";
import React from "react";

/********************************************************** Personal Info Page ***********************************************************/

export const OperatorFormPage1 = ({
  fname,
  setFName,
  lname,
  setLName,
  phoneNo,
  setPhoneNo,
  nic,
  setNIC,
  email,
  setEmail,
  setNextVisible,
  setBackVisible,
  currentPos,
}: any) => {
  const [fnameError, setFnameError] = useState(false);
  const [lnameError, setLnameError] = useState(false);
  const [phoneNoError, setPhoneNoError] = useState(false);
  const [nicError, setNICError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const inputRefs = useRef(
    Array.from({ length: 4 }, () => React.createRef<TextInput>())
  );

  // Make "Next" button visible
  useEffect(() => {
    if (
      !fnameError &&
      !lnameError &&
      !phoneNoError &&
      !nicError &&
      !emailError &&
      fname != "" &&
      lname != "" &&
      phoneNo != "" &&
      nic != "" &&
      email != ""
    ) {
      setNextVisible(true);
    } else {
      setNextVisible(false);
    }
  }, [fname, lname, phoneNo, nic, email, currentPos]);

  // Make "Back" button visible
  useEffect(() => {
    if (currentPos == 300) {
      setBackVisible(true);
    }
  }, [currentPos]);

  return (
    <GestureHandlerRootView>
      <FormInput
        ref={inputRefs.current[0]}
        nextFocus={inputRefs.current[1]}
        title="First Name"
        input={fname}
        setInput={setFName}
        error={fnameError}
        setError={setFnameError}
        errorMessage={"Invalid first name"}
        validation={validateName}
        maxLength={256}
        placeholder="John"
      />
      <FormInput
        ref={inputRefs.current[1]}
        nextFocus={inputRefs.current[2]}
        title="Last Name"
        input={lname}
        setInput={setLName}
        error={lnameError}
        setError={setLnameError}
        errorMessage={"Invalid last name"}
        validation={validateName}
        maxLength={256}
        placeholder="Doe"
      />
      <FormInput
        ref={inputRefs.current[2]}
        nextFocus={inputRefs.current[3]}
        title="Phone Number"
        input={phoneNo}
        setInput={setPhoneNo}
        error={phoneNoError}
        setError={setPhoneNoError}
        errorMessage={"Invalid phone number"}
        keyboardType="number-pad"
        validation={validatePhoneNo}
        maxLength={10}
        placeholder="Phone number"
      />
      <FormInput
        ref={inputRefs.current[3]}
        nextFocus={inputRefs.current[4]}
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
        ref={inputRefs.current[4]}
        title="Email Address"
        input={email}
        setInput={setEmail}
        error={emailError}
        setError={setEmailError}
        errorMessage={"Invalid email address"}
        validation={validateEmail}
        maxLength={256}
        placeholder="Email address"
      />
    </GestureHandlerRootView>
  );
};

/********************************************************** License Details Page ***********************************************************/

export const OperatorFormPage2 = ({
  nameOnLicense,
  setNameOnLicense,
  ntcLicenseNo,
  setNTCLicenseNo,
  driverLicenseNo,
  setDriverLicenseNo,
  occupation,
  setOccupation,
  setNextVisible,
  setBackVisible,
  currentPos,
}: any) => {
  const [licenseNameError, setLicenseNameError] = useState(false);
  const [ntcError, setNTCError] = useState(false);
  const [licenseNoError, setLicenseNoError] = useState(false);
  const inputRefs = useRef(
    Array.from({ length: 3 }, () => React.createRef<TextInput>())
  );

  const occupations = [
    { label: "Driver", value: "Driver" },
    { label: "Conductor", value: "Conductor" },
    { label: "Both", value: "Both" },
  ];

  // Make "Next" button visible
  useEffect(() => {
    if (!ntcError && ntcLicenseNo != "" && occupation != "") {
      if (occupation == "Conductor") {
        setNextVisible(true);
      } else if (
        !licenseNameError &&
        !licenseNoError &&
        nameOnLicense != "" &&
        driverLicenseNo != ""
      ) {
        setNextVisible(true);
      } else {
        setNextVisible(false);
      }
    } else {
      setNextVisible(false);
    }
  }, [nameOnLicense, ntcLicenseNo, driverLicenseNo, occupation, currentPos]);

  // Make "Back" button visible
  useEffect(() => {
    if (currentPos == 600) {
      setBackVisible(true);
    }
  }, [currentPos]);

  return (
    <GestureHandlerRootView>
      <FormDropdown
        title="Occupation"
        input={occupation}
        setInput={setOccupation}
        dataList={occupations}
        placeholder="Select occupation"
      />
      <FormInput
        ref={inputRefs.current[0]}
        nextFocus={inputRefs.current[1]}
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
          ref={inputRefs.current[1]}
          nextFocus={inputRefs.current[2]}
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
          ref={inputRefs.current[2]}
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
    </GestureHandlerRootView>
  );
};

/**************************************************************** OTP Page *******************************************************************/

export const OperatorFormPage3 = ({
  otp,
  setOTP,
  nextAction,
  setNextVisible,
  setBackVisible,
  currentPos,
}: any) => {
  const [otpError, setOTPError] = useState(false);
  const [isTimeOut, setIsTimeOut] = useState(false);
  const [isTimerPlaying, setIsTimerPlaying] = useState(true);
  const [keyVal, setKeyVal] = useState(0);

  // Make "Back" button visible and hide "Next" button
  useEffect(() => {
    if (currentPos == 900) {
      sendOTP();
      setBackVisible(true);
      setNextVisible(false);
    }
  }, [currentPos]);

  // Move forward if OTP is correct
  useEffect(() => {
    if (!otpError && otp != "") {
      nextAction();
    }
  }, [otp, otpError]);

  // Enable "Resend OTP" button
  function enableResendOTPButton() {
    setIsTimeOut(true);
    setIsTimerPlaying(false);
  }

  // Sends an OTP and starts the timer
  function sendOTP() {
    setIsTimerPlaying(true);
    setKeyVal(keyVal + 1);
    /*
      Send a new otp
    */
  }

  return (
    <GestureHandlerRootView>
      <ThemedView style={formStyles.timer}>
        <CountdownCircleTimer
          key={keyVal}
          isPlaying={isTimerPlaying}
          size={150}
          duration={120}
          colors={["#0cf", "#0cf", "#c33"]}
          colorsTime={[120, 60, 0]}
          onComplete={() => {
            enableResendOTPButton();
          }}
        >
          {({ remainingTime }) => <ThemedText>{remainingTime}</ThemedText>}
        </CountdownCircleTimer>
      </ThemedView>

      <FormInput
        title="Enter the OTP"
        input={otp}
        setInput={setOTP}
        error={otpError}
        setError={setOTPError}
        errorMessage={"Incorrect OTP"}
        validation={validateOTP}
        maxLength={6}
        keyboardType="number-pad"
        placeholder="000 000"
      />
      {isTimeOut && !isTimerPlaying && (
        <Pressable
          style={formStyles.resendOTPButton}
          onPress={sendOTP}
          pointerEvents={"auto"}
        >
          <ThemedText type="subtitle" lightColor="#fff" darkColor="#fff">
            Resend OTP
          </ThemedText>
        </Pressable>
      )}
    </GestureHandlerRootView>
  );
};
