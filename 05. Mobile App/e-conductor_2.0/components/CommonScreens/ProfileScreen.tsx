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
  faEdit,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";

import { useAppContext } from "../../context/AppContext";
import { ThemedText } from "../../components/CommonModules/ThemedText";
import { InfoCard } from "../../components/UIComponents/InfoCard";
import { ThemedView } from "../CommonModules/ThemedView";

/**
 * ProfileScreen
 *
 * This component displays the user's profile information, including personal, bank,
 * and license details. It also allows the user to update their profile picture.
 *
 * @returns {JSX.Element} The profile screen component.
 */
export default function ProfileScreen() {
  const {
    operatorAcc,
    ownerAcc,
    profileImage,
    setProfileImage,
    credits,
    fName,
    lName,
    phoneNo,
    email,
    nic,
    accountNo,
    accHolderName,
    bankName,
    ntcLicenseNo,
    driverLicenseNo,
    occupation,
  } = useAppContext(); // Extracting global context values
  const theme = useColorScheme() ?? "light"; // Detect current theme (light or dark mode)
  const iconColor = theme === "dark" ? "#ddd" : "#777"; // Adjust icon color based on theme

  //================================================ Functions ===============================================//

  /**
   * Handles selecting and setting a profile picture.
   * Requests permissions, opens the image picker, and updates the profile picture on selection.
   */
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access gallery is required!");
      return;
    }

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

  //================================================ UI Control ===============================================//

  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={styles.mainBody}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            backgroundColor: "transparent",
            marginHorizontal: 20,
          }}
        >
          <View style={{ alignItems: "center", marginBottom: 5 }}>
            <View style={{ flexDirection: "row" }}>
              <Image
                source={
                  profileImage != ""
                    ? { uri: profileImage }
                    : require("../../assets/images/blank-profile-picture.png")
                }
                style={styles.profileImage}
              />
              <Pressable onPress={pickImage}>
                <FontAwesomeIcon
                  icon={faEdit}
                  size={20}
                  color={theme === "dark" ? "#fff" : "#666"}
                  style={{ position: "absolute", bottom: 15, right: -8 }}
                />
              </Pressable>
            </View>

            <ThemedText type={"h3"} lightColor="#33aefc" darkColor="#03C4EF">
              {fName} {lName}
            </ThemedText>
          </View>
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
              <InfoCard
                title="Email Address"
                iconName={faEnvelope}
                info={email}
                iconColor={iconColor}
              />

              {(ownerAcc || operatorAcc) && (
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
            {ownerAcc && (
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
                {operatorAcc && (
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
            {operatorAcc && (
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
                  title="NTC license number"
                  iconName={faDriversLicense}
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
    </ThemedView>
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
