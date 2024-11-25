import { Href, useRouter } from "expo-router";
import {
  useColorScheme,
  View,
  Image,
  StyleSheet,
} from "react-native";
import { ThemedText } from "./CommonModules/ThemedText";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { accountType, useAppContext } from "../context/AppContext";
import { Dropdown } from "react-native-element-dropdown";
import React, { useState } from "react";
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import OpeSignupModal from "../app/modals/opeSignupModal";
import OwnSignupModal from "../app/modals/ownSignupModal";

export default function CustomDrawerContent(props: any) {
  const {
    operatorAcc,
    ownerAcc,
    profileImage,
    accountType,
    fName,
    lName,
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
    setCredits,
  } = useAppContext();
  const theme = useColorScheme() ?? "light";
  const iconColor = theme === "dark" ? "#eee" : "#777";
  const iconSize = 24;
  const dataList = [
    { label: "Passenger Account", value: "passenger" as accountType },
    { label: "Bus Operator Account", value: "employee" as accountType },
    { label: "Bus Owner Account", value: "owner" as accountType },
  ];
  const router = useRouter();
  const [displayOwnSignupModal, setOwnSignupModal] = useState(false);
  const [displayOpeSignupModal, setOpeSignupModal] = useState(false);

  function changeAccount(accType: accountType) {
    switch (accType) {
      case "passenger":
        setAccountType(accType);
        router.replace("/(drawerPas)/home/dashboard");
        return null;
      case "employee":
        if (operatorAcc) {
          setAccountType(accType);
          router.replace("/(drawerOpe)/home/dashboard");
        } else {
          setOpeSignupModal(true);
        }
        return null;
      case "owner":
        if (ownerAcc) {
          setAccountType(accType);
          router.replace("/(drawerOwn)/home/dashboard");
        } else {
          setOwnSignupModal(true);
        }
        return null;
    }
  }

  function pressLogout() {
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
    setCredits(0);
    router.replace("/");
  }

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} scrollEnabled={false}>
        <View style={{ padding: 5, alignItems: "center" }}>
          <Image
            source={
              profileImage != ""
                ? { uri: profileImage }
                : require("../assets/images/blank-profile-picture.png")
            }
            style={styles.profileImage}
          />
          <ThemedText type="h4" style={{ textAlign: "center" }}>
            {fName} {lName}
          </ThemedText>
        </View>
        <Dropdown
          style={{
            backgroundColor: "#e28",
            borderWidth: 0,
            borderRadius: 10,
            paddingHorizontal: 10,
            paddingVertical: 10,
            marginHorizontal: 10,
            marginVertical: 20,
            elevation: 3,
          }}
          placeholderStyle={{ color: "#fff", textAlign: "center" }}
          data={dataList}
          labelField="label"
          valueField="value"
          placeholder={
            dataList.find((item) => item.value === accountType)?.label
          }
          value={null}
          onChange={(item) => {
            changeAccount(item.value);
          }}
          itemContainerStyle={{
            backgroundColor: "#d17",
            margin: -1,
            borderWidth: 0,
          }}
          activeColor="#d17"
          itemTextStyle={{ color: "#fff", textAlign: "center" }}
          iconColor="#fff"
          selectedTextStyle={{ color: "#fff", textAlign: "center" }}
        />
        <View
          style={{
            paddingTop: 5,
          }}
        >
          <DrawerItemList {...props} />
          <DrawerItem
            label={"Logout"}
            labelStyle={{ color: iconColor }}
            icon={() => (
              <FontAwesomeIcon
                icon={faRightFromBracket}
                size={iconSize}
                color={iconColor}
              />
            )}
            onPress={pressLogout}
          />
        </View>
      </DrawerContentScrollView>
      <OwnSignupModal
        isVisible={displayOwnSignupModal}
        onClose={() => setOwnSignupModal(false)}
      />
      <OpeSignupModal
        isVisible={displayOpeSignupModal}
        onClose={() => setOpeSignupModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  profileImage: {
    height: 120,
    width: 120,
    borderRadius: 60,
    marginBottom: 20,
    backgroundColor: "#000",
  },
});
