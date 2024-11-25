import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import axios from "axios";
import { useAppContext } from "../context/AppContext";

// Define the structure of the bus data
interface Bus {
  id: string;
  regNo: string;
  service: string;
  seats: number;
  rating: number;
  insuranceExp: string;
  VRL_Exp: string;
}

export default function BusList() {
  const { baseURL } = useAppContext();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBusData = async () => {
    try {
      const response = await axios.get(`${baseURL}/mobileAPI/user/details`);
      setBuses(response.data);
    } catch (error) {
      console.error("Error fetching bus data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View>
      <FlatList
        data={buses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text>Bus Reg No: {item.regNo}</Text>
            <Text>Service: {item.service}</Text>
            <Text>Seats: {item.seats}</Text>
            <Text>Rating: {item.rating}</Text>
            <Text>Insurance Expiry: {item.insuranceExp}</Text>
            <Text>VRL Expiry: {item.VRL_Exp}</Text>
          </View>
        )}
      />
    </View>
  );
}
