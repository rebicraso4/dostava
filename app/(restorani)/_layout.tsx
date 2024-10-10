import {Redirect, Tabs} from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useAuth} from "@/providers/AuthProvider";

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const {session}=useAuth();

    if (!session)
    {
        return <Redirect href={'/'}/>;
    }
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.light.tint,
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
                name="orders"
                options={{
                    title: 'Narudžbe',
                    headerShown: false,
                    href: '/orders',
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name="list" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profil',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name="person-circle-outline" color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
