import { useState, useEffect, useRef } from "react";
import {
  GestureHandlerRootView,
  TextInput,
} from "react-native-gesture-handler";
import {
  validateName,
  validatePhoneNo,
  validateNIC,
  validateNTCNo,
  validateLicenseNo,
  validateEmail,
} from "./FormFunctions";
import { FormDropdown, FormInput } from "./FormInputField";
import React from "react";

/********************************************************** Personal Info Page ***********************************************************/

const formPageWidth = 320;

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
    Array.from({ length: 5 }, () => React.createRef<TextInput>())
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
    if (currentPos == formPageWidth) {
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
    if (currentPos == formPageWidth * 2) {
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
