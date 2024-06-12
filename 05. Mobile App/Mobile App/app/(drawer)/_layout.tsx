import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { DrawerIcon } from '@/components/navigation/DrawerIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomDrawerContent from '@/components/CustomDrawerContent';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView>
        <Drawer
            drawerContent={CustomDrawerContent}
            screenOptions={{
                //drawerHideStatusBarOnOpen: true,
                drawerActiveBackgroundColor: '#13ff00',
                drawerActiveTintColor: '#0256ff',
                drawerType: 'front',
                drawerStyle: {
                    backgroundColor: '#ffb925',
                    width: 250
                },
                drawerLabelStyle: {
                    color: '#fff'
                }
            }}
        >
            <Drawer.Screen
                name='home'
                options={{
                drawerLabel: 'Home',
                drawerIcon: ({ color, focused }) => (<DrawerIcon name={focused ? 'home' : 'home-outline'} color={color} />),
                title: 'Home',
                }}

            />
            <Drawer.Screen
                name='profile'
                options={{
                drawerLabel: 'Profile',
                drawerIcon: ({ color, focused }) => (<DrawerIcon name={focused ? 'person' : 'person-outline'} color={color} />),
                title: 'Profile',
                }}
            />
            <Drawer.Screen
                name='history'
                options={{
                drawerLabel: 'History',
                drawerIcon: ({ color, focused }) => (<DrawerIcon name={focused ? 'home' : 'home-outline'} color={color} />),
                title: 'History',
                }}
            />
            <Drawer.Screen
                name='settings'
                options={{
                drawerLabel: 'Settings',
                drawerIcon: ({ color, focused }) => (<DrawerIcon name={focused ? 'cog' : 'cog-outline'} color={color} />),
                title: 'Settings',
                }}
            />
            <Drawer.Screen
                name='about'
                options={{
                drawerLabel: 'About',
                drawerIcon: ({ color, focused }) => (<DrawerIcon name={focused ? 'home' : 'home-outline'} color={color} />),
                title: 'About',
                }}
            />
        </Drawer>
    </GestureHandlerRootView>
  );
}
