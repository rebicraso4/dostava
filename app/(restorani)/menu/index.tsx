import {ActivityIndicator, FlatList, View,Text} from 'react-native';
import RestoransListItem from '@/providers/RestoransListItem'
import {useRestoranList} from "@/api/restorans";

export default function HomeScreen() {


    const {data: restorans, error, isLoading } = useRestoranList();
    if (isLoading){
        return <ActivityIndicator/>;
    }
    if (error){
        return <Text>Greska u fetchproduktu</Text>;
    }
    return (
        <View>
            <FlatList data={restorans}
                      renderItem={({item})=> <RestoransListItem kafana={item}/>}
                      contentContainerStyle={{gap:10,padding:10, paddingBottom: 80}}
            />
             </View>

);
};