import {View, Text, StyleSheet, TextInput, Image,Alert} from "react-native";
import Button from "@/components/Button";
import {useState} from "react/index";
import {defaultImage} from "@/components/ProductListItem";
import {Colors} from "@/constants/Colors";
import * as ImagePicker from 'expo-image-picker';
import {Stack, useLocalSearchParams} from "expo-router";

const CreateProductScreen=()=>{
    const [name,setName]=useState('');
    const [price,setPrice]=useState('');

    const [errors,setErrors]=useState('');

    const [image, setImage] = useState<string | null>(null);

    const {id}=useLocalSearchParams();
    const isUpdating=!!id;

    const resetFilds=()=>{
        setName('');
        setPrice('');

    }

    const validateInput=()=>{
        setErrors('');
        if (!name){
            setErrors('Ime nije unijeto');
            return false;
        }
        if (!price){
            setErrors('Cijena nije unijeto');
            return false;
        }
        if (isNaN(parseFloat(price))){
            setErrors('Cijena nije broj');
            return false;
        }
        return true;
    }
    const onSubmit=()=>{
        if (isUpdating)
        {
            onUpdateCreate();
        }else {
            onCreate();
        }
    }

    const onCreate=()=>{
        if (!validateInput()){
            return;
        }
        console.warn('Kreiran proizvod',name);

        //cuvaj u bazi podataka

        resetFilds();
    };
    const onUpdateCreate=()=>{
        if (!validateInput()){
            return;
        }
        console.warn('Uredjen proizvod',name);

        //cuvaj u bazi podataka

        resetFilds();
    };

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    }

    const onDelete=()=>{
        console.warn("OBRISANO");
    }

    const confirmDelete=()=>{
    Alert.alert("Paznja","Da li zelite da obrisete proizvod?",[
        {
            text:'Ne',
        },
        {
            text:'Obrisi',
            style:'destructive',
            onPress:onDelete,
        }
    ]);
    };
    return(
        <View style={styles.container}>
            <Stack.Screen options={{title:isUpdating?'Uredi proizvod':'Kreiraj proizvod'}}/>
            <Image source={{uri:image || defaultImage}} style={styles.image}/>
            <Text onPress={pickImage} style={styles.textButton}>Izaberi sliku</Text>
            <Text style={styles.label}>Ime</Text>
            <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Name"
                style={styles.input}
            />

            <Text style={styles.label}>Cijena ($)</Text>
            <TextInput
                value={price}
                onChangeText={setPrice}
                placeholder="9.99"
                style={styles.input}
                keyboardType="numeric"
            />
            <Text style={{color:'red'}}>{errors}</Text>
            <Button text={isUpdating?'Uredi':'Kreiraj'} onPress={onSubmit}/>
            {isUpdating && <Text onPress={confirmDelete} style={styles.textButton}>Obrisi</Text>}
        </View>
    );
};

const styles=StyleSheet.create({
  container:{
      flex:1,
      justifyContent:'center',
      padding:10,
  },
    input:{
        backgroundColor:'white',
        padding:10,
        borderRadius:5,
        marginTop:5,
        marginBottom:20,

    },
    label:{
        color:'gray',
        fontSize:16,
    },
    image:{
      width:'50%',
        aspectRatio:1,
        alignSelf:'center',
    },
    textButton:{
        alignSelf:'center',
        fontWeight:'bold',
        color:Colors.light.tint,
        marginVertical:10,
    },
});
export default CreateProductScreen;