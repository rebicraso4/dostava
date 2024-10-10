import { ActivityIndicator, View, StyleSheet, StatusBar } from "react-native";
import { Link, Redirect, useRouter } from "expo-router";
import Button from "@/components/Button";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";
import { Stack } from 'expo-router';
import LottieView from "lottie-react-native";
import React from "react";

const Index = () => {
    const { session, loading, profile, isAdmin } = useAuth();
    const router = useRouter();
    console.log(session?.user.email);

    if (loading || profile === null) {
        return <ActivityIndicator />;
    }

    if (!session) {
        return <Redirect href={'/(auth)/sign-in'} />;
    }

    if (!isAdmin) {
        return <Redirect href={'/(restorani)'} />;
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.replace('/(auth)/sign-in');
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown:false}} />
            <View style={{ alignItems: 'center',marginTop:50,marginBottom:80}}>
            <LottieView
                source={require('../assets/animation/Animation_new.json')}
                autoPlay
                loop
                style={styles.animation}
            /></View>
            <Link href={'/(restorani)'} asChild>
                <Button text="Korisnik" />
            </Link>
            <Link href={'/(admin)'} asChild>
                <Button text="Admin" />
            </Link>
            <Button onPress={handleSignOut} text="Sign out" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#A3C1DA',
    },
    animation: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
});

export default Index;
