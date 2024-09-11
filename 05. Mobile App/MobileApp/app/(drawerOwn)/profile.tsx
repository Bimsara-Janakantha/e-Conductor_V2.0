import { ThemedText } from "@/components/CommonModules/ThemedText";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import * as ImagePicker from "expo-image-picker";
import {
  faUser,
  faPhone,
  faIdCard,
  faSignature,
  faUserCircle,
  faBank,
  faDriversLicense,
  faN,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { Href, router } from "expo-router";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useAppContext } from "@/context/AppContext";
import { InfoCard } from "@/components/UIComponents/InfoCard";
import { useState } from "react";

export default function Profile() {
  const { myAccTypes, profileImage, setProfileImage } = useAppContext();
  const theme = useColorScheme() ?? "light";
  const iconColor = theme === "dark" ? "#ddd" : "#777";
  const {
    fName,
    lName,
    phoneNo,
    nic,
    accountNo,
    accHolderName,
    bankName,
    nameOnLicense,
    ntcLicenseNo,
    driverLicenseNo,
    occupation,
  } = useAppContext();

  const credits = 500.25;

  const pickImage = async () => {
    // Request permission to access the media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access gallery is required!");
      return;
    }

    // Open the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.mainBody}>
        <View style={{ alignItems: "center", marginBottom: 5 }}>
          <View style={{ flexDirection: "row" }}>
            <Image
              source={
                profileImage != ""
                  ? { uri: profileImage }
                  : require("@/assets/images/blank-profile-picture.png")
              }
              style={styles.profileImage}
            />
            <Pressable onPress={pickImage}>
              <FontAwesomeIcon
                icon={faEdit}
                size={20}
                color={"#fff"}
                style={{ position: "absolute", bottom: 15, right: -8 }}
              />
            </Pressable>
          </View>

          <ThemedText type={"s3"}>
            {fName} {lName}
          </ThemedText>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 30,
            borderRadius: 20,
            paddingVertical: 3,
            paddingHorizontal: 5,
            marginHorizontal: "10%",
          }}
        >
          <ThemedText
            type={"h4"}
            lightColor={"#555"}
            darkColor={"#fff"}
            style={{ marginLeft: 5 }}
          >
            Rs. {credits}
          </ThemedText>
          <Pressable
            style={[
              styles.rechargeButton,
              {
                borderColor: theme === "dark" ? "#fff" : "#666",
                borderWidth: 2,
              },
            ]}
            onPress={() => router.replace("/index" as Href<string>)}
          >
            <ThemedText type="h6" lightColor={"#666"} darkColor={"#fff"}>
              Recharge
            </ThemedText>
          </Pressable>
        </View>

        <ScrollView
          style={{
            backgroundColor: "transparent",
            marginHorizontal: 20,
          }}
        >
          <View>
            <View>
              <ThemedText
                type="h5"
                lightColor={iconColor}
                darkColor={iconColor}
                style={{ marginVertical: 20 }}
              >
                Personal Info
              </ThemedText>
              <InfoCard
                title="Phone Number"
                iconName={faPhone}
                info={phoneNo}
                iconColor={iconColor}
              />

              {(myAccTypes.get("Owner") || myAccTypes.get("Operator")) && (
                <InfoCard
                  title="NIC"
                  iconName={faIdCard}
                  info={nic}
                  iconColor={iconColor}
                />
              )}

              <View
                style={{
                  height: 1,
                  backgroundColor: iconColor,
                  marginBottom: 15,
                }}
              />
            </View>
            {myAccTypes.get("Owner") && (
              <View>
                <ThemedText
                  type="h5"
                  lightColor={iconColor}
                  darkColor={iconColor}
                  style={{ marginVertical: 20 }}
                >
                  Bank Info
                </ThemedText>
                <InfoCard
                  title="Bank"
                  iconName={faBank}
                  info={bankName}
                  iconColor={iconColor}
                />

                <InfoCard
                  title="Account Number"
                  iconName={faUserCircle}
                  info={accountNo}
                  iconColor={iconColor}
                />
                <InfoCard
                  title="Name"
                  iconName={faSignature}
                  info={accHolderName}
                  iconColor={iconColor}
                />
                {myAccTypes.get("Operator") && (
                  <View
                    style={{
                      height: 1,
                      backgroundColor: iconColor,
                      marginVertical: 15,
                    }}
                  />
                )}
              </View>
            )}
            {myAccTypes.get("Operator") && (
              <View>
                <ThemedText
                  type="h5"
                  lightColor={iconColor}
                  darkColor={iconColor}
                  style={{ marginVertical: 20 }}
                >
                  Licence Info
                </ThemedText>
                <InfoCard
                  title="Driver's license number"
                  iconName={faDriversLicense}
                  info={driverLicenseNo}
                  iconColor={iconColor}
                />

                <InfoCard
                  title="Name"
                  iconName={faSignature}
                  info={nameOnLicense}
                  iconColor={iconColor}
                />
                <InfoCard
                  title="NTC license number"
                  iconName={faN}
                  info={ntcLicenseNo}
                  iconColor={iconColor}
                />
                <InfoCard
                  title="Occupation"
                  iconName={faUser}
                  info={occupation}
                  iconColor={iconColor}
                />
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  mainBody: {
    padding: 10,
    flex: 1,
  },
  rechargeButton: {
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  cardBody: {
    borderWidth: 0,
    borderRadius: 10,
    marginHorizontal: 10,
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  cardHeader: {
    marginTop: 25,
    marginBottom: 5,
    marginHorizontal: 15,
    backgroundColor: "transparent",
  },
  ticketBody: {
    borderWidth: 0,
    borderRadius: 10,
    margin: 5,
    padding: 10,
    backgroundColor: "#1cd7",
  },
  drawerHeader: {
    flexDirection: "row",
    backgroundColor: "transparent",
    gap: 10,
  },
  profileImage: {
    height: 120,
    width: 120,
    borderRadius: 60,
    marginBottom: 12,
    backgroundColor: "#000",
  },
});
