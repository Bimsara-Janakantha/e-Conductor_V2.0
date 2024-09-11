import {
  Image,
  StyleSheet,
  Pressable,
  Keyboard,
  ImageBackground,
} from "react-native";
import { Href, Link, router } from "expo-router";
import { useState, useEffect } from "react";
import Animated, { useAnimatedRef } from "react-native-reanimated";

import { ThemedText } from "@/components/CommonModules/ThemedText";
import { ThemedView } from "@/components/CommonModules/ThemedView";
import {
  PassengerFormPage1,
  PassengerFormPage2,
} from "@/components/FormComponents/PassengrForm";
import {
  OperatorFormPage1,
  OperatorFormPage2,
  OperatorFormPage3,
} from "@/components/FormComponents/OperatorForm";
import {
  OwnerFormPage1,
  OwnerFormPage2,
  OwnerFormPage3,
} from "@/components/FormComponents/OwnerForm";
import FontAwesome from "@expo/vector-icons/build/FontAwesome";
import { Switch } from "react-native-switch";

var formPageCount = 3; // Excluding the common "Sign up as a passenger, employee or owner" form page
const formPageWidth = 300;
var passenger = true;
var employee = false;
var owner = false;

export default function SignUp() {
  const [fname, setFName] = useState("");
  const [lname, setLName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [nic, setNIC] = useState("");

  const [accountNo, setAccountNo] = useState("");
  const [accHolderName, setAccHolderName] = useState("");
  const [bankName, setBankName] = useState("");
  const [branchName, setBranchName] = useState("");

  const [nameOnLicense, setNameOnLicense] = useState("");
  const [ntcLicenseNo, setNTCLicenseNo] = useState("");
  const [driverLicenseNo, setDriverLicenseNo] = useState("");
  const [occupation, setOccupation] = useState("");

  const [otp, setOTP] = useState("");
  const [agree, setAgree] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);

  const [loading, setLoading] = useState(false);

  // Submitting form /////////////////////////////////////////////////////////////////////////////////

  // const handleSubmit = async () => {
  //   if (nameOnLicense === '' || phoneNo === '' || dateOfBirth === '') {
  //     // Please fill the form completely
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     const response = await fetch('http://localhost/api/users' , {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({nameOnLicense, phoneNo, dateOfBirth}),
  //     });

  //     const result = await response.json();

  //     if (response.ok) {
  //       setNameOnLicense('');
  //       setPhoneNo('');
  //       setDateOfBirth('');
  //     }
  //   } catch (error) {
  //     //Error
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Submitting form /////////////////////////////////////////////////////////////////////////////////

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const [currentPos, setCurrentPos] = useState(0);
  const [backVisible, setBackVisible] = useState(false);
  const [nextVisible, setNextVisible] = useState(false);

  function scrollFroward() {
    if (scrollRef.current) {
      let newPos =
        currentPos < formPageCount * formPageWidth
          ? currentPos + formPageWidth
          : formPageCount * formPageWidth;
      scrollRef.current.scrollTo({ x: newPos, y: 0, animated: true });
      setCurrentPos(newPos);
    }
  }

  function scrollBack() {
    if (scrollRef.current) {
      let newPos = currentPos > 0 ? currentPos - formPageWidth : 0;
      scrollRef.current.scrollTo({ x: newPos, y: 0, animated: true });
      setCurrentPos(newPos);
    }
  }

  function clearInputFields() {
    setFName("");
    setLName("");
    setPhoneNo("");
    setNIC("");
    setAccountNo("");
    setAccHolderName("");
    setBankName("");
    setBranchName("");
    setNameOnLicense("");
    setNTCLicenseNo("");
    setDriverLicenseNo("");
    setOccupation("");
    setOTP("");
  }

  function passengerSignUp() {
    clearInputFields();
    passenger = true;
    employee = false;
    owner = false;
    formPageCount = 3;
    scrollFroward();
  }

  function employeeSignUp() {
    clearInputFields();
    passenger = false;
    employee = true;
    owner = false;
    formPageCount = 4;
    scrollFroward();
  }

  function ownerSignUp() {
    clearInputFields();
    passenger = false;
    employee = false;
    owner = true;
    formPageCount = 4;
    scrollFroward();
  }

  function submitForm() {
    router.navigate("/(drawerOwn)/home/dashboard" as Href<string>);
  }

  function acceptTerms() {
    setAgree(!agree);
  }

  function openTermsAndConditions() {
    router.navigate("/modals/termsModal" as Href<string>);
  }

  function openPrivacyPolicy() {
    router.navigate("/modals/privacyModal" as Href<string>);
  }

  // Hide form navigation button at first and last page
  useEffect(() => {
    if (currentPos == 0) {
      setBackVisible(false);
      setNextVisible(false);
    } else if (currentPos == formPageCount * formPageWidth) {
      Keyboard.dismiss();
      setBackVisible(false);
      setNextVisible(false);
      setShowSubmit(true);
    }
  }, [currentPos]);

  // // Checking if keyboard appeared or not
  // useEffect (() => {
  //   const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {setKeyboardShow(true)});
  //   const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {setKeyboardShow(false)});
  //   return () => {keyboardDidShowListener.remove(); keyboardDidHideListener.remove();}
  // }, []);

  return (
    <ThemedView style={styles.pageBody} lightColor="#fff" darkColor="#222">
      <ImageBackground
        source={require("@/assets/images/main_bg.png")}
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
            {/******** Sign up as a passenger, employee or owner form page ******************/}
            <Animated.View style={styles.formPage}>
              <Image
                source={require("@/assets/images/People waiting for bus at bus stop.png")}
                style={styles.image}
              />
              <ThemedView style={styles.signInTypeContainer}>
                <Pressable
                  style={[
                    styles.signInTypeButton,
                    { backgroundColor: "#a9afff" },
                  ]}
                  onTouchStart={() => {}}
                  onPress={passengerSignUp}
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
                  onPress={employeeSignUp}
                  pointerEvents={"auto"}
                >
                  <ThemedText
                    type="subtitle"
                    lightColor="#fff"
                    darkColor="#fff"
                  >
                    Sign up as an employee
                  </ThemedText>
                </Pressable>
                <Pressable
                  style={[
                    styles.signInTypeButton,
                    { backgroundColor: "#6fafff" },
                  ]}
                  onPress={ownerSignUp}
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
                  fname={fname}
                  setFName={setFName}
                  lname={lname}
                  setLName={setLName}
                  phoneNo={phoneNo}
                  setPhoneNo={setPhoneNo}
                  setNextVisible={setNextVisible}
                  setBackVisible={setBackVisible}
                  currentPos={currentPos}
                />
              </Animated.View>
            )}
            {passenger && (
              <Animated.View style={styles.formPage}>
                <PassengerFormPage2
                  otp={otp}
                  setOTP={setOTP}
                  nextAction={scrollFroward}
                  setNextVisible={setNextVisible}
                  setBackVisible={setBackVisible}
                  currentPos={currentPos}
                />
              </Animated.View>
            )}

            {/********************** Employee form pages **************************************/}
            {employee && (
              <Animated.View style={styles.formPage}>
                <OperatorFormPage1
                  fname={fname}
                  setFName={setFName}
                  lname={lname}
                  setLName={setLName}
                  phoneNo={phoneNo}
                  setPhoneNo={setPhoneNo}
                  nic={nic}
                  setNIC={setNIC}
                  setNextVisible={setNextVisible}
                  setBackVisible={setBackVisible}
                  currentPos={currentPos}
                />
              </Animated.View>
            )}
            {employee && (
              <Animated.View style={styles.formPage}>
                <OperatorFormPage2
                  nameOnLicense={nameOnLicense}
                  setNameOnLicense={setNameOnLicense}
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
            {employee && (
              <Animated.View style={styles.formPage}>
                <OperatorFormPage3
                  otp={otp}
                  setOTP={setOTP}
                  nextAction={scrollFroward}
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
                  fname={fname}
                  setFName={setFName}
                  lname={lname}
                  setLName={setLName}
                  phoneNo={phoneNo}
                  setPhoneNo={setPhoneNo}
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
                <OwnerFormPage3
                  otp={otp}
                  setOTP={setOTP}
                  nextAction={scrollFroward}
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
                  onPress={openTermsAndConditions}
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
                  onPress={openPrivacyPolicy}
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
                  onValueChange={acceptTerms}
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
            <Pressable style={styles.formNextButton} onPress={scrollFroward}>
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

        {/************************************* Submit button **********************************/}
        {showSubmit && (
          <ThemedView style={styles.footer}>
            <Pressable
              style={[
                styles.submitButton,
                agree && { backgroundColor: "#1eceda" },
              ]}
              disabled={!agree}
              onPress={submitForm}
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
              <Link href={"/login"}>
                <ThemedText lightColor="#28b1de" darkColor="#2eccff">
                  Log In
                </ThemedText>
              </Link>
            </ThemedText>
          </ThemedView>
        )}
      </ImageBackground>
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
    paddingHorizontal: 40,
    marginVertical: 5,
    backgroundColor: "#169af5",
    alignItems: "center",
    elevation: 3,
  },
  formPage: {
    width: formPageWidth,
    alignItems: "center",
    backgroundColor: "transparent",
    padding: 0,
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
    height: "55%",
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
