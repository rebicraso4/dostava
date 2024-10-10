import { Link, Stack } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Pressable, View, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useCart } from "@/providers/CartProvider";
import {useRestaurant} from "@/providers/RestaurantProvider";


export default function MenuStack() {
    const { items } = useCart();
    const { selectedRestaurant } = useRestaurant();
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <Stack
            screenOptions={{
                headerRight: () => (
                    <Link href="/cart" asChild>
                        <Pressable>
                            {({ pressed }) => (
                                <View style={{ marginRight: 15, position: 'relative' }}>
                                    <FontAwesome
                                        name="shopping-cart"
                                        size={30}
                                        color={Colors.light.tint}
                                        style={{ opacity: pressed ? 0.5 : 1 }}
                                    />
                                    {items.length > 0 && (
                                        <View
                                            style={{
                                                position: 'absolute',
                                                right: -10,
                                                top: -5,
                                                backgroundColor: 'red',
                                                borderRadius: 10,
                                                minWidth: 20,
                                                height: 20,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                paddingHorizontal: 5,
                                            }}
                                        >
                                            <Text style={{ color: 'white', fontSize: 12 }}>
                                                {totalQuantity}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            )}
                        </Pressable>
                    </Link>
                ),
            }}
        >
            <Stack.Screen
                name="index"
                options={{ title: 'Restorani' }}
            />
        </Stack>
    );
}
