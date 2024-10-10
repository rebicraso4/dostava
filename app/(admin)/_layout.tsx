import {Redirect, Tabs} from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

import Icon from 'react-native-vector-icons/FontAwesome';
import {useAuth} from "@/providers/AuthProvider";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const {isAdmin}=useAuth();
  console.log(isAdmin);
  if (!isAdmin)
  {
      return <Redirect href={'/'}/>;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.background,
        tabBarInactiveTintColor:'gainsboro',
        headerShown: false,
          tabBarStyle:{
            backgroundColor:Colors.light.tint,
          }
      }}>
        <Tabs.Screen name="index" options={{href:null}}/>
      <Tabs.Screen
        name="menu"
        options={{
           headerShown:false,
          title: 'Meni',
          tabBarIcon: ({ color, focused }) => (
              <TabBarIcon color={color}>
                  <Icon name="cutlery" size={20}/>
              </TabBarIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Narudzbe',
            headerShow:false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="list" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
