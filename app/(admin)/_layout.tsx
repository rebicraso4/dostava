import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

import Icon from 'react-native-vector-icons/FontAwesome';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
        <Tabs.Screen name="index" options={{href:null}}/>
      <Tabs.Screen
        name="menu"
        options={{
            headerShow:false,
          title: 'Meni',
          tabBarIcon: ({ color, focused }) => (
              <TabBarIcon color={color}>
                  <Icon name="cutlery" size={20}/>
              </TabBarIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="list" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
