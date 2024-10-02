import {View, Text, Image,StyleSheet,Pressable} from 'react-native';
import {useLocalSearchParams, Stack, useRouter, Link} from "expo-router";
import products from "@/assets/data/products";
import {defaultImage} from "@/components/ProductListItem";
import {useState} from "react/index";
import Button from "@/components/Button";
import {useCart} from '@/providers/CartProvider';
import {PizzaSize} from "@/types";
import {FontAwesome} from "@expo/vector-icons";
import {Colors} from "@/constants/Colors";

const sizes:PizzaSize[]=['S','M','L','XL'];



const ProductDetailsScreen=()=>{
    const{id}=useLocalSearchParams();
    const product=products.find(p=>p.id.toString()===id)
    const router=useRouter();
    const [selectedSize,setSelectedSize]=useState<PizzaSize>('S');
    const {addItem}=useCart();

    const addToCart=()=>{
        if (!product){
            return;
        }
        addItem(product,selectedSize);
        router.push('/cart');
    }


     if (!product){
        return <Text>Proizvod nije pronadjen</Text>
    }

    return(
        <View style={styles.container}>

            <Stack.Screen options={{
                title:'Menu',
                headerRight:() => (
                    <Link href={`/(admin)/menu/create?id=${id}`} asChild>
                        <Pressable>
                            {({ pressed }) => (
                                <FontAwesome
                                    name="pencil"
                                    size={25}
                                    color={Colors.light.tint}
                                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                                />
                            )}
                        </Pressable>
                    </Link>
                ),}} />

            <Stack.Screen options={{title:product?.name}} />
            <Image source={{uri:product.image || defaultImage}} style={styles.image}/>

            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.price}>${product.price}</Text>

        </View>
    );
};

const styles=StyleSheet.create({
    container:{
        backgroundColor:'white',
        flex:1,
        padding:10,

    },
    image:{
        width:'100%',
        aspectRatio:1,
    },
    price:{
        fontSize:18,
        fontWeight:'bold',
        marginTop:'auto',
    },
    title:{
      fontSize:20,
      fontWeight:'bold',
    },
    sizes:{
        flexDirection:'row',
        justifyContent:'space-around',
        marginVertical:10,
    },
    size:{
        backgroundColor:'gainsboro',
        width:50,
        borderRadius: 25,
        alignItems:'center',
        justifyContent:'center',
        aspectRatio:1
    },
    sizeText:{
      fontSize:20,
      fontWeight:'500',
    },

});
export default ProductDetailsScreen;