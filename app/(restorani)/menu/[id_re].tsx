import { ActivityIndicator, FlatList, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import ProductListItem from "@/components/ProductListItem";
import {Stack, useLocalSearchParams} from "expo-router";
import React, { useEffect, useState } from "react";
import { useCategoryList } from "@/api/category";
import { useProductList } from "@/api/products";
import {useRestoranName} from "@/api/restorans";

const HomeScreenTwo = () => {
    const { id_re } = useLocalSearchParams();
    const restaurantId = Number(id_re);
    const { data: category, isLoading: categoryLoading, error: categoryError } = useCategoryList(restaurantId);
    const { data: resName, isLoading: resLoading, error: resError } = useRestoranName(restaurantId);
    const [selectedCategory, setSelectedCategory] = useState(1);

    useEffect(() => {
        if (category && category.length > 0 && category[0].id) {
            setSelectedCategory(category[0].id);
        }
    }, [category]);

    const { data: products, isLoading: loadingProducts, error: productError } = useProductList(restaurantId, selectedCategory);

    if (categoryLoading || resLoading) {
        return <ActivityIndicator />;
    }

    if (categoryError || resError) {
        return <Text>Greška prilikom učitavanja kategorija.</Text>;
    }

    if (!category || category.length === 0) {
        return <Text>Nema dostupnih kategorija.</Text>;
    }

    const renderCategoryItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => setSelectedCategory(item.category.id)}
            style={[styles.categoryButton, selectedCategory === item.category.id && styles.selectedCategoryButton]}
        >
            <Text style={[styles.categoryText, selectedCategory === item.category.id && styles.selectedCategoryText]}>
                {item.category.name}
            </Text>
        </TouchableOpacity>
    );
console.log('res', resName);
    return (
        <View>
            <Stack.Screen options={{title:resName[0].name}} />
            <View style={styles.productListStyle}>
            <FlatList
                data={category}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item.category.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryList}
            />
            </View>
            {loadingProducts ? (
                <ActivityIndicator />
            ) : productError ? (
                <Text>Greška prilikom učitavanja proizvoda.</Text>
            ) : (
                <FlatList
                    data={products}
                    renderItem={({ item }) => <ProductListItem product={item} />}
                    contentContainerStyle={{ gap: 10, padding: 10, paddingBottom: 80 }}
                />
            )}
        </View>
    );
};

export default HomeScreenTwo;

const styles = StyleSheet.create({
    productListStyle: {
        marginTop: 5,
    },
    categoryList: {
        paddingVertical: 10,
        backgroundColor: '#f0f0f0',
    },
    categoryButton: {
        marginHorizontal: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        //borderColor: '#B2EBF2',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        minWidth: 80,
        height: 50,
        justifyContent: 'center',
    },
    selectedCategoryButton: {
        backgroundColor: '#032b44',
    },
    categoryText: {
        fontSize: 14,
        color: '#004D40',
        lineHeight: 20,
        textAlign: 'center',
    },
    selectedCategoryText: {
        fontWeight: 'bold',
        color: 'white',
    },
});
