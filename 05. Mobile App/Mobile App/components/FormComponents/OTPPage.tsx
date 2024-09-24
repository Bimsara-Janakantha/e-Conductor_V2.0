import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import { useState, useEffect } from "react";
import { Pressable } from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemedText } from "../CommonModules/ThemedText";
import { ThemedView } from "../CommonModules/ThemedView";
import { validateOTP } from "./FormFunctions";
import { FormInput } from "./FormInputField";
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
  const [otpError, setOTPError] = useState(false);
  const [isTimeOut, setIsTimeOut] = useState(false);
  const [isTimerPlaying, setIsTimerPlaying] = useState(true);
  const [keyVal, setKeyVal] = useState(0);

  interface RequestOTPResponse {
    error?: string;
    success?: string;
  }

  interface VerifyOTPResponse {
    error?: string;
    success?: string;
    verified?: boolean;
  }

  // Make "Back" button visible and hide "Next" button
  useEffect(() => {
    if (currentPos == 300) {
      setBackVisible(true);
      setNextVisible(false);
    }
  }, [currentPos]);

  //   // Move forward if OTP is correct
  //   useEffect(() => {
  //     if (!otpError && otp != "") {
  //       nextAction();
  //     }
  //   }, [otp, otpError]);

  // Enable "Resend OTP" button
  function enableResendOTPButton() {
    setIsTimeOut(true);
    setIsTimerPlaying(false);
  }

  // Function to get an OTP
  const requestOTP = async (email: string, mobile: string): Promise<void> => {
    try {
      const response = await axios.post<RequestOTPResponse>(
        `${baseURL}/mobileAPI/entry/otp`,
        {
          type: "requestOTP", // Request type for generating OTP
          data: {
            email,
            mobile,
          },
        }
      );

      if (response.data.error) {
        console.error("Error requesting OTP:", response.data.error);
      } else {
        console.log("OTP requested successfully:", response.data.success);
        setIsTimerPlaying(true);
        setKeyVal(keyVal + 1);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.message);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        } else if (error.request) {
          console.error("Request data:", error.request);
        } else {
          console.error("Error message:", error.message);
        }
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  // Function to verify OTP
  const verifyOTP = async (email: string, value: string): Promise<void> => {
    try {
      const response = await axios.post<VerifyOTPResponse>(
        `${baseURL}/mobileAPI/entry/otp`,
        {
          type: "verifyOTP", // Request type for verifying OTP
          data: {
            email,
            value, // OTP entered by the user
          },
        }
      );

      if (response.data.error) {
        console.error("Error verifying OTP:", response.data.error);
      } else if (response.data.verified === true) {
        console.log("OTP verified successfully"); // Handle successful OTP verification
        nextAction();
      } else {
        console.log("OTP verification failed");
        // Handle OTP verification failure
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.message);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        } else if (error.request) {
          console.error("Request data:", error.request);
        } else {
          console.error("Error message:", error.message);
        }
      } else {
        console.error("Unexpected error:", error);
      }
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
        placeholder="000000"
      />
      {isTimeOut && !isTimerPlaying && (
        <Pressable
          style={formStyles.resendOTPButton}
          onPress={() => requestOTP(email, phoneNo)}
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
          onPress={() => verifyOTP(email, otp)}
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
