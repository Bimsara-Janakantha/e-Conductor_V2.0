import { StyleSheet, Pressable, ImageBackground, Keyboard } from "react-native";
import { Href, Link, router } from "expo-router";
import { useState, useEffect } from "react";
import Animated, { useAnimatedRef } from "react-native-reanimated";

import { ThemedText } from "@/components/CommonModules/ThemedText";
import { ThemedView } from "@/components/CommonModules/ThemedView";
import FontAwesome from "@expo/vector-icons/build/FontAwesome";
import { LogInFormPage1 } from "@/components/FormComponents/LoginForm";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import { OTPPage } from "@/components/FormComponents/OTPPage";

var formPageCount = 2;
const formPageWidth = 300;

export default function LogIn() {
  const {
    baseURL,
    phoneNo,
    email,
    myAccTypes,
    occupation,
    setID,
    setFName,
    setLName,
    setPhoneNo,
    setEmail,
    setNIC,
    setAccountNo,
    setAccHolderName,
    setBankName,
    setBranchName,
    setNameOnLicense,
    setNTCLicenseNo,
    setDriverLicenseNo,
    setOccupation,
  } = useAppContext();

  const [otp, setOTP] = useState("");
  const [currentPos, setCurrentPos] = useState(0);
  const [backVisible, setBackVisible] = useState(false);
  const [nextVisible, setNextVisible] = useState(false);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  let otpRequested = false; // Add a flag to track OTP request status

  interface RequestOTPResponse {
    error?: string;
    success?: string;
  }

  const scrollForward = async () => {
    if (scrollRef.current) {
      if (currentPos === 0 && !otpRequested) {
        // Check the flag before requesting OTP
        const userInfo = await getUserInfo(phoneNo);
        if (!userInfo) {
          console.error("Failed to retrieve user info, stopping scroll.");
          return; // Stop scrolling if user info retrieval fails
        } else {
          try {
            await requestOTP(email, phoneNo); // Await requestOTP to ensure it completes
            otpRequested = true; // Set the flag to true after requesting OTP
          } catch (error) {
            console.error("Failed to send OTP:", error);
            return; // Stop scrolling if OTP request fails
          }
        }
      }
      let newPos =
        currentPos < formPageCount * formPageWidth
          ? currentPos + formPageWidth
          : formPageCount * formPageWidth;
      scrollRef.current.scrollTo({ x: newPos, y: 0, animated: true });
      setCurrentPos(newPos);
    }
  };

  function scrollBack() {
    if (scrollRef.current) {
      let newPos = currentPos > 0 ? currentPos - formPageWidth : 0;
      scrollRef.current.scrollTo({ x: newPos, y: 0, animated: true });
      setCurrentPos(newPos);
    }
  }

  function goToDashboard() {
    if (myAccTypes.get("Owner")) {
      router.replace("/(drawerOwn)/home/dashboard" as Href<string>);
    } else if (myAccTypes.get("Operator")) {
      router.replace("/(drawerOpe)/home/dashboard" as Href<string>);
    } else {
      router.replace("/(drawerPas)/home/dashboard" as Href<string>);
    }
  }

  // Hide form navigation button at first and last page
  useEffect(() => {
    if (currentPos == 0) {
      setBackVisible(false);
    } else if (currentPos == formPageCount * formPageWidth) {
      Keyboard.dismiss();
      setBackVisible(false);
      setNextVisible(false);
    }
  }, [currentPos]);

  // Function to get user data by phone number
  const getUserInfo = async (phoneNumber: string): Promise<any | null> => {
    try {
      const response = await axios.post(`${baseURL}/mobileAPI/user/info`, {
        type: "reqestInfo",
        data: phoneNumber,
      });

      if (response.data.error) {
        console.error("Error fetching user info:", response.data.error);
        return null;
      } else {
        console.log("User info retrieved successfully:", response.data);
        const userInfo = response.data;

        // Update app context state variables with the retrieved user info
        setID(userInfo.userID || "");
        setFName(userInfo.fName || "");
        setLName(userInfo.lName || "");
        setPhoneNo(userInfo.mobile || "");
        setEmail(userInfo.email || "");
        setNIC(userInfo.nic || "");
        setAccountNo(userInfo.accNo || "");
        setAccHolderName(userInfo.accName || "");
        setBankName(userInfo.bank || "");
        setBranchName(userInfo.branch || "");
        setNameOnLicense(userInfo.nameOnLicense || "");
        setNTCLicenseNo(userInfo.ntc || "");
        setDriverLicenseNo(userInfo.licence || "");
        setOccupation(userInfo.empType || "");

        if (occupation != "" && userInfo.userType == "owner") {
          myAccTypes.set("Owner", true);
          myAccTypes.set("Operator", true);
        } else if (userInfo.userType == "employee") {
          myAccTypes.set("Operator", true);
        } else {
          myAccTypes.set("Passenger", true);
        }

        return userInfo; // Return the user info
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null; // Return null in case of an error
    }
  };

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
        scrollForward();
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
    <ThemedView style={styles.pageBody} lightColor="#fff" darkColor="#222">
      <ImageBackground
        source={require("@/assets/images/main_bg.png")}
        style={styles.backgroundImage}
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="header1" lightColor="#33aefc" darkColor="#33aefc">
            Log In
          </ThemedText>
        </ThemedView>

        {/*********************************************************** Log in form *********************************************************************/}
        <ThemedView style={styles.formBody}>
          <Animated.ScrollView
            ref={scrollRef}
            scrollEventThrottle={16}
            horizontal={true}
            style={{ width: formPageWidth }}
            contentContainerStyle={styles.formPageContainer}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            pointerEvents={"box-none"}
          >
            <Animated.View style={styles.formPage}>
              <LogInFormPage1
                phoneNo={phoneNo}
                setPhoneNo={setPhoneNo}
                setNextVisible={setNextVisible}
                setBackVisible={setBackVisible}
                currentPos={currentPos}
              />
            </Animated.View>
            <Animated.View style={styles.formPage}>
              <OTPPage
                otp={otp}
                setOTP={setOTP}
                nextAction={goToDashboard}
                setNextVisible={setNextVisible}
                setBackVisible={setBackVisible}
                currentPos={currentPos}
              />
            </Animated.View>
          </Animated.ScrollView>
        </ThemedView>

        {/************************************************* Form Navigation Buttons (Next & Back) ********************************************************/}
        <ThemedView style={styles.formNavContainer}>
          {backVisible && (
            <Pressable style={styles.formBackButton} onPress={scrollBack}>
              <ThemedText
                type="subtitle"
                lightColor="#1cba"
                darkColor="#11aadd"
              >
                <FontAwesome name="chevron-left" size={20} /> Back{" "}
              </ThemedText>
            </Pressable>
          )}
          {nextVisible && (
            <Pressable style={styles.formNextButton} onPress={scrollForward}>
              <ThemedText
                type="subtitle"
                lightColor="#a1aadd"
                darkColor="#a1aadd"
              >
                {" "}
                Next <FontAwesome name="chevron-right" size={20} />
              </ThemedText>
            </Pressable>
          )}
        </ThemedView>

        {/*********************************************************** Footer **********************************************************************/}
        {currentPos == 0 && (
          <ThemedView style={styles.footer}>
            <ThemedText lightColor="#aaa" darkColor="#aaa">
              Don't have an account?{" "}
              <Link href={"/signup"}>
                <ThemedText lightColor="#28b1de" darkColor="#2eccff">
                  Sign Up
                </ThemedText>
              </Link>
            </ThemedText>
          </ThemedView>
        )}
      </ImageBackground>
    </ThemedView>
  );
}

