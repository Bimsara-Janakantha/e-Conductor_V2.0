import { useState, useEffect, useRef } from "react";
import {
  GestureHandlerRootView,
  TextInput,
} from "react-native-gesture-handler";
import {
  validateName,
  validatePhoneNo,
  validateNIC,
  validateAccountNo,
  validateBankName,
  validateBranchName,
  validateEmail,
} from "./FormFunctions";
import { FormInput } from "./FormInputField";
import React from "react";

/********************************************************** Personal Info Page ***********************************************************/

const formPageWidth = 320;

export const OwnerFormPage1 = ({
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

/********************************************************** Bank Details Page ***********************************************************/

export const OwnerFormPage2 = ({
  accountNo,
  setAccountNo,
  accHolderName,
  setAccHolderName,
  bankName,
  setBankName,
  branchName,
  setBranchName,
  setNextVisible,
  setBackVisible,
  currentPos,
}: any) => {
  const [accNoError, setAccNoError] = useState(false);
  const [accHolderNameError, setAccHolderNameError] = useState(false);
  const [bankNameError, setBankNameError] = useState(false);
  const [branchNameError, setBranchNameError] = useState(false);
  const inputRefs = useRef(
    Array.from({ length: 4 }, () => React.createRef<TextInput>())
  );

  // Make "Next" button visible
  useEffect(() => {
    if (
      !accNoError &&
      !accHolderNameError &&
      !bankNameError &&
      !branchNameError &&
      accountNo != "" &&
      accHolderName != "" &&
      bankName != "" &&
      branchName != ""
    ) {
      setNextVisible(true);
    } else {
      setNextVisible(false);
    }
  }, [accHolderName, accountNo, bankName, branchName, currentPos]);

  // Make "Back" button visible
  useEffect(() => {
    if (currentPos == formPageWidth * 2) {
      setBackVisible(true);
    }
  }, [currentPos]);

  return (
    <GestureHandlerRootView>
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
        validation={validateBankName}
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
        validation={validateBranchName}
        maxLength={256}
        placeholder="Branch name"
      />
    </GestureHandlerRootView>
  );
};