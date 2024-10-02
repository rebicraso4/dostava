import {FlatList, View} from 'react-native';
import products from "@/assets/data/products";
import ProductListItem from "@/components/ProductListItem";
import {useLocalSearchParams, useRouter} from "expo-router";
import restorans from "@/assets/data/restorans";

const HomeScreenTwo=()=> {
    const{id_re}=useLocalSearchParams();
   // const id_re = "2";
    const kafana=restorans.find(p=>p.id_re.toString()===id_re)
    console.warn(kafana.id_re);
    return (
        <View>
            <FlatList data={products}
                      renderItem={({item})=> <ProductListItem product={item}/>}
                      numColumns={2}
                      contentContainerStyle={{gap:10,padding:10}}
                      columnWrapperStyle={{gap:10}}
            />
        </View>
    );
};

export default HomeScreenTwo;
