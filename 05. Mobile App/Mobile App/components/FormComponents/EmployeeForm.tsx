import { Image, StyleSheet, Pressable } from "react-native";
import { Link, router } from "expo-router";
import { FormEvent, useState , useRef } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView, TextInput } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';
import axios from "axios";

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { View } from "react-native-reanimated/lib/typescript/Animated";
import { opacity } from "react-native-reanimated/lib/typescript/reanimated2/Colors";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";

const EmployeeFormPage1 = () => {
    const [isNameValid, setIsNameValid] = useState(true);
    const [isPhoneNoValid, setIsPhoneNoValid] = useState(true);
    const [isDateOfBirthValid, setIsDateOfBirthValid] = useState(true);
    const [input, setInput] = useState({})
  
    const validateName = (text: any) => {
      const regex = /^[a-z .]+$/i;
      if (text === '' || regex.test(text)) {
        setIsNameValid(true);
      }
      else {
        setIsNameValid(false);
      }
      setInput(text);
    };
  
    const validatePhoneNo = (text: any) => {
      const regex = /^[0-9]+$/;
      if (text === '' || regex.test(text)) {
        setIsPhoneNoValid(true);
      }
      else {
        setIsPhoneNoValid(false);
      }
      setInput(text);
    };
  
    const validateDateOfBirth = (text: any) => {
      const regex = /^[0-9/]+$/;
      if (text === '' || regex.test(text)) {
        setIsDateOfBirthValid(true);
      }
      else {
        setIsDateOfBirthValid(false);
      }
      setInput(text);
    };
  
    return (
      <GestureHandlerRootView>
        <ThemedText lightColor="#777" darkColor="#777">Full name with initials</ThemedText>
        <TextInput style={[styles.inputField, !isNameValid && styles.inputFieldInvalid]} placeholder="Enter your full name" onChangeText={validateName} pointerEvents={'auto'}/>
        {!isNameValid && <ThemedText style={styles.formError}>an error message</ThemedText>}
        <ThemedText lightColor="#777" darkColor="#777">Pnone number</ThemedText>
        <TextInput style={[styles.inputField, !isPhoneNoValid && styles.inputFieldInvalid]} placeholder="Enter your phone number" onChangeText={validatePhoneNo} pointerEvents={'auto'}/>
        {!isPhoneNoValid && <ThemedText style={styles.formError}>an error message</ThemedText>}
        <ThemedText lightColor="#777" darkColor="#777">NIC</ThemedText>
        <TextInput style={[styles.inputField, !isDateOfBirthValid && styles.inputFieldInvalid]} placeholder="Enter your NIC" onChangeText={validateDateOfBirth} pointerEvents={'auto'}/>
        {!isDateOfBirthValid && <ThemedText style={styles.formError}>an error message</ThemedText>}
      </GestureHandlerRootView>
    );
}

export const EmployeeFormPage2 = () => {
  const [isOTPValid, setIsOTPValid] = useState(true);
  const [isTimeOut, setIsTimeOut] = useState(false);
  const [isTimerPlaying, setIsTimerPlaying] = useState(true);
  const [keyVal, setKeyVal] = useState(0);
  const [input, setInput] = useState({})

  const validateOTP = (text: any) => {
    const regex = /^[0-9]+$/;
    if (text === '' || regex.test(text)) {
    setIsOTPValid(true);
    }
    else {
    setIsOTPValid(false);
    }
    setInput(text);
  };

  const enableResendOTPButton = () => {
    setIsTimeOut(true);
    setIsTimerPlaying(false);
  };

  const resendOTP = () => {
    setIsTimerPlaying(true);
    setKeyVal(keyVal + 1);
    /*
      Send a new OTP
    */
  };

  return (
    <GestureHandlerRootView>
      <ThemedView style={styles.timer}>
        <CountdownCircleTimer
          key={keyVal}
          isPlaying={isTimerPlaying}
          size={150}
          duration={12}
          colors={['#0cf', '#0cf' , '#c33']}
          colorsTime={[12, 6 , 0]}
          onComplete={() => { enableResendOTPButton(); return {shouldRepeat: isTimerPlaying} }}>
          {({remainingTime}) => <ThemedText>{remainingTime}</ThemedText>}
        </CountdownCircleTimer>
      </ThemedView>
      <ThemedText lightColor="#777" darkColor="#777">Enter the code</ThemedText>
      <TextInput style={[styles.inputField, !isOTPValid && styles.inputFieldInvalid]} onChangeText={validateOTP} pointerEvents={'auto'}/>
      {!isOTPValid && <ThemedText style={styles.formError}>an error message</ThemedText>}
      {isTimeOut && !isTimerPlaying && <Pressable style={styles.resendOTPButton} onPress={resendOTP} pointerEvents={'auto'}><ThemedText type="subtitle" lightColor="#fff" darkColor="#fff">Resend OTP</ThemedText></Pressable>}
    </GestureHandlerRootView>
  );
}

