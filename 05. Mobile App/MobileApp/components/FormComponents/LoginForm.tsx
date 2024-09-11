import {Pressable} from "react-native";
import { useState , useEffect, useRef} from "react";
import { GestureHandlerRootView, TextInput } from "react-native-gesture-handler";
import { ThemedText } from '@/components/CommonModules/ThemedText';
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { ThemedView } from "../CommonModules/ThemedView";
import { validateName , validatePhoneNo , validateNIC , validateOTP} from "./FormFunctions";
import { formStyles } from "./FormStyles";
import { FormInput } from "./FormInputField";
import React from "react";

/********************************************************** Personal Info Page ***********************************************************/

export const LogInFormPage1 = ({fname, setFName, phoneNo, setPhoneNo, setNextVisible, setBackVisible, currentPos}: any) => {
  const [fnameError, setFnameError] = useState(false);
  const [phoneNoError, setPhoneNoError] = useState(false);
  const inputRefs = useRef(Array.from({ length: 3 }, () => React.createRef<TextInput>()));

  // Make "Next" button visible
  useEffect (() => {
    if (!fnameError && !phoneNoError && fname != '' && phoneNo != '') {
      setNextVisible(true);
    } else {
      setNextVisible(false);
    }
  }, [fname, phoneNo, currentPos]);

  // Make "Back" button visible
  useEffect (() => {
    if (currentPos == 0) {
      setBackVisible(true);
    }
  }, [currentPos]);
  
  return (
    <GestureHandlerRootView>
      <FormInput ref={inputRefs.current[0]} nextFocus={inputRefs.current[1]} title="First Name" input={fname} setInput={setFName} error={fnameError} setError={setFnameError} errorMessage={'Invalid first name'} validation={validateName} maxLength={256} placeholder="John" />
      <FormInput ref={inputRefs.current[1]} title="Phone Number" input={phoneNo} setInput={setPhoneNo} error={phoneNoError} setError={setPhoneNoError} errorMessage={'Invalid phone number'} keyboardType='number-pad' validation={validatePhoneNo} maxLength={10} placeholder="Phone number" />
    </GestureHandlerRootView>
  );
}


/**************************************************************** OTP Page *******************************************************************/

export const LogInFormPage2 = ({otp, setOTP, nextAction, setNextVisible, setBackVisible, currentPos}: any) => {
  const [otpError, setOTPError] = useState(false);
  const [isTimeOut, setIsTimeOut] = useState(false);
  const [isTimerPlaying, setIsTimerPlaying] = useState(true);
  const [keyVal, setKeyVal] = useState(0);

  // Make "Back" button visible and hide "Next" button
  useEffect (() => {
    if (currentPos == 300) {
      sendOTP();
      setBackVisible(true);
      setNextVisible(false);
    }
  }, [currentPos]);

  // Move forward if OTP is correct
  useEffect (() => {
    if (!otpError && otp != '') {
      nextAction();
    }
  }, [otp, otpError]);

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

      <FormInput title="Enter the OTP" input={otp} setInput={setOTP} error={otpError} setError={setOTPError} errorMessage={'Incorrect OTP'} validation={validateOTP} maxLength={6} keyboardType='number-pad' placeholder="000 000" />
      {isTimeOut && !isTimerPlaying && <Pressable style={formStyles.resendOTPButton} onPress={sendOTP} pointerEvents={'auto'}><ThemedText type="subtitle" lightColor="#fff" darkColor="#fff">Resend OTP</ThemedText></Pressable>}
    </GestureHandlerRootView>
  );
}