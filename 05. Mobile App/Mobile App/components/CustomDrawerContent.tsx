import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Href, useRouter } from "expo-router";
import { getBackgroundColorAsync } from "expo-system-ui";
import {
  Pressable,
  useColorScheme,
  View,
  Image,
  StyleSheet,
} from "react-native";
import { ThemedText } from "./CommonModules/ThemedText";
import { MaterialIcons } from "@expo/vector-icons";
import { faHome, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { accountType, useAppContext } from "@/context/AppContext";
import { Dropdown } from "react-native-element-dropdown";
import { Passenger } from "@/controller/Passenger";
import { Owner } from "@/controller/Owner";

export default function CustomDrawerContent(props: any) {
  const { myAccTypes, profileImage } = useAppContext();
  const theme = useColorScheme() ?? "light";
  const iconColor = theme === "dark" ? "#eee" : "#777";
  const iconSize = 24;
  const router = useRouter();
  const { fName, lName, accountType, setAccountType } = useAppContext();
  const dataList = [
    { label: "Passenger Account", value: "Passenger" as accountType },
    { label: "Bus Operator Account", value: "Operator" as accountType },
    { label: "Bus Owner Account", value: "Owner" as accountType },
  ];

  function changeAccount(accType: accountType) {
    switch (accType) {
      case "Passenger":
        setAccountType(accType);
        router.navigate("/(drawerPas)/home/dashboard" as Href<string>);
        return null;
      case "Operator":
        if (myAccTypes.get(accType) == true) {
          setAccountType(accType);
          router.navigate("/(drawerOpe)/home/dashboard" as Href<string>);
        } else {
          router.navigate("/modals/opeSignupModal" as Href<string>);
        }
        return null;
      case "Owner":
        if (myAccTypes.get(accType) == true) {
          setAccountType(accType);
          router.navigate("/(drawerOwn)/home/dashboard" as Href<string>);
        } else {
          router.navigate("/modals/ownSignupModal" as Href<string>);
        }
        return null;
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} scrollEnabled={false}>
        <View style={{ padding: 5, alignItems: "center" }}>
          <Image
            source={
              profileImage != ""
                ? { uri: profileImage }
                : require("@/assets/images/blank-profile-picture.png")
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
          itemContainerStyle={{ backgroundColor: "#d17", margin: -1, borderWidth: 0 }}
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
            onPress={() => router.replace("/")}
          />
        </View>
      </DrawerContentScrollView>
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
