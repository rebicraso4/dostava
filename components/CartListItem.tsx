import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import React from 'react';
import { Colors } from "@/constants/Colors";
import { CartItem } from "@/types";
import { defaultImage } from "@/components/ProductListItem";
import {FontAwesome, FontAwesome5} from '@expo/vector-icons';
import { useCart } from "@/providers/CartProvider";
import RemoteImage from "@/components/RemoteImage";
import {useAddonName, useSizeNamePrice} from "@/api/addons_sizes";

type CartListItemProps = {
    cartItem: CartItem;
};

const CartListItem = ({ cartItem }: CartListItemProps) => {
    const { updateQuantity } = useCart();

    const { data: sizeData, isLoading: sizeLoading, error: sizeError } =
        cartItem.product_size_id ? useSizeNamePrice(cartItem.product_size_id,cartItem.product_id) : { data: null };

    const { data: addonData, isLoading: addonLoading, error: addonError } =
        cartItem.addons.length > 0 ? useAddonName(cartItem.addons) : { data: [] };

    if (sizeLoading || addonLoading) return <Text>Loading...</Text>;
    if (sizeError || addonError) return <Text>Error loading data</Text>;

    console.log('sizedata ',sizeData);
    return (
        <View style={styles.container}>
            <RemoteImage
                path={cartItem.product.image}
                fallback={defaultImage}
                style={styles.image}
                resizeMode='contain'
            />
            <View style={styles.content}>
                <Text style={styles.title}>{cartItem.product.name}</Text>

                <View style={styles.subtitleContainer}>
                    {sizeData && sizeData.length > 0 ? (
                        <>
                            <Text style={styles.price}>{sizeData[0]?.price?.toFixed(2) ?? '0.00'} KM</Text>
                            <Text>Velicina: {sizeData[0]?.size_id?.size ?? 'N/A'}</Text>
                        </> ) : (
                        <Text style={styles.price}>{cartItem.product.price.toFixed(2)} KM</Text>
                    )}
                </View>

                {addonData && addonData.length > 0 && (
                    <View style={styles.addonContainer}>
                        <Text>Prilozi: </Text>
                        {addonData.map((addon, index) => (
                            <Text key={index}>
                                {addon.addon_id.name}{index < addonData.length - 1 ? ', ' : ''}
                            </Text>
                        ))}
                    </View>
                )}
            </View>

            <View style={styles.quantitySelector}>
                {cartItem.quantity === 1 ? (
                    <FontAwesome5
                        onPress={() => updateQuantity(cartItem.id,-1)}
                        name="trash-alt"
                        color="gray"
                        size={17}
                        style={styles.quantityButton}
                    />
                ) : (
                    <FontAwesome
                        onPress={() => updateQuantity(cartItem.id, -1)}
                        name="minus"
                        color="gray"
                        style={styles.quantityButton}
                    />
                )}
                <Text style={styles.quantity}>{cartItem.quantity}</Text>
                <FontAwesome
                    onPress={() => updateQuantity(cartItem.id, 1)}
                    name="plus"
                    color="gray"
                    style={styles.quantityButton }
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 5,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    image: {
        width: 75,
        aspectRatio: 1,
        alignSelf: 'center',
        marginRight: 10,
    },
    content: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    title: {
        fontWeight: '500',
        fontSize: 16,
        marginBottom: 5,
    },
    subtitleContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5,
        marginBottom: 5,
    },
    addonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 5,
    },
    quantitySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 25,
        paddingHorizontal: 10,
        paddingVertical: 5,
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        alignSelf: 'center',
    },

    quantity: {
        fontWeight: '500',
        fontSize: 18,
        textAlign: 'center',
        marginHorizontal: 10,
    },
    price: {
        color: Colors.light.tint,
        fontWeight: 'bold',
    },
    quantityButton: {
        padding: 8,
    },
});

export default CartListItem;
