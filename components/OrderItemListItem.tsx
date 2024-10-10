import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';
import {Colors} from '../constants/Colors';
import {OrderItem, Tables} from '@/types';
import { defaultImage } from './ProductListItem';
import RemoteImage from "@/components/RemoteImage";
import {useAddonName, useOrderItemAddons, useSizeName} from "@/api/addons_sizes";

type OrderItemListItemProps = {
    item:{products:Tables<'products'>} & Tables<'order_items'>;
};

const OrderItemListItem = ({ item }: OrderItemListItemProps) => {
    console.log('order ',item);
    const { data: sizeData, isLoading: sizeLoading, error: sizeError } =
        item.product_size_id ? useSizeName(item.product_size_id) : { data: null };

    const { data: addonData, isLoading: addonLoading, error: addonError } =useOrderItemAddons(item.id);
    if (sizeLoading ||addonLoading) return <Text>Loading...</Text>;
    if (sizeError||addonError ) return <Text>Error loading data</Text>;
    addonData?.forEach(item => {
        const addonName = item.product_addon_id.addon_id.name;
    });
    return (
        <View style={styles.container}>
            <RemoteImage path={item.products.image}
                         fallback={defaultImage}
                         style={styles.image}
                         resizeMode='contain'
            />
            <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.products.name}</Text>
                <View style={styles.subtitleContainer}>
                    {sizeData && sizeData.length > 0 ? (
                        <><Text style={styles.price}>{sizeData[0]?.price?.toFixed(2) ?? '0.00'} KM</Text>
                            <Text>Velicina: {sizeData[0]?.size_id?.size ?? 'N/A'}</Text>
                        </> ) : (
                        <Text style={styles.price}>{item.products.price.toFixed(2)} KM</Text>
                    )}
                </View>
                {addonData && addonData.length > 0 && (
                    <>
                        <View style={styles.addonContainer}>
                            <Text>Prilozi: </Text>
                            {addonData.map((addon, index) => (
                                <Text key={index}>
                                    {addon.product_addon_id.addon_id.name}{index < addonData.length - 1 ? ', ' : ''}
                                </Text>
                            ))}
                        </View>
                    </>
                )}

            </View>
            <View style={styles.quantitySelector}>
                <Text style={styles.quantity}>{item.quantity}</Text>
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
        alignItems: 'center',
    },
    addonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    image: {
        width: 75,
        aspectRatio: 1,
        alignSelf: 'center',
        marginRight: 10,
    },
    title: {
        fontWeight: '500',
        fontSize: 16,
        marginBottom: 5,
    },
    subtitleContainer: {
        flexDirection: 'row',
        gap: 5,
    },
    quantitySelector: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        marginVertical: 10,
    },
    quantity: {
        fontWeight: '500',
        fontSize: 18,
    },
    price: {
        color: Colors.light.tint,
        fontWeight: 'bold',
    },
});

export default OrderItemListItem;