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
} from "./FormFunctions";
import { formStyles } from "./FormStyles";
import { FormInput } from "./FormInputField";
import React from "react";
import axios from "axios";
import { useAppContext } from "@/context/AppContext";

/********************************************************** Personal Info Page ***********************************************************/

export const LogInFormPage1 = ({
  phoneNo,
  setPhoneNo,
  setNextVisible,
  setBackVisible,
  currentPos,
}: any) => {
  const [phoneNoError, setPhoneNoError] = useState(false);
  const inputRefs = useRef(
    Array.from({ length: 3 }, () => React.createRef<TextInput>())
  );

  // Make "Next" button visible
  useEffect(() => {
    if (!phoneNoError && phoneNo != "") {
      setNextVisible(true);
    } else {
      setNextVisible(false);
    }
  }, [phoneNo, currentPos]);

  // Make "Back" button visible
  useEffect(() => {
    if (currentPos == 0) {
      setBackVisible(true);
    }
  }, [currentPos]);

  return (
    <GestureHandlerRootView>
      <FormInput
        ref={inputRefs.current[0]}
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
    </GestureHandlerRootView>
  );
};

// /**************************************************************** OTP Page *******************************************************************/

// export const LogInFormPage2 = ({
//   otp,
//   setOTP,
//   nextAction,
//   setNextVisible,
//   setBackVisible,
//   currentPos,
// }: any) => {
//   const { baseURL, phoneNo, email } = useAppContext();
//   const [otpError, setOTPError] = useState(false);
//   const [isTimeOut, setIsTimeOut] = useState(false);
//   const [isTimerPlaying, setIsTimerPlaying] = useState(true);
//   const [keyVal, setKeyVal] = useState(0);

//   interface RequestOTPResponse {
//     error?: string;
//     success?: string;
//   }

//   interface VerifyOTPResponse {
//     error?: string;
//     success?: string;
//     verified?: boolean;
//   }

//   // Make "Back" button visible and hide "Next" button
//   useEffect(() => {
//     if (currentPos == 300) {
//       requestOTP(email, phoneNo);
//       setBackVisible(true);
//       setNextVisible(false);
//     }
//   }, [currentPos]);

//   // Move forward if OTP is correct
//   useEffect(() => {
//     if (!otpError && otp != "") {
//       nextAction();
//     }
//   }, [otp, otpError]);

//   // Enable "Resend OTP" button
//   function enableResendOTPButton() {
//     setIsTimeOut(true);
//     setIsTimerPlaying(false);
//   }

//   // Function to get an OTP
//   const requestOTP = async (email: string, mobile: string): Promise<void> => {
//     try {
//       const response = await axios.post<RequestOTPResponse>(
//         `${baseURL}/mobileAPI/entry/otp`,
//         {
//           type: "requestOTP", // Request type for generating OTP
//           data: {
//             email,
//             mobile,
//           },
//         }
//       );

//       if (response.data.error) {
//         console.error("Error requesting OTP:", response.data.error);
//       } else {
//         console.log("OTP requested successfully:", response.data.success);
//         setIsTimerPlaying(true);
//         setKeyVal(keyVal + 1);
//       }
//     } catch (error) {
//       console.error("Error requesting OTP:", error);
//     }
//   };

//   // Function to verify OTP
//   const verifyOTP = async (email: string, otp: string): Promise<void> => {
//     try {
//       const response = await axios.post<VerifyOTPResponse>(
//         `${baseURL}/mobileAPI/entry/otp`,
//         {
//           type: "verifyOTP", // Request type for verifying OTP
//           data: {
//             email,
//             value: otp, // OTP entered by the user
//           },
//         }
//       );

//       if (response.data.error) {
//         console.error("Error verifying OTP:", response.data.error);
//       } else if (response.data.verified === true) {
//         console.log("OTP verified successfully");
//         // Handle successful OTP verification (e.g., navigate user to the next step)
//       } else {
//         console.log("OTP verification failed");
//         // Handle OTP verification failure (e.g., show error message to user)
//       }
//     } catch (error) {
//       console.error("Error verifying OTP:", error);
//     }
//   };

//   return (
//     <GestureHandlerRootView>
//       <ThemedView style={formStyles.timer}>
//         <CountdownCircleTimer
//           key={keyVal}
//           isPlaying={isTimerPlaying}
//           size={150}
//           duration={120}
//           colors={["#0cf", "#0cf", "#c33"]}
//           colorsTime={[120, 60, 0]}
//           onComplete={() => {
//             enableResendOTPButton();
//           }}
//         >
//           {({ remainingTime }) => <ThemedText>{remainingTime}</ThemedText>}
//         </CountdownCircleTimer>
//       </ThemedView>

//       <FormInput
//         title="Enter the OTP"
//         input={otp}
//         setInput={setOTP}
//         error={otpError}
//         setError={setOTPError}
//         errorMessage={"Incorrect OTP"}
//         validation={validateOTP}
//         maxLength={6}
//         keyboardType="number-pad"
//         placeholder="000 000"
//       />
//       {isTimeOut && !isTimerPlaying && (
//         <Pressable
//           style={formStyles.resendOTPButton}
//           onPress={() => requestOTP(email, phoneNo)}
//           pointerEvents={"auto"}
//         >
//           <ThemedText type="subtitle" lightColor="#fff" darkColor="#fff">
//             Resend OTP
//           </ThemedText>
//         </Pressable>
//       )}
//     </GestureHandlerRootView>
//   );
// };