// const styles = StyleSheet.create({
//   pageBody: {
//     flex: 1,
//   },
//   backgroundImage: {
//     flex: 1,
//   },
//   image: {
//     width: "100%",
//     height: "32%",
//     marginTop: "25%",
//   },
//   formPageContainer: {
//     alignContent: "center",
//   },
//   signInTypeContainer: {
//     backgroundColor: "transparent",
//     alignSelf: "center",
//   },
//   signInTypeButton: {
//     borderWidth: 0,
//     color: "#fff",
//     borderRadius: 50,
//     paddingVertical: 10,
//     paddingHorizontal: 40,
//     marginVertical: 5,
//     backgroundColor: "#169af5",
//     alignItems: "center",
//     elevation: 3,
//   },
//   formPage: {
//     width: formPageWidth,
//     alignItems: "center",
//     backgroundColor: "transparent",
//     padding: 0,
//   },
//   formBackButton: {
//     position: "absolute",
//     left: 0,
//     backgroundColor: "transparent",
//   },
//   formNextButton: {
//     position: "absolute",
//     right: 0,
//     backgroundColor: "transparent",
//   },
//   formBody: {
//     backgroundColor: "transparent",
//     height: "55%",
//     margin: 10,
//     borderRadius: 10,
//     padding: 10,
//     alignSelf: "center",
//   },
//   tncBody: {
//     width: formPageWidth,
//     alignItems: "center",
//     backgroundColor: "#fff",
//     padding: 0,
//   },
//   titleContainer: {
//     backgroundColor: "transparent",
//     padding: 10,
//     marginTop: 90,
//     alignItems: "center",
//   },
//   footer: {
//     backgroundColor: "transparent",
//     position: "absolute",
//     bottom: 150,
//     alignSelf: "center",
//   },
//   submitButton: {
//     borderWidth: 0,
//     color: "#fff",
//     borderRadius: 50,
//     padding: 10,
//     marginBottom: 5,
//     backgroundColor: "#ff8b2e",
//     alignItems: "center",
//   },
//   modelButton: {
//     borderWidth: 0,
//     color: "#fff",
//     borderRadius: 50,
//     padding: 10,
//     marginBottom: 5,
//     backgroundColor: "#2ededa",
//     alignItems: "center",
//   },
//   formNavContainer: {
//     width: formPageWidth,
//     flexDirection: "row",
//     alignSelf: "center",
//     alignItems: "center",
//     justifyContent: "space-around",
//   },
//   buttonBody: {
//     alignItems: "center",
//     backgroundColor: "#ff8b2e",
//     marginVertical: 10,
//     marginHorizontal: 20,
//     paddingVertical: 5,
//     borderRadius: 20,
//   },
// });

