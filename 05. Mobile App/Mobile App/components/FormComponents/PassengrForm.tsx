import { StyleSheet , Pressable} from "react-native";
import { useState , useRef} from "react";
import { GestureHandlerRootView, TextInput } from "react-native-gesture-handler";
import { ThemedText } from '@/components/ThemedText';
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { ThemedView } from "../ThemedView";

export const PassengerFormPage1 = ({ name, setName, phoneNo, setPhoneNo, dateOfBirth, setDateOfBirth }: any) => {
  const [isNameValid, setIsNameValid] = useState(true);
  const [isPhoneNoValid, setIsPhoneNoValid] = useState(true);
  const [isDateOfBirthValid, setIsDateOfBirthValid] = useState(true);

  const validateName = (text: any) => {
    const regex = /^[a-z .]+$/i;
    if (text === '' || regex.test(text)) {
      setIsNameValid(true);
    }
    else {
      setIsNameValid(false);
    }
    setName(text)
  };

  const validatePhoneNo = (text: any) => {
    const regex = /^[0-9]+$/;
    if (text === '' || regex.test(text)) {
      setIsPhoneNoValid(true);
    }
    else {
      setIsPhoneNoValid(false);
    }
    setPhoneNo(text);
  };

  const validateDateOfBirth = (text: any) => {
    const regex = /^[0-9/]+$/;
    if (text === '' || regex.test(text)) {
      setIsDateOfBirthValid(true);
    }
    else {
      setIsDateOfBirthValid(false);
    }
    setDateOfBirth(text);
  };

  return (
    <GestureHandlerRootView>
      <ThemedText lightColor="#777" darkColor="#777">Full name with initials</ThemedText>
      <TextInput style={[styles.inputField, !isNameValid && styles.inputFieldInvalid]} value={name} placeholder="Enter your name: A.B.C. Perera" onChangeText={validateName} pointerEvents={'auto'}/>
      {!isNameValid && <ThemedText style={styles.formError}>an error message</ThemedText>}
      <ThemedText lightColor="#777" darkColor="#777">Phone number</ThemedText>
      <TextInput style={[styles.inputField, !isPhoneNoValid && styles.inputFieldInvalid]} value={phoneNo} placeholder="Enter your phone number: 0123456789" onChangeText={validatePhoneNo} pointerEvents={'auto'}/>
      {!isPhoneNoValid && <ThemedText style={styles.formError}>an error message</ThemedText>}
      <ThemedText lightColor="#777" darkColor="#777">Date of birth</ThemedText>
      <TextInput style={[styles.inputField, !isDateOfBirthValid && styles.inputFieldInvalid]} value={dateOfBirth} placeholder="Enter your date of birth:  DD/MM/YYYY" onChangeText={validateDateOfBirth} pointerEvents={'auto'}/>
      {!isDateOfBirthValid && <ThemedText style={styles.formError}>an error message</ThemedText>}
    </GestureHandlerRootView>
  );
}

export const PassengerFormPage2 = () => {
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
    }
  });