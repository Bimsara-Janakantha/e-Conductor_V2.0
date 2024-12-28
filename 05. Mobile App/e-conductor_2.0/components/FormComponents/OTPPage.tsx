import { useAppContext } from "../../context/AppContext";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Alert, Pressable, TextInput, View, StyleSheet, useColorScheme } from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemedText } from "../CommonModules/ThemedText";
import { ThemedView } from "../CommonModules/ThemedView";
import { formStyles } from "./FormStyles";

export const OTPPage = ({
  otp,
  setOTP,
  nextAction,
  setNextVisible,
  setBackVisible,
  currentPos,
}: any) => {
  const { baseURL, phoneNo, email } = useAppContext();
  const theme = useColorScheme() ?? "light";
  const [otpError, setOTPError] = useState(false);
  const [isTimeOut, setIsTimeOut] = useState(false);
  const [isTimerPlaying, setIsTimerPlaying] = useState(true);
  const [keyVal, setKeyVal] = useState(0);

  const [otpArray, setOtpArray] = useState(Array(6).fill(''));
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    const newOtpArray = [...otpArray]; // Create a new array to maintain immutability
    newOtpArray[index] = text; // Set the new value
    setOtpArray(newOtpArray); // Update the state

    // Update the full OTP string
    setOTP(newOtpArray.join(''));

    // Move focus logic
    if (text && index < inputs.current.length - 1) {
      inputs.current[index + 1]?.focus();
    }
    console.log("OTP: ",otp, "index: ", index);
  };
  
  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === 'Backspace' && index > 0 && !otpArray[index]) {
      console.log(`Backspace detected at index ${index}`);
      inputs.current[index - 1]?.focus();
    }
  };
  
  
  // Make "Back" button visible and hide "Next" button
  useEffect(() => {
    setKeyVal(keyVal + 1);
    setIsTimerPlaying(true);
  }, [currentPos]);

  // Enable "Resend OTP" button
  function enableResendOTPButton() {
    setIsTimeOut(true);
    setIsTimerPlaying(false);
  }

  // Function to request OTP
  const requestOTP = async () => {
    try {
      const response = await axios.post(`${baseURL}/otp/request`, {
        data: { email, mobile: phoneNo, origin: "Verify email & mobile" },
      });
      if (response.status === 201) {
        Alert.alert("OTP sent", "Please check your email or mobile");
        setIsTimerPlaying(true);
        setKeyVal(keyVal + 1);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to request OTP");
    }
  };

  // Function to verify OTP
  const verifyOTP = async () => {
    try {
      const response = await axios.post(`${baseURL}/otp/verify`, {
        data: { email, mobile: phoneNo, value: otp, origin: "Mobile" },
      });
      if (response.data.success) {
        Alert.alert("Success", "OTP verified successfully");
        nextAction();
      } else {
        Alert.alert("Failure", "Invalid OTP");
      }      
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to verify OTP");
    }
  };

  return (
    <GestureHandlerRootView>
      <ThemedView style={formStyles.timer}>
        <CountdownCircleTimer
          key={keyVal}
          isPlaying={isTimerPlaying}
          size={150}
          duration={180}
          colors={["#0cf", "#0cf"]}
          colorsTime={[120, 0]}
          onComplete={() => {
            enableResendOTPButton();
          }}
        >
          {({ remainingTime }) => <ThemedText>{remainingTime}</ThemedText>}
        </CountdownCircleTimer>
      </ThemedView>

      <View style={styles.otpContainer}>
        {otpArray.map((digit, index) => (
          <TextInput
            key={index}
            value={otpArray[index]}
            ref={(ref) => (inputs.current[index] = ref)}
            style={[styles.input,{color: theme == "dark" ? "#fff" : "#5f5f5f", borderColor: theme == "dark" ? "#fff" : "#9f9f9f"}]}
            keyboardType="number-pad"
            maxLength={1}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(event) => handleKeyPress(event, index)}
          />
        ))}
      </View>

      {isTimeOut && !isTimerPlaying && (
        <Pressable
          style={formStyles.resendOTPButton}
          onPress={requestOTP}
          pointerEvents={"auto"}
        >
          <ThemedText type="subtitle" lightColor="#fff" darkColor="#fff">
            Resend OTP
          </ThemedText>
        </Pressable>
      )}
      {(!isTimeOut || isTimerPlaying) && (
        <Pressable
          style={formStyles.resendOTPButton}
          onPress={verifyOTP}
          pointerEvents={"auto"}
        >
          <ThemedText type="subtitle" lightColor="#fff" darkColor="#fff">
            Done
          </ThemedText>
        </Pressable>
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  input: {
    width: 40,
    height: 50,
    marginHorizontal: 3,
    borderWidth: 2,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold'
  },
});
