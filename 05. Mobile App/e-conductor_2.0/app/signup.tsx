import {
  Image,
  StyleSheet,
  Pressable,
  Keyboard,
  ImageBackground,
  Alert,
} from "react-native";
import FontAwesome from "@expo/vector-icons/build/FontAwesome";
import { Switch } from "react-native-switch";
import axios from "axios";
import { Href, Link, router } from "expo-router";
import { useState, useEffect } from "react";
import Animated, { useAnimatedRef } from "react-native-reanimated";

import { useAppContext } from "../context/AppContext";
import { ThemedText } from "../components/CommonModules/ThemedText";
import { ThemedView } from "../components/CommonModules/ThemedView";
import {
  PassengerFormPage1,
} from "../components/FormComponents/PassengerForm";
import {
  OperatorFormPage1,
  OperatorFormPage2,
} from "../components/FormComponents/OperatorForm";
import {
  OwnerFormPage1,
  OwnerFormPage2,
} from "../components/FormComponents/OwnerForm";
import calculateBirthday from "../components/CommonModules/CalculateBirthday";
import PrivacyModal from "./modals/privacyModal";
import TermsModal from "./modals/termsModal";
import { OTPPage } from "../components/FormComponents/OTPPage";

var formPageCount = 2; // Excluding the common "Sign up as a passenger, operator or owner" form page
const formPageWidth = 320;

