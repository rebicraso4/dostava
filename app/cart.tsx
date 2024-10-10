import {View, Text, FlatList, Platform, StyleSheet} from 'react-native';
import {useCart} from "@/providers/CartProvider";
import CartListItem from "@/components/CartListItem";
import Button from "@/components/Button";
import {StatusBar} from "expo-status-bar";
import {Link} from 'expo-router';

const CartScreen = () => {
    const {items, total} = useCart();

    return (
        <View style={styles.container}>
            <FlatList
                data={items}
                renderItem={({item}) => <CartListItem cartItem={item}/>}
                contentContainerStyle={styles.listContent}
                ListFooterComponent={() => (
                    <View style={styles.footer}>
                        <Text style={styles.totalText}>Ukupno: {total.toFixed(2) ?? '0.00'} KM</Text>
                        <Link href={'/cartFinish'} asChild>
                            <Button text="Nastavi" style={styles.button}/>
                        </Link>
                    </View>
                )}
            />
            <StatusBar style={Platform.OS === 'ios' ? "light" : "auto"}/>
        </View>
    );
};

export default CartScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        paddingTop: 40,
    },
    listContent: {
        gap: 10,
        paddingBottom: 20,
    },
    footer: {
        bottom: 20,
        marginTop:15,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalText: {
        fontSize: 20,
        fontWeight: '500',
        marginBottom: 10,
    },
    button: {
        width: '100%',
        maxWidth: 300,
        alignSelf: 'center',
    },
});
