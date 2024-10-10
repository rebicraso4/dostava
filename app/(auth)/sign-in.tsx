import {View, Text, TextInput, StyleSheet, Alert, Platform, KeyboardAvoidingView, ScrollView} from 'react-native';
import React, { useState } from 'react';
import Button from '../../components/Button';
import {Colors} from '../../constants/Colors';
import { Link, Stack } from 'expo-router';
import {supabase} from "@/lib/supabase";
import LottieView from "lottie-react-native";

const SignInScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading,setLoading]=useState(false);

    async function signInWithEmail(){
        setLoading(true);
        const {error}=await supabase.auth.signInWithPassword({
            email,
            password});

        if (error)
        {
            Alert.alert(error.message);
        }
        setLoading(false);
    };
    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={80}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false}>
            <Stack.Screen options={{
                headerStyle: {backgroundColor: '#A3C1DA'},
                headerTintColor: '#FFFFFF',
                title: 'Prijava'}}  />
            <View style={{ alignItems: 'center',marginBottom:10}}>
                <LottieView
                    source={require('../../assets/animation/Animation_new.json')}
                    autoPlay
                    loop
                    style={styles.animation}
                />
            </View>
            <Text style={styles.label}>Email</Text>
            <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="jon@gmail.com"
                style={styles.input}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder=""
                style={styles.input}
                secureTextEntry
            />

            <Button onPress={signInWithEmail} disabled={loading} text={loading?'Prijava u toku..':"Prijavi se"} />
            <Link href="/sign-up" style={styles.textButton}>
                Kreiraj profil
            </Link>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#A3C1DA',
    },
    scrollContainer: {
        padding: 20,
        flexGrow: 1,
    },
    label: {
        color: '#333',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#007b83', // Prilagođena boja za border
        padding: 12,
        marginTop: 5,
        marginBottom: 20,
        backgroundColor: '#f0f4f7', // Svetla boja za polja unosa
        borderRadius: 12, // Više zaobljenja da odgovara dugmetu
        fontSize: 16,
        color: '#333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3, // Dodavanje blagog efekta senke na Androidu
    },
    textButton: {
        alignSelf: 'center',
        fontWeight: 'bold',
        color: '#007b83', // Usklađena boja sa dugmetima
        marginVertical: 10,
    },
    animation: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
});

export default SignInScreen;
