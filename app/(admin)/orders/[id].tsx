import {FlatList, Text, View} from "react-native";
import {useLocalSearchParams,Stack} from "expo-router";
import orders from "@/assets/data/orders";
import OrderListItem from "@/components/OrderListItem";
import OrderItemListItem from "@/components/OrderItemListItem";

export default function OrderDatailsScreen() {
   const {id}=useLocalSearchParams();

   const order=orders.find((o)=>o.id.toString()===id);

    return(
        <View style={{padding:10,gap:20,flex:1}}>
            <Stack.Screen options={{title:`Narudzba #${id}`}}/>



            <FlatList
                data={order.order_items}
                renderItem={({item})=><OrderItemListItem item={item}/>}
                contentContainerStyle={{gap:10}}
                ListHeaderComponent={()=><OrderListItem order={order}/>}
            />
        </View>
    );
};