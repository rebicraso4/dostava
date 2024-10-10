import {ActivityIndicator, FlatList, Text, View} from "react-native";
import {useLocalSearchParams,Stack} from "expo-router";
import OrderItemListItem from "@/components/OrderItemListItem";
import {useOrderDetails} from "@/api/orders";
import {useUpdateOrderSubscriptionOne} from "@/api/orders/subscriptions";
import OrderInformation from "@/components/OrderInformation";

export default function OrderDatailsScreen() {
    const{id:idString}=useLocalSearchParams();
    const id=parseFloat(typeof idString==='string'?idString:idString[0]);

    const {data:order,isLoading,error}=useOrderDetails(id);
    useUpdateOrderSubscriptionOne(id);
    if (isLoading){
        return <ActivityIndicator/>;
    }
    if (error){
        return <Text>Greska u fetchproduktu</Text>;
    }
    return(
        <View style={{padding:10,gap:20,flex:1}}>
            <Stack.Screen options={{title:`Narudzba #${id}`}}/>

            <FlatList
                data={order.order_items}
                renderItem={({item})=><OrderItemListItem item={item}/>}
                contentContainerStyle={{gap:10}}
                ListHeaderComponent={()=><OrderInformation order={order}/>}
            />
        </View>
    );
};