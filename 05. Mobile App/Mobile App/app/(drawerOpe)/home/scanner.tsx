import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Alert, Pressable } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { BarCodeScanningResult } from 'expo-camera/build/legacy/Camera.types';
import { ThemedText } from '@/components/CommonModules/ThemedText';

export default function Scanner() {
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState<string>('');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getCameraPermission();
  }, []);

  const handleBarCodeScanned = (result: BarCodeScanningResult) => {
    setScanned(true);
    setScannedData(result.data);
    Alert.alert('QR Code Scanned', `Data: ${result.data}`, [
      { text: 'OK', onPress: () => console.log('OK Pressed') },
    ]);
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Pressable style={{backgroundColor:'#db1', borderRadius: 10, padding: 5}} onPress={() => setScanned(false)} >
          <ThemedText lightColor='#fff'>
          Tap to Scan Again
          </ThemedText>
        </Pressable>
      )}
      <Text style={styles.text}>Scanned Data: {scannedData}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginTop: 20,
    color: '#000',
  },
});
