import React, { useState, useEffect } from "react";
import { StyleSheet, View, useColorScheme } from "react-native";
import * as Location from "expo-location";

import PasBusLocation from "../../../components/UIComponents/PasBusLocation";
import ErrorScreen from "../../../components/CommonScreens/ErrorScreen";
import LoadingScreen from "../../../components/CommonScreens/LoadingScreen";
import { ThemedView } from "../../../components/CommonModules/ThemedView";

/**
 * Tracker component for fetching and displaying user's current location.
 * Handles location permission requests, location retrieval, and error handling.
 */
export default function Tracker() {
  const theme = useColorScheme() ?? "light"; // Get the current theme ('light' or 'dark')
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  ); // State to store the location object retrieved from the device
  const [errorPermission, setErrorPermission] = useState<string | null>(null); // State to store any error related to location permission
  const [loading, setLoading] = useState(true); // State to handle loading state while fetching location
  const [error, setError] = useState<string>(""); // State to handle general errors in fetching location

  //================================================ Functions ===============================================//

  /**
   * Request for foreground location permission from the user.
   * @returns {Promise<boolean>} - Returns true if permission is granted, otherwise false.
   */
  const requestPermissions = async (): Promise<boolean> => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorPermission("Permission to access location was denied");
      return false;
    }
    return true;
  };

  /**
   * Fetch the current location of the user.
   * If successful, it updates the state with the location details.
   * If an error occurs, the permission error state is set.
   */
  const getLocation = async (): Promise<void> => {
    try {
      let loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(loc);
    } catch (error) {
      setErrorPermission(String(error));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reload the current location by requesting permission and then fetching the location.
   * A slight delay is added before fetching the location to simulate re-fetching after an update.
   */
  const reloadLocation = async (): Promise<void> => {
    (async () => {
      const hasPermission = await requestPermissions();
      if (hasPermission) {
        // Adding a slight delay before getting the location
        setTimeout(async () => {
          await getLocation();
        }, 1000);
      } else {
        setLoading(false);
      }
    })();
  };

  //================================================ Use Effects ===============================================//

  /**
   * On component mount, request for location permissions and fetch the location if granted.
   * If permission is denied, set loading to false.
   */
  useEffect(() => {
    (async () => {
      const hasPermission = await requestPermissions();
      if (hasPermission) {
        // Adding a slight delay before getting the location
        setTimeout(async () => {
          await getLocation();
        }, 1000);
      } else {
        setLoading(false);
      }
    })();
  }, []);

  //================================================ UI Control ===============================================//

  if (loading) {
    return <LoadingScreen />;
  }

  if ((error !== "" || errorPermission) && !loading) {
    return errorPermission ? (
      <ErrorScreen error={errorPermission} retry={getLocation} />
    ) : (
      <ErrorScreen error={error} retry={reloadLocation} />
    );
  }

  return (
    <ThemedView style={styles.container}>
      {location && <PasBusLocation />}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  reloadButton: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: "transparent",
  },
});

// import { Image, StyleSheet, Pressable } from "react-native";
// import { Link } from "expo-router";

// import { ThemedText } from "../../../components/CommonModules/ThemedText";
// import { ThemedView } from "../../../components/CommonModules/ThemedView";
// import { TextInput } from "react-native-gesture-handler";
// import GPTScrollView from "../../../components/GPTScrollView";
// import ParallaxScrollView from "../../../components/GPTScrollView";

// export default function Tracker() {
//   return (
//     <ParallaxScrollView
//       headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
//       headerImage={

//          require("@/assets/images/partial-react-logo.png")

//       }
//     >
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome!</ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome!</ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome!</ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome!</ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome!</ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome!</ThemedText>
//       </ThemedView>
//     </ParallaxScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: "absolute",
//   },
// });

// import { Image, StyleSheet, Pressable } from "react-native";
// import { Link } from "expo-router";

// import ParallaxScrollView from "../../../components/ParallaxScrollView";
// import { ThemedText } from "../../../components/CommonModules/ThemedText";
// import { ThemedView } from "../../../components/CommonModules/ThemedView";
// import { TextInput } from "react-native-gesture-handler";

// export default function Tracker() {
//   return (
//     <ParallaxScrollView
//       headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
//       headerImage={
//         <Image
//           source={require("@/assets/images/partial-react-logo.png")}
//           style={styles.reactLogo}
//         />
//       }
//     >
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome!</ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome!</ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome!</ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome!</ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome!</ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome!</ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome!</ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome!</ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome!</ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome!</ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome!</ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome!</ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome!</ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome!</ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome!</ThemedText>
//       </ThemedView>
//     </ParallaxScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: "absolute",
//   },
// });
