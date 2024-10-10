import {
    TextInput,
    StyleSheet,
    Text,
    KeyboardAvoidingView,
    ScrollView, View,
} from 'react-native';
import { useState } from 'react';
import { Colors } from "@/constants/Colors";
import Button from "@/components/Button";
import { useCart } from "@/providers/CartProvider";

const CartScreenFinish = () => {
    const { checkout } = useCart();
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [telephone, setTelephone] = useState('');
    const [note, setNote] = useState('');
    const [errors,setErrors]=useState('');

    const validateInput=()=>{
        setErrors('');
        if (!name){
            setErrors('Ime nije unijeto');
            return false;
        }
        if (!telephone){
            setErrors('Telefon nije unijet');
            return false;
        }
        if (!address){
            setErrors('Adresa nije unijeta');
            return false;
        }

        return true;
    }

    const onCreate=async ()=>{
        if (!validateInput()){
            return;
        }
        checkout(name, address, telephone, note);
    };


    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
        >
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.row}>
                    <View style={styles.inputContainer}>
                <Text style={styles.label}>Ime</Text>
                <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Name"
                    style={styles.input}
                /></View>
                    <View style={styles
                        .inputContainer}>
                <Text style={styles.label}>Broj telefona</Text>
                <TextInput
                    value={telephone}
                    onChangeText={setTelephone}
                    placeholder="Telephone"
                    style={styles.input}
                    keyboardType="phone-pad"
                /></View>
                </View>
                <Text style={styles.label}>Adresa</Text>
                <TextInput
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Address"
                    style={styles.input}
                />
                <Text style={styles.label}>Napomena</Text>
                <TextInput
                    value={note}
                    multiline={true}
                    onChangeText={setNote}
                    placeholder="Prilozi ili dodatne bitnosti"
                    style={[styles.input, { height: 95, textAlignVertical: 'top' }]}
                />
                <Text style={{color:'red'}}>{errors}</Text>
                    <Button onPress={onCreate} text="Naruci" />
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        flex: 1,
        marginRight: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    container: {
        flexGrow:1,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '66%',
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    input: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 20,
    },
    label: {
        fontWeight:'bold',
        color: 'gray',
        fontSize: 16,
        marginLeft:10,
    },
    textButton:{
        alignSelf:'center',
        fontWeight:'bold',
        color:Colors.light.tint,
        marginVertical:10,
    },
});

export default CartScreenFinish;
