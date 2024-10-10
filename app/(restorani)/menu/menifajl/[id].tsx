import {View, Text, StyleSheet, Pressable, ActivityIndicator, ScrollView} from 'react-native';
import {useLocalSearchParams, Stack, useRouter} from "expo-router";
import {defaultImage} from "@/components/ProductListItem";
import {useState} from "react/index";
import Button from "@/components/Button";
import {useCart} from '@/providers/CartProvider';
import {useProduct} from "@/api/products";
import RemoteImage from "@/components/RemoteImage";
import {useAddon, useSize} from "@/api/addons_sizes";
import React from "react";
import {Colors} from "@/constants/Colors";

const ProductDetailsScreen=()=> {
    const {id:idString} = useLocalSearchParams();
    const id = parseFloat(typeof idString==='string'?idString:idString[0]);
    const {data: product, error, isLoading} = useProduct(id);
    const router = useRouter();
    const {addItem} = useCart();
    const { data: sizes, isLoading: loadingSize } = useSize(id);
    const { data: addons, isLoading: loadingAddons  } = useAddon(id);
    const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
    const [selectedSize, setSelectedSize] = useState<number>();
    const [selectedSizePrice, setSelectedSizePrice] = useState<number>(product?.price || 0);

    const selectSize = (sizeId: number, price: number) => {
        setSelectedSize(sizeId);
        setSelectedSizePrice(price);
    };

    const toggleAddonSelection = (addonId: number) => {
        setSelectedAddons((prevSelected) => {
            if (prevSelected.includes(addonId)) {
                return prevSelected.filter(id => id !== addonId);
            } else {
                return [...prevSelected, addonId];
            }
        });
    };

    if (loadingSize || loadingAddons) {
        return <ActivityIndicator size="large" color={Colors.light.tint} />;
    }

    const addToCart = () => {
        if (!product) {
            return;
        }
        addItem(product, selectedSize, selectedAddons);
        router.push('/cart');
    }

    if (isLoading) {
        return <ActivityIndicator />;
    }

    if (error) {
        return <Text>Greska u fetch products</Text>;
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Stack.Screen options={{ title: product?.name }} />
                <RemoteImage path={product.image}
                             fallback={defaultImage}
                             style={styles.image} />
                {product.description !==null && (<>
                <Text style={styles.title}>Opis proizvoda:</Text>
                <Text style={styles.description}>{product.description}</Text></>
                    )}
                {sizes.length > 0 && (
                    <>
                        <Text style={styles.title}>Izaberi veličinu za {product.name}:</Text>
                        <View style={styles.addonsSelector}>
                            {sizes.map((size) => (
                                <View key={size.size_id.id} style={styles.checkboxContainer}>
                                    <Pressable
                                        onPress={() => selectSize(size.size_id.id, size.price)}
                                        style={[styles.checkbox, selectedSize === size.size_id.id && styles.checked]}
                                    />
                                    <Text style={styles.checkboxLabel}>{size.size_id.size} (+{size.price}KM)</Text>
                                </View>
                            ))}
                        </View>
                    </>
                )}

                {addons.length > 0 && (
                    <>
                        <Text style={styles.title}>Dodaj priloge:</Text>
                        <View style={styles.addonsSelector}>
                            {addons.map((addon) => (
                                <View key={addon.id} style={styles.checkboxContainer}>
                                    <Pressable
                                        onPress={() => toggleAddonSelection(addon.id)}
                                        style={[styles.checkbox, selectedAddons.includes(addon.id) && styles.checked]}
                                    />
                                    <Text style={styles.checkboxLabel}>{addon.addon_id.name} (+{addon.addon_id.price}KM)</Text>
                                </View>
                            ))}
                        </View>
                    </>
                )}
                <Text style={styles.price}>{selectedSize ? selectedSizePrice : product.price.toFixed(2) ?? '0.00'} KM</Text>
                <Button onPress={addToCart} text='Dodaj u korpu' />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    container: {
        backgroundColor: '#f9f9f9',
        flex: 1,
        padding: 15,
    },
    image: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#333',
        textAlign: 'center',
    },
    sizes: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
    },
    size: {
        backgroundColor: '#e0e0e0',
        width: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        aspectRatio: 1,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 5,
    },
    sizeText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    sizeSelector: {
        width: '100%',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    addonsSelector: {
        width: '100%',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: Colors.light.tint,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        marginRight: 10,
    },
    checked: {
        backgroundColor: Colors.light.tint,
    },
    checkboxLabel: {
        fontSize: 16,
        color: '#333',
    },
    button: {
        backgroundColor: Colors.light.tint,
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 30,
        alignItems: 'center',
        marginVertical: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 15,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#333',
        marginVertical: 10,
        lineHeight: 22,
        paddingHorizontal: 10,
        textAlign:'center',
    },
});

export default ProductDetailsScreen;
