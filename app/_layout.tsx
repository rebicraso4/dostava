import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import CartProvider from "@/providers/CartProvider";
import {StyleSheet} from "react-native";
import { useColorScheme } from '@/hooks/useColorScheme';
import AuthProvider, { useAuth } from "@/providers/AuthProvider";
import QueryProvider from "@/providers/QueryProvider";
import NotificationProvider from "@/providers/NotificationProvider";
import {ModalProvider} from "@/providers/ModalProvider";
import {RestaurantProvider} from "@/providers/RestaurantProvider";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    const { user, isAdmin, loading } = useAuth();

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
        console.log(isAdmin);
    }, [loaded, isAdmin]);

    if (!loaded) {
        return null;
    }

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <RestaurantProvider>
                <AuthProvider>
                    <QueryProvider>
                        <NotificationProvider>
                            <CartProvider>
                                <ModalProvider>
                                    <Stack>
                                        {!isAdmin ? (
                                            <Stack.Screen name="(restorani)" options={{ headerShown:false}} />
                                        ):(
                                            <Stack.Screen name="(restorani)" options={{ headerShown:true}} />
                                        )}

                                        <Stack.Screen name="(tabs)" options={{ headerShown:false  }} />
                                        <Stack.Screen name="(auth)" options={{ headerShown:false  }} />
                                        <Stack.Screen
                                            name="cart"
                                            options={{
                                                presentation: 'modal',
                                                animation: 'slide_from_bottom',
                                                headerShown: false,
                                            }}
                                        />
                                        <Stack.Screen
                                            name="cartFinish"
                                            options={{
                                                presentation: 'transparentModal',
                                                animation: 'slide_from_bottom',
                                                headerShown: false,
                                            }}
                                        />

                                        <Stack.Screen name="+not-found" />
                                    </Stack>
                                </ModalProvider>
                            </CartProvider>

                        </NotificationProvider>
                    </QueryProvider>
                </AuthProvider>
            </RestaurantProvider>
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: '#fff',
    },
});
