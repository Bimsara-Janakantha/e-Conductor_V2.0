import React, { useState, useEffect } from 'react';
import { View, Button, Text, Platform } from 'react-native';
import * as Location from 'expo-location';

const LOCATION_TASK_NAME = 'background-location-task';

export const requestPermissions = async (): Promise<void> => {
  // Request foreground location permission
  const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
  console.log(foregroundStatus.toString());

  if (foregroundStatus === Location.PermissionStatus.GRANTED) {
    // Request background location permission
    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    console.log(backgroundStatus.toString());

    if (backgroundStatus === Location.PermissionStatus.GRANTED) {
      // Android foreground service setup
      if (Platform.OS === 'android') {
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Update location every 5 seconds
          distanceInterval: 0,
          foregroundService: {
            notificationTitle: 'Location Service',
            notificationBody: 'Tracking your location in the background',
            notificationColor: '#ffffff', // Optional
          },
        });

        // Check for battery optimization settings on Android
        const batteryOptimizationStatus = await Location.hasServicesEnabledAsync();
        if (!batteryOptimizationStatus) {
          console.log('Please disable battery optimization for this app.');
        }
      } else {
        // Non-Android platforms (iOS)
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Update location every 5 seconds
          distanceInterval: 0,
          showsBackgroundLocationIndicator: true,
        });
      }
    } else {
      console.log('Background location permission not granted');
    }
  } else {
    console.log('Foreground location permission not granted');
  }
};

const App = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  const handleStartTracking = async () => {
    await requestPermissions();
    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 0,
      },
      (newLocation) => {
        setLocation(newLocation);
      }
    );
  };

  return (
    <View>
      <Button title="Start Tracking" onPress={handleStartTracking} />
      {location && (
        <Text>
          Latitude: {location.coords.latitude}, Longitude: {location.coords.longitude}
        </Text>
      )}
    </View>
  );
};

export default App;





// import * as Location from "expo-location";
// import * as TaskManager from "expo-task-manager";
// import { PermissionsAndroid, Platform } from "react-native";

// const LOCATION_TASK_NAME = "background-location-task";

// export const requestPermissions = async (): Promise<void> => {
//   // Request foreground location permission
//   const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
//   console.log(foregroundStatus.toString());

//   if (foregroundStatus === Location.PermissionStatus.GRANTED) {
//     // Request background location permission
//     const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
//     console.log(backgroundStatus.toString());

//     if (backgroundStatus === Location.PermissionStatus.GRANTED) {
//       // Android foreground service setup
//       if (Platform.OS === "android") {
//         await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
//           accuracy: Location.Accuracy.High,
//           timeInterval: 5000, // Update location every 5 seconds
//           distanceInterval: 0,
//           foregroundService: {
//             notificationTitle: "Location Service",
//             notificationBody: "Tracking your location in the background",
//             notificationColor: "#ffffff", // Optional
//           },
//         });

//         // Check for battery optimization settings on Android
//         const batteryOptimizationStatus = await Location.hasServicesEnabledAsync();
//         if (!batteryOptimizationStatus) {
//           console.log("Please disable battery optimization for this app.");
//         }
//       } else {
//         // Non-Android platforms (iOS)
//         await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
//           accuracy: Location.Accuracy.High,
//           timeInterval: 5000, // Update location every 5 seconds
//           distanceInterval: 0,
//           showsBackgroundLocationIndicator: true,
//         });
//       }
//     } else {
//       console.log("Background location permission not granted");
//     }
//   } else {
//     console.log("Foreground location permission not granted");
//   }
// };


// const requestAndroidForegroundServicePermission = async () => {
//   try {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.FOREGROUND_SERVICE
//     );
//     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//       console.log("Foreground service permission granted");
//     } else {
//       console.log("Foreground service permission denied");
//     }
//   } catch (err) {
//     console.warn(err);
//   }
// };

// // TaskManager to handle background location updates
// TaskManager.defineTask(
//   LOCATION_TASK_NAME,
//   ({ data, error }: TaskManager.TaskManagerTaskBody<any>) => {
//     if (error) {
//       console.error(error.message); // Handle errors
//       return;
//     }
//     if (data) {
//       const { locations } = data;
//       locations.forEach(uploadLocation); // Handle the location updates
//     }
//   }
// );

// // Function to upload location to your server
// const uploadLocation = async (
//   location: Location.LocationObject
// ): Promise<void> => {
//   try {
//     const response = await fetch("https://your-server.com/upload-location", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//       }),
//     });
//     const result = await response.json();
//     console.log("Location uploaded:", result);
//   } catch (error) {
//     console.error("Error uploading location:", error);
//   }
// };
