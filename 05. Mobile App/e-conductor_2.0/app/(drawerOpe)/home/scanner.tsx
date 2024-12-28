import React, { useState, useEffect } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { Camera, CameraView } from "expo-camera";
import { BarcodeScanningResult } from "expo-camera/build/Camera.types";

import { useAppContext } from "../../../context/AppContext";
import { ThemedText } from "../../../components/CommonModules/ThemedText";
import LoadingScreen from "../../../components/CommonScreens/LoadingScreen";
import ErrorScreen from "../../../components/CommonScreens/ErrorScreen";
import TicketScan from "../../modals/messages/ticketScan";

/**
 * Scanner component for bus operators.
 * Provides functionality to scan the QR code at the top left corner of the ticket
 */
export default function Scanner() {
  const { busScheduleDetails } = useAppContext(); // Extracting global context values
  const [scanned, setScanned] = useState(false); // State to track if a QR code has been scanned
  const [scannedData, setScannedData] = useState<string[]>([]); // Stores the parsed QR code data
  const [hasPermission, setHasPermission] = useState<boolean | null>(null); // Tracks camera permission status
  const [valid, setValid] = useState(false); // Indicates if the scanned ticket is valid
  const [isQuickTicket, setIsQuickTicket] = useState(false); // Tracks if the scanned ticket is not pre-booked
  const [error, setError] = useState<string>(""); // Error message for UI feedback

  //================================================ Functions ===============================================//

  /**
   * Requests camera permission from the user. Updates `hasPermission` based on the result.
   */
  const getCameraPermission = async () => {
    setError("");
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
  };

  /**
   * Handles the barcode scanning event. Parses the scanned data, validates it against the bus schedule,
   * and updates state accordingly.
   * @param result - The result of the barcode scan containing the scanned data.
   */
  const handleBarCodeScanned = (result: BarcodeScanningResult) => {
    setIsQuickTicket(false);
    const data: string = result.data;
    const splitData = data.split("|");

    if (splitData.length >= 5) {
      const scannedSeatNos = splitData[4]
        .split(",")
        .map((seat: string) => parseInt(seat?.trim().replace(/['"]/g, ""), 10));

      const bus = busScheduleDetails.find(
        (bus) =>
          bus.vehicleRegNo === splitData[0] &&
          bus.departureTime === splitData[1]
      );

      if (bus) {
        const bookedSeatNumbers = bus.bookedSeats.map((seat) =>
          parseInt(seat, 10)
        );
        console.log("Booked Seats in Bus:");
        bookedSeatNumbers.forEach((seat, index) => {
          console.log(`Index ${index}: ${seat}`);
        });

        const seatsMatch = scannedSeatNos.every((seat: number) =>
          bookedSeatNumbers.includes(seat)
        );

        setValid(seatsMatch);
        setIsQuickTicket(!seatsMatch);
      } else {
        setValid(false);
      }

      setScanned(true);
      setScannedData(splitData);
    } else {
      console.error("Scanned data is incomplete:", splitData);
      setValid(false);
      setScanned(false);
    }
  };

  //================================================ Use Effects ===============================================//

  /**
   * Requests camera permission when the component is mounted.
   */
  useEffect(() => {
    getCameraPermission();
  }, []);

  //================================================ UI Control ===============================================//

  if (hasPermission === null) {
    return <LoadingScreen />;
  }

  if (hasPermission === false) {
    setError("Camera permission is not granted");
    return <ErrorScreen error={error} retry={getCameraPermission} />;
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Pressable
          style={{ backgroundColor: "#db1", borderRadius: 10, padding: 5 }}
          onPress={() => setScanned(false)}
        >
          <ThemedText lightColor="#fff">Tap to Scan Again</ThemedText>
        </Pressable>
      )}
      <TicketScan
        isVisible={scanned}
        onClose={() => setScanned(false)}
        valid={valid}
        regNo={scannedData[0]}
        departureTime={scannedData[1]}
        from={scannedData[2]}
        to={scannedData[3]}
        seatNos={scannedData[4]}
        full={scannedData[5]}
        half={scannedData[6]}
        isQuickTicket={isQuickTicket}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    marginTop: 20,
    color: "#000",
  },
});