const styles = StyleSheet.create({
  // Page structure
  pageBody: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },

  // Form container styles
  formBody: {
    height: "55%",
    margin: 10,
    borderRadius: 10,
    padding: 10,
    alignSelf: "center",
    backgroundColor: "transparent",
  },
  formPageContainer: {
    alignContent: "center",
  },
  formPage: {
    width: formPageWidth,
    alignItems: "center",
    padding: 0,
    backgroundColor: "transparent",
  },

  // Form navigation buttons
  formBackButton: {
    position: "absolute",
    left: 0,
    backgroundColor: "transparent",
  },
  formNextButton: {
    position: "absolute",
    right: 0,
    backgroundColor: "transparent",
  },
  formNavContainer: {
    width: formPageWidth,
    flexDirection: "row",
    justifyContent: "space-around",
    alignSelf: "center",
    alignItems: "center",
  },

  // Title and Footer
  titleContainer: {
    padding: 10,
    marginTop: 90,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  footer: {
    position: "absolute",
    bottom: 150,
    alignSelf: "center",
    backgroundColor: "transparent",
  },

  // Button styles
  buttonBody: {
    backgroundColor: "#ff8b2e",
    marginVertical: 10,
    marginHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 20,
    alignItems: "center",
  },
  signInTypeButton: {
    backgroundColor: "#169af5",
    paddingVertical: 10,
    paddingHorizontal: 40,
    marginVertical: 5,
    borderRadius: 50,
    alignItems: "center",
    elevation: 3,
  },
  submitButton: {
    backgroundColor: "#ff8b2e",
    padding: 10,
    marginBottom: 5,
    borderRadius: 50,
    alignItems: "center",
  },
  modelButton: {
    backgroundColor: "#2ededa",
    padding: 10,
    marginBottom: 5,
    borderRadius: 50,
    alignItems: "center",
  },
});
