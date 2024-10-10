import { Text, View, StyleSheet } from "react-native";
import { supabase } from "@/lib/supabase";
import {Link, Stack, useRouter} from "expo-router";
import Button from "@/components/Button";
import {useAuth} from "@/providers/AuthProvider";

const ProfileScreen = () => {
    const router = useRouter();

    const {isAdmin}=useAuth();
    const handleSignOutTwo = async () => {
        await supabase.auth.signOut();
        router.replace('/(auth)/sign-in');
    };
    console.log(isAdmin);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profil</Text>
            <Button text="Sign out" onPress={handleSignOutTwo}  />
            {isAdmin && (
                    <Link href={'/(admin)'} asChild>
                        <Button text="Admin"/>
                    </Link>
                )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f0f0f0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default ProfileScreen;
