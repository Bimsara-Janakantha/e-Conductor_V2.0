import { StyleSheet, Pressable, ImageBackground, Keyboard, } from "react-native";
import { Href, Link, router } from "expo-router";
import { useState, useEffect } from "react";
import Animated, { useAnimatedRef } from "react-native-reanimated";

import { ThemedText } from "@/components/CommonModules/ThemedText";
import { ThemedView } from "@/components/CommonModules/ThemedView";
import FontAwesome from "@expo/vector-icons/build/FontAwesome";
import {
  LogInFormPage1,
  LogInFormPage2,
} from "@/components/FormComponents/LoginForm";

var formPageCount = 2;
const formPageWidth = 300;

export default function LogIn() {
  const [fname, setFName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");

  const [otp, setOTP] = useState("");

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

  function submitForm() {
    router.replace("/(drawer)/home/dashboard" as Href<string>);
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
                fname={fname}
                setFName={setFName}
                phoneNo={phoneNo}
                setPhoneNo={setPhoneNo}
                setNextVisible={setNextVisible}
                setBackVisible={setBackVisible}
                currentPos={currentPos}
              />
            </Animated.View>
            <Animated.View style={styles.formPage}>
              <LogInFormPage2
                otp={otp}
                setOTP={setOTP}
                nextAction={submitForm}
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
    alignItems: 'center',
  },
  footer: {
    backgroundColor: "transparent",
    position: "absolute",
    bottom: 150,
    alignSelf: "center",
  },
  submitButton: {
    borderWidth: 0,
    color: "#fff",
    borderRadius: 50,
    padding: 10,
    marginBottom: 5,
    backgroundColor: "#ff8b2e",
    alignItems: "center",
  },
  modelButton: {
    borderWidth: 0,
    color: "#fff",
    borderRadius: 50,
    padding: 10,
    marginBottom: 5,
    backgroundColor: "#2ededa",
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
