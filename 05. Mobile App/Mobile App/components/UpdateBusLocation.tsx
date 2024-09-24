import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";
import axios from "axios";

export default function UpdateBusLocation() {
  const [regNo, setRegNo] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [speed, setSpeed] = useState("");

  const updateLocation = async () => {
    try {
      const response = await axios.post("http://192.168.168.221:20240/tracking/livebus", {
        regNo: regNo,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        speed: parseFloat(speed),
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  return (
    <View>
      <TextInput placeholder="Bus RegNo" value={regNo} onChangeText={setRegNo} />
      <TextInput placeholder="Latitude" value={lat} onChangeText={setLat} />
      <TextInput placeholder="Longitude" value={lng} onChangeText={setLng} />
      <TextInput placeholder="Speed" value={speed} onChangeText={setSpeed} />
      <Button title="Update Location" onPress={updateLocation} />
    </View>
  );
}
