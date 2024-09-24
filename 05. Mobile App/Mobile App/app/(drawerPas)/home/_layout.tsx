import { Tabs } from 'expo-router';
import React from 'react';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBusAlt, faCartArrowDown, faCartFlatbed, faCartShopping, faCarTunnel, faCircleDollarToSlot, faCog, faDollar, faExclamationCircle, faFileInvoiceDollar, faHome, faMapLocationDot, faMoneyBillTransfer, faMoneyCheckDollar, faPieChart, faSearch, faSearchLocation, faTable, faTicket, faTicketAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { faProductHunt } from '@fortawesome/free-brands-svg-icons';

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
              name='tickets'
              options={{
                  title: 'Tickets',
                  tabBarIcon: ({ color, focused }) => (
                    <FontAwesomeIcon icon={faTicket} size={28} color={color} />
                  ),
              }}
          />
        <Tabs.Screen
            name='tracker'
            options={{
            title: 'Tracker',
            tabBarIcon: ({ color, focused }) => (
                <FontAwesomeIcon icon={faSearchLocation} size={28} color={color} />
            ),
            }}
        />
    </Tabs>
  );
}
