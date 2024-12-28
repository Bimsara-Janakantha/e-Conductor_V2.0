import { Tabs } from 'expo-router';
import React from 'react';

import { useColorScheme } from '../../../hooks/useColorScheme';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPieChart, faQrcode } from '@fortawesome/free-solid-svg-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = useColorScheme() ?? "light";

  return (
    <Tabs
        screenOptions={{
        tabBarActiveTintColor: theme === "dark" ? '#5fb5e5' : '#4ad',
        headerShown: false,
    }}>
        <Tabs.Screen
            name='dashboard'
            options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, focused }) => (
                <FontAwesomeIcon icon={faPieChart} size={28} color={color} />
            ),
            }}
        />
        <Tabs.Screen
            name='scanner'
            options={{
            title: 'Scanner',
            tabBarIcon: ({ color, focused }) => (
                <FontAwesomeIcon icon={faQrcode} size={28} color={color} />
            ),
            }}
        />
    </Tabs>
  );
}