export default function SignUp() {
  const {
    baseURL,
    accountType,
    fName,
    lName,
    phoneNo,
    email,
    nic,
    accountNo,
    accHolderName,
    bankName,
    branchName,
    ntcLicenseNo,
    driverLicenseNo,
    occupation,
    setAccountType,
    setFName,
    setLName,
    setPhoneNo,
    setEmail,
    setNIC,
    setAccountNo,
    setAccHolderName,
    setBankName,
    setBranchName,
    setNTCLicenseNo,
    setDriverLicenseNo,
    setOccupation,
  } = useAppContext();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const [passenger, setPassenger] = useState(true);
  const [operator, setOperator] = useState(false);
  const [owner, setOwner] = useState(false);
  const [otp, setOTP] = useState("");
  const [agree, setAgree] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [currentPos, setCurrentPos] = useState(0);
  const [backVisible, setBackVisible] = useState(false);
  const [nextVisible, setNextVisible] = useState(false);
  const [displayPrivacyModal, setDisplayPrivacyModal] = useState(false);
  const [displayTermsModal, setDisplayTermsModal] = useState(false);
  const [otpRequested, setOTPRequested] = useState(false);

  //================================================ Functions ===============================================//

  // Scroll to the next form page
  async function scrollForward() {
    if (scrollRef.current) {
      if (currentPos == formPageWidth) {
        const isNewUser = await handleCheckAvailability(); // Await the result of availability check

        if (!isNewUser) {
          return;
        }
      }

      let otpSendingPosition = (formPageCount - 1) * formPageWidth;

      if (currentPos == otpSendingPosition && !otpRequested) {
        try {
          await requestOTP(); // Await requestOTP to ensure it completes
          setOTPRequested(true); // Set the flag to true after requesting OTP
        } catch (error) {
          console.error("Failed to request an OTP:", error);
          Alert.alert("Error", "Failed to request an OTP");
          return; // Stop scrolling if OTP request fails
        }
      }

      let newPos =
        currentPos <= formPageCount * formPageWidth
          ? currentPos + formPageWidth
          : formPageCount * formPageWidth;

      scrollRef.current.scrollTo({ x: newPos, y: 0, animated: true });
      setCurrentPos(newPos);
    }
  }

  // Scroll to the previous form page
  function scrollBack() {
    if (scrollRef.current) {
      setOTPRequested(false);
      let newPos = currentPos > 0 ? currentPos - formPageWidth : 0;
      scrollRef.current.scrollTo({ x: newPos, y: 0, animated: true });
      setCurrentPos(newPos);
    }
  }

  // Prepare for a new sign up
  function pressSignUpType(signUptype: string) {
    setOTPRequested(false);
    setFName("");
    setLName("");
    setPhoneNo("");
    setEmail("");
    setNIC("");
    setAccountNo("");
    setAccHolderName("");
    setBankName("");
    setBranchName("");
    setNTCLicenseNo("");
    setDriverLicenseNo("");
    setOccupation("");
    setOTP("");

    setPassenger(false);
    setOperator(false);
    setOwner(false);

    switch (signUptype) {
      case "passenger":
        setPassenger(true);
        setAccountType("passenger");
        formPageCount = 2;
        break;
      case "operator":
        setOperator(true);
        setAccountType("employee");
        formPageCount = 3;
        break;
      case "owner":
        setOwner(true);
        setAccountType("owner");
        formPageCount = 3;
        break;
    }

    scrollForward();
  }

  async function pressSubmit() {
    try {
      const response = await insertNewUser(); // Ensure insertNewUser is async and returns a promise

      if (response && response.status === 201) {
        // Only navigate on successful registration
        router.replace("/login");
      } else {
        console.error("Registration error:", "Registration failed");
        Alert.alert(
          "Registration failed",
          "Please check your details and try again."
        );
      }
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert("Error", "Failed to register user. Please try again.");
    }
  }

  //================================================ Backend Calls ===============================================//

  const handleCheckAvailability = async () => {
    if (!email || !phoneNo) {
      Alert.alert("Error", "Please enter both email and phone number.");
      return false; // Return false if required fields are missing
    }
  
    try {
      const requestData = {
        data: {
          email,
          mobile: phoneNo,  // Updated to match backend field 'mobile'
        },
      };
  
      // Sending data to the backend
      const response = await axios.post(`${baseURL}/users/req2`, requestData);
  
      // Checking the response format with success and message
      if (response.data.success) {
        return true;
      } else {
        Alert.alert("Unavailable", response.data.message);
        return false;
      }
    } catch (error) {
      console.error("Error checking availability: ", error);
      Alert.alert("Error", "Failed to check user availability.");
      return false;
    }
  };
  
  // Function to request OTP
  const requestOTP = async () => {
    try {
      const response = await axios.post(`${baseURL}/otp/request`, {
        data: { email, mobile: phoneNo, origin: "Verify email & mobile" },
      });
      if (response.status === 201) {
        Alert.alert("OTP sent", "Please check your email or mobile");
        setOTPRequested(true);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to request OTP");
    }
  };

  // Function to insert a new user
  const insertNewUser = async () => {
    const userData = {
      userType: accountType,
      empType: occupation,
      fName: fName,
      lName: lName,
      email: email,
      mobile: phoneNo,
      nic: nic,
      birthDay: calculateBirthday(nic),
      ntc: ntcLicenseNo,
      licence: driverLicenseNo,
      accName: accHolderName,
      accNo: accountNo,
      bank: bankName,
      branch: branchName,
    };

    try {
      const response = await axios.post(`${baseURL}/users/req3`, {
        data: userData,
      });
      return response; // Return the response
    } catch (error) {
      console.error("Registration error:", error);
      throw error; // Throw the error to handle it in pressSubmit
    }
  };

  //================================================ Use Effects ===============================================//

  // Hide form navigation button at first and last page
  useEffect(() => {
    if (currentPos == 0) {
      setBackVisible(false);
      setNextVisible(false);
    } else if (currentPos == formPageCount * formPageWidth) {
      Keyboard.dismiss();
      setBackVisible(true);
      setNextVisible(false);
      setShowSubmit(false);
    } else if (currentPos > formPageCount * formPageWidth) {
      Keyboard.dismiss();
      setBackVisible(false);
      setNextVisible(false);
      setShowSubmit(true);
    }
  }, [currentPos]);

  //================================================ UI Control ===============================================//

  return (
    <ThemedView style={styles.pageBody} lightColor="#fff" darkColor="#222">
      <ImageBackground
        source={require("../assets/images/main_bg.png")}
        style={styles.backgroundImage}
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="header1" lightColor="#33aefc" darkColor="#33aefc">
            Sign Up
          </ThemedText>
        </ThemedView>

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
            {/******** Sign up as a passenger, operator or owner form page ******************/}
            <Animated.View style={styles.formPage}>
              <Image
                source={require("../assets/images/People waiting for bus at bus stop.png")}
                style={styles.image}
              />
              <ThemedView style={styles.signInTypeContainer}>
                <Pressable
                  style={[
                    styles.signInTypeButton,
                    { backgroundColor: "#a9afff" },
                  ]}
                  onTouchStart={() => {}}
                  onPress={() => pressSignUpType("passenger")}
                  pointerEvents={"auto"}
                >
                  <ThemedText
                    type="subtitle"
                    lightColor="#fff"
                    darkColor="#fff"
                  >
                    Sign up as a passenger
                  </ThemedText>
                </Pressable>
                <Pressable
                  style={[
                    styles.signInTypeButton,
                    { backgroundColor: "#8fafff" },
                  ]}
                  onPress={() => pressSignUpType("operator")}
                  pointerEvents={"auto"}
                >
                  <ThemedText
                    type="subtitle"
                    lightColor="#fff"
                    darkColor="#fff"
                  >
                    Sign up as a bus operator
                  </ThemedText>
                </Pressable>
                <Pressable
                  style={[
                    styles.signInTypeButton,
                    { backgroundColor: "#6fafff" },
                  ]}
                  onPress={() => pressSignUpType("owner")}
                  pointerEvents={"auto"}
                >
                  <ThemedText
                    type="subtitle"
                    lightColor="#fff"
                    darkColor="#fff"
                  >
                    Sign up as a bus owner
                  </ThemedText>
                </Pressable>
              </ThemedView>
            </Animated.View>

            {/********************* Passenger form pages ************************************/}
            {passenger && (
              <Animated.View style={styles.formPage}>
                <PassengerFormPage1
                  fname={fName}
                  setFName={setFName}
                  lname={lName}
                  setLName={setLName}
                  phoneNo={phoneNo}
                  setPhoneNo={setPhoneNo}
                  email={email}
                  setEmail={setEmail}
                  setNextVisible={setNextVisible}
                  setBackVisible={setBackVisible}
                  currentPos={currentPos}
                />
              </Animated.View>
            )}
            {passenger && (
              <Animated.View style={styles.formPage}>
                <OTPPage
                  otp={otp}
                  setOTP={setOTP}
                  nextAction={scrollForward}
                  setNextVisible={setNextVisible}
                  setBackVisible={setBackVisible}
                  currentPos={currentPos}
                />
              </Animated.View>
            )}

            {/********************** Operator form pages **************************************/}
            {operator && (
              <Animated.View style={styles.formPage}>
                <OperatorFormPage1
                  fname={fName}
                  setFName={setFName}
                  lname={lName}
                  setLName={setLName}
                  phoneNo={phoneNo}
                  setPhoneNo={setPhoneNo}
                  email={email}
                  setEmail={setEmail}
                  nic={nic}
                  setNIC={setNIC}
                  setNextVisible={setNextVisible}
                  setBackVisible={setBackVisible}
                  currentPos={currentPos}
                />
              </Animated.View>
            )}
            {operator && (
              <Animated.View style={styles.formPage}>
                <OperatorFormPage2
                  ntcLicenseNo={ntcLicenseNo}
                  setNTCLicenseNo={setNTCLicenseNo}
                  driverLicenseNo={driverLicenseNo}
                  setDriverLicenseNo={setDriverLicenseNo}
                  occupation={occupation}
                  setOccupation={setOccupation}
                  setNextVisible={setNextVisible}
                  setBackVisible={setBackVisible}
                  currentPos={currentPos}
                />
              </Animated.View>
            )}
            {operator && (
              <Animated.View style={styles.formPage}>
                <OTPPage
                  otp={otp}
                  setOTP={setOTP}
                  nextAction={scrollForward}
                  setNextVisible={setNextVisible}
                  setBackVisible={setBackVisible}
                  currentPos={currentPos}
                />
              </Animated.View>
            )}

            {/************************* Owner form pages *************************************/}
            {owner && (
              <Animated.View style={styles.formPage}>
                <OwnerFormPage1
                  fname={fName}
                  setFName={setFName}
                  lname={lName}
                  setLName={setLName}
                  phoneNo={phoneNo}
                  setPhoneNo={setPhoneNo}
                  email={email}
                  setEmail={setEmail}
                  nic={nic}
                  setNIC={setNIC}
                  setNextVisible={setNextVisible}
                  setBackVisible={setBackVisible}
                  currentPos={currentPos}
                />
              </Animated.View>
            )}
            {owner && (
              <Animated.View style={styles.formPage}>
                <OwnerFormPage2
                  accountNo={accountNo}
                  setAccountNo={setAccountNo}
                  accHolderName={accHolderName}
                  setAccHolderName={setAccHolderName}
                  bankName={bankName}
                  setBankName={setBankName}
                  branchName={branchName}
                  setBranchName={setBranchName}
                  setNextVisible={setNextVisible}
                  setBackVisible={setBackVisible}
                  currentPos={currentPos}
                />
              </Animated.View>
            )}
            {owner && (
              <Animated.View style={styles.formPage}>
                <OTPPage
                  otp={otp}
                  setOTP={setOTP}
                  nextAction={scrollForward}
                  setNextVisible={setNextVisible}
                  setBackVisible={setBackVisible}
                  currentPos={currentPos}
                />
              </Animated.View>
            )}

            {/********************** Terms and Conditions form pages **************************/}
            <Animated.View style={styles.formPage}>
              <ThemedView
                style={{ marginTop: 80, backgroundColor: "transparent" }}
              >
                <Pressable
                  style={styles.modelButton}
                  onPress={() => setDisplayTermsModal(true)}
                >
                  <ThemedText
                    type="subtitle"
                    lightColor="#fff"
                    darkColor="#fff"
                  >
                    Read Terms and Conditions
                  </ThemedText>
                </Pressable>
                <Pressable
                  style={styles.modelButton}
                  onPress={() => setDisplayPrivacyModal(true)}
                >
                  <ThemedText
                    type="subtitle"
                    lightColor="#fff"
                    darkColor="#fff"
                  >
                    Read Privacy Policies
                  </ThemedText>
                </Pressable>
              </ThemedView>
              <ThemedView
                style={{
                  flexDirection: "row",
                  marginVertical: 30,
                  gap: 15,
                  marginHorizontal: 40,
                  backgroundColor: "transparent",
                }}
              >
                <ThemedText>
                  I agree to the Privacy Policy and Terms and Conditions{" "}
                </ThemedText>
                <Switch
                  barHeight={25}
                  switchWidthMultiplier={1.8}
                  circleSize={25}
                  value={agree}
                  onValueChange={() => setAgree(!agree)}
                  activeText=""
                  inActiveText=""
                  backgroundActive="#11aadd"
                  backgroundInactive="#aaa"
                  circleActiveColor="#fff"
                  circleInActiveColor="#fff"
                  circleBorderActiveColor="#11aadd"
                  circleBorderInactiveColor="#aaa"
                />
              </ThemedView>
            </Animated.View>
          </Animated.ScrollView>
        </ThemedView>

        {/*************************** Form Navigation Buttons (Next & Back) ********************/}
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
                Next <FontAwesome name="chevron-right" size={20} />
              </ThemedText>
            </Pressable>
          )}
        </ThemedView>

        {/************************************* Submit button **********************************/}
        {showSubmit && (
          <ThemedView style={styles.footer}>
            <Pressable
              style={[
                styles.submitButton,
                agree && { backgroundColor: "#1eceda" },
              ]}
              disabled={!agree}
              onPress={pressSubmit}
            >
              <ThemedText type="subtitle" lightColor="#fff" darkColor="#fff">
                Sign Up
              </ThemedText>
            </Pressable>
          </ThemedView>
        )}
        {currentPos == 0 && (
          <ThemedView
            style={{ alignSelf: "center", backgroundColor: "transparent" }}
          >
            <ThemedText lightColor="#aaa" darkColor="#aaa">
              Already have an account?{" "}
              <Link
                href={"/login"}
                onPress={() => router.replace("/login")}
              >
                <ThemedText lightColor="#28b1de" darkColor="#2eccff">
                  Log In
                </ThemedText>
              </Link>
            </ThemedText>
          </ThemedView>
        )}
      </ImageBackground>

      <PrivacyModal
        isVisible={displayPrivacyModal}
        onClose={() => setDisplayPrivacyModal(false)}
      />
      <TermsModal
        isVisible={displayTermsModal}
        onClose={() => setDisplayTermsModal(false)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  pageBody: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: "32%",
    marginTop: "25%",
  },
  formPageContainer: {
    alignContent: "center",
  },
  signInTypeContainer: {
    backgroundColor: "transparent",
    alignSelf: "center",
  },
  signInTypeButton: {
    borderWidth: 0,
    color: "#fff",
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginVertical: 5,
    backgroundColor: "#169af5",
    alignItems: "center",
    elevation: 3,
  },
  formPage: {
    width: formPageWidth,
    alignItems: "center",
    backgroundColor: "transparent",
  },
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
  formBody: {
    backgroundColor: "transparent",
    height: "58%",
    margin: 10,
    borderRadius: 10,
    padding: 10,
    alignSelf: "center",
  },
  tncBody: {
    width: formPageWidth,
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 0,
  },
  titleContainer: {
    backgroundColor: "transparent",
    padding: 10,
    marginTop: 90,
    alignItems: "center",
  },
  footer: {
    backgroundColor: "transparent",
    position: "absolute",
    bottom: 150,
    alignSelf: "center",
  },
  submitButton: {
    alignItems: "center",
    backgroundColor: "gray",
    marginVertical: 7,
    paddingHorizontal: 60,
    paddingVertical: 10,
    borderRadius: 30,
  },
  modelButton: {
    borderWidth: 0,
    color: "#fff",
    borderRadius: 50,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#aaaacc",
    alignItems: "center",
  },
  formNavContainer: {
    width: formPageWidth,
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "space-around",
  },
  buttonBody: {
    alignItems: "center",
    backgroundColor: "#ff8b2e",
    marginVertical: 10,
    marginHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 20,
  },
});
