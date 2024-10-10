import { Text, StyleSheet, View, Pressable } from 'react-native';
import { Colors } from "@/constants/Colors";
import { Link, useSegments } from 'expo-router';
import RemoteImage from "@/components/RemoteImage";
import { Tables } from "@/types";
import { useModal } from '@/providers/ModalProvider';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const defaultImage = 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png';

type ProductListItemProps = {
    product: Tables<'products'>;
};

const ProductListItem = ({ product }: ProductListItemProps) => {
    const segments = useSegments();
    const { openModal } = useModal();
    const isAdminRoute = segments.includes('(admin)');

    return (
        <Link href={`/${segments[0]}/menu/menifajl/${product.id}`} asChild>
            <Pressable style={styles.container}>
                <RemoteImage
                    path={product.image}
                    fallback={defaultImage}
                    style={styles.image}
                    resizeMode='cover'
                />

                <View style={styles.infoContainer}>
                    <Text style={styles.title}>{product.name}</Text>
                    <Text style={styles.price}>{product.price.toFixed(2) ?? '0.00'} KM</Text>
                </View>

                {!isAdminRoute && (
                    <Pressable onPress={() => openModal(product)} style={styles.addButton}>
                        <Text>
                        <Icon name="add-shopping-cart" size={24} color="white" />
                        </Text>
                    </Pressable>
                )}
            </Pressable>
        </Link>
    );
};

export default ProductListItem;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 12,
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    price: {
        color: Colors.light.tint,
        fontWeight: 'bold',
        fontSize: 16,
    },
    addButton: {
        width: 40,
        height: 40,
        backgroundColor: Colors.light.tint,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