const EmployeeFormPage3 = () => {
    const [isNameValid, setIsNameValid] = useState(true);
    const [isPhoneNoValid, setIsPhoneNoValid] = useState(true);
    const [isOTPValid, setIsOTPValid] = useState(true);
    const [isDateOfBirthValid, setIsDateOfBirthValid] = useState(true);
    const [isNICValid, setIsNICValid] = useState(true);
    const [isAccountNoValid, setIsAccountNoValid] = useState(true);
    const [input, setInput] = useState({})

    const validateName = (text: any) => {
        const regex = /^[a-z .]+$/i;
        if (text === '' || regex.test(text)) {
        setIsNameValid(true);
        }
        else {
        setIsNameValid(false);
        }
        setInput(text);
    };

    const validatePhoneNo = (text: any) => {
        const regex = /^[0-9]+$/;
        if (text === '' || regex.test(text)) {
        setIsPhoneNoValid(true);
        }
        else {
        setIsPhoneNoValid(false);
        }
        setInput(text);
    };

    const validateOTP = (text: any) => {
        const regex = /^[0-9]+$/;
        if (text === '' || regex.test(text)) {
        setIsOTPValid(true);
        }
        else {
        setIsOTPValid(false);
        }
        setInput(text);
    };

    const validateDateOfBirth = (text: any) => {
        const regex = /^[0-9/]+$/;
        if (text === '' || regex.test(text)) {
        setIsDateOfBirthValid(true);
        }
        else {
        setIsDateOfBirthValid(false);
        }
        setInput(text);
    };

    const validateNIC = (text: any) => {
        const regex = /^[0-9v]+$/i;
        if (text === '' || regex.test(text)) {
        setIsNICValid(true);
        }
        else {
        setIsNICValid(false);
        }
        setInput(text);
    };

    const validateAccountNo = (text: any) => {
        const regex = /^[0-9-]+$/;
        if (text === '' || regex.test(text)) {
        setIsAccountNoValid(true);
        }
        else {
        setIsAccountNoValid(false);
        }
        setInput(text);
    };

    return (
        <GestureHandlerRootView>
            <ThemedText lightColor="#777" darkColor="#777">Full name with initials</ThemedText>
            <TextInput style={[styles.inputField, !isNameValid && styles.inputFieldInvalid]} placeholder="Enter your full name" onChangeText={validateName} pointerEvents={'auto'}/>
            {!isNameValid && <ThemedText style={styles.formError}>an error message</ThemedText>}
            <ThemedText lightColor="#777" darkColor="#777">NIC</ThemedText>
            <TextInput style={[styles.inputField, !isNICValid && styles.inputFieldInvalid]} placeholder="Enter your NIC" onChangeText={validateNIC} pointerEvents={'auto'}/>
            {!isNICValid && <ThemedText style={styles.formError}>an error message</ThemedText>}
            <ThemedText lightColor="#777" darkColor="#777">Pnone number</ThemedText>
            <TextInput style={[styles.inputField, !isPhoneNoValid && styles.inputFieldInvalid]} placeholder="Enter your phone number" onChangeText={validatePhoneNo} pointerEvents={'auto'}/>
            {!isPhoneNoValid && <ThemedText style={styles.formError}>an error message</ThemedText>}
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    formError: {
      color: 'red',
    },
    inputField: {
      width: 280,
      color: '#333',
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 5,
      marginBottom: 10,
      backgroundColor: '#fff',
      elevation: 3,
    },
    inputFieldInvalid: {
      width: 280,
      borderWidth: 2,
      borderColor: 'red',
      color: '#333',
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 5,
      backgroundColor: '#fff',
      elevation: 3,
    },
    timer: {
      alignSelf: 'center',
      backgroundColor: 'transparent',
    },
    resendOTPButton: {
      borderWidth: 0,
      color: '#fff',
      borderRadius: 50,
      padding: 10,
      backgroundColor: '#ff8b2e',
      margin: 10,
      alignItems: 'center',
    },
  });