import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import { Tables} from "@/types";

import {useState} from "react";


type CategoryListItemProps={
    items:Tables<'category'>[];
}
const CategoryListItem=({items}:CategoryListItemProps)=>{
    const [selectedCategory, setSelectedCategory] = useState(items[0]?.id);

    return (
        <TouchableOpacity onPress={() => setSelectedCategory(items.id)} style={styles.categoryButton}>
            <Text style={[styles.categoryText, selectedCategory === items.id && styles.selectedCategory]}>
                {items.name}
            </Text>
        </TouchableOpacity>

    );
};
export default CategoryListItem;

const styles = StyleSheet.create({

    categoryList: {
        paddingVertical: 10,
        backgroundColor: '#f0f0f0',
    },
    categoryButton: {
        marginHorizontal: 10,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#ccc',
    },
    categoryText: {
        fontSize: 16,
    },
    selectedCategory: {
        fontWeight: 'bold',
        color: '#000',
    },
})
