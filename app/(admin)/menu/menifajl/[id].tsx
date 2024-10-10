import {View, Text, Image, StyleSheet, Pressable, ActivityIndicator, ScrollView} from 'react-native';
import {useLocalSearchParams, Stack, useRouter, Link} from "expo-router";
import {defaultImage} from "@/components/ProductListItem";
import {FontAwesome} from "@expo/vector-icons";
import {Colors} from "@/constants/Colors";
import {useProduct} from "@/api/products";
import RemoteImage from "@/components/RemoteImage";
import {useCategoryName} from "@/api/category";
import React from "react";
import {useAddon, useSize} from "@/api/addons_sizes";

const ProductDetailsScreen=()=>{
    const{id:idString}=useLocalSearchParams();
    const id=parseFloat(typeof idString==='string'?idString:idString[0]);
    const {data:product,error,isLoading}=useProduct(id);
    const {data:nameCat}=useCategoryName(product?.cat_id);
    const{ data: sizes,isLoading:loadingSize } = useSize(id);
    const{ data: addons,isLoading:loadingAddons  } = useAddon(id);

    if (isLoading || loadingSize || loadingAddons){
        return <ActivityIndicator/>
    }
    if (error){
        return <Text>Greska u fetch products</Text>;
    }
    if (!product) {
        return <Text>Product not found</Text>;
    }

    if (!nameCat || !nameCat[0]) {
        return <Text>Category not found</Text>;
    }
    return(
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
            <Stack.Screen options={{
                title: 'Menu',
                headerRight: () => (
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
                ),
            }} />

            <Stack.Screen options={{ title: product?.name }} />
            <RemoteImage path={product.image} fallback={defaultImage} style={styles.image} />
            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.categoryLabel}>Kategorija:</Text>
            <Text style={styles.categoryName}>{nameCat[0].name}</Text>

            {product.description !== null && (
                <>
                    <Text style={styles.descriptionTitle}>Opis proizvoda:</Text>
                    <Text style={styles.description}>{product.description}</Text>
                </>
            )}

            <View style={styles.priceContainer}>
                {sizes && sizes.length > 0 ? (
                    <>
                        <Text style={styles.price}>
                            {sizes[0]?.price?.toFixed(2) ?? '0.00'} KM
                        </Text>
                        <Text style={styles.descriptionTitle}>Velicina:</Text>
                        {sizes.map((size, index) => (
                            <Text key={index} style={styles.sizeText}>
                                {size.size_id.size} (+{size.price}KM)
                                {index < sizes.length - 1 ? ', ' : ''}
                            </Text>
                        ))}
                    </>
                ) : (
                    <Text style={styles.price}>{product.price.toFixed(2)} KM</Text>
                )}
            </View>

            {addons && addons.length > 0 && (
                <View style={styles.addonsContainer}>
                    <Text style={styles.addonsLabel}>Prilozi:</Text>
                    {addons.map((addon, index) => (
                        <Text key={index} style={styles.addonText}>
                            {addon.addon_id.name} (+{addon.addon_id.price}KM)
                            {index < addons.length - 1 ? ', ' : ''}
                        </Text>
                    ))}
                </View>
            )}
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
        backgroundColor: '#ffffff',
        flex: 1,
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    image: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 10,
        marginBottom: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    categoryLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#666',
    },
    categoryName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    descriptionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 15,
        color: '#333',
    },
    description: {
        fontSize: 16,
        color: '#555',
        marginBottom: 15,
    },
    priceContainer: {
        marginVertical: 10,
    },
    price: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#28a745',
    },
    sizeLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#555',
        marginTop: 10,
    },
    sizeText: {
        fontSize: 16,
        color: '#333',
    },
    addonsContainer: {
        marginTop: 15,
    },
    addonsLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    addonText: {
        fontSize: 16,
        color: '#333',
    },
});
export default ProductDetailsScreen;