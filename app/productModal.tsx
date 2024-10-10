import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import { PizzaSize, Tables } from "@/types";
import { Colors } from "@/constants/Colors";
import {useAddon, useSize} from "@/api/addons_sizes";

type ProductModalProps = {
    product: Tables<'products'>;
    isVisible: boolean;
    onClose: () => void;
    addToCart: (product: Tables<'products'>, size: PizzaSize, selectedAddons: number[]) => void;
};

const ProductModal = ({ product, isVisible, onClose, addToCart }: ProductModalProps) => {
    const [selectedSize, setSelectedSize] = useState<number>();
    const{ data: sizes,isLoading:loadingSize } = useSize(product.id);
    const{ data: addons,isLoading:loadingAddons  } = useAddon(product.id);
    const [selectedAddons, setSelectedAddons] = useState<number[]>([]);

    useEffect(() => {
        if (!loadingSize && !loadingAddons && sizes?.length===0 && addons?.length === 0) {
            addToCart(product, selectedSize, []);
            onClose();
        }
    }, [loadingSize,loadingAddons, sizes, addons]);

    const toggleAddonSelection = (addonId: number) => {
        setSelectedAddons((prevSelected) => {
            if (prevSelected.includes(addonId)) {
                return prevSelected.filter(id => id !== addonId);
            } else {
                return [...prevSelected, addonId];
            }
        });
    };

    if (loadingSize) {
        return <ActivityIndicator size="large" color={Colors.light.tint} />;
    }
    if (loadingAddons) {
        return <ActivityIndicator />;
    }

    return (
        <Modal
            isVisible={isVisible}
            swipeDirection="down"
            onSwipeComplete={onClose}
            onBackdropPress={onClose}
            style={styles.modalContainer}
        >
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Dodaj u korpu</Text>

                {sizes.length>0 && (
                    <>
                        <Text style={styles.modalText}>Izaberi veličinu pice za {product.name}:</Text>
                <View style={styles.sizeSelector}>
                    {sizes.map((size) => (
                        <View  key={size.size_id.id} style={styles.checkboxContainer}>
                        <Pressable
                            onPress={() => setSelectedSize(size.size_id.id)}
                            style={[styles.checkbox, selectedSize === size.size_id.id && styles.checked]}
                        ></Pressable>
                            <Text style={styles.checkboxLabel}>{size.size_id.size} (+{size.price}KM)</Text>

                        </View>
                    ))}
                </View>
                    </>
                )}

                {addons.length>0 && (
                    <>
                <Text style={styles.modalText}>Dodaj priloge:</Text>
                <View style={styles.addonsSelector}>
                    {addons.map((addon) => (
                        <View key={addon.id} style={styles.checkboxContainer}>
                        <Pressable
                            onPress={() => toggleAddonSelection(addon.id)}
                            style={[styles.checkbox, selectedAddons.includes(addon.id) && styles.checked]}
                        ></Pressable>
                            <Text style={styles.checkboxLabel}>{addon.addon_id.name} (+{addon.addon_id.price}KM)</Text>

                        </View>
                    ))}
                </View>
                    </>
                )}

                <Pressable onPress={() => {
                    addToCart(product, selectedSize, selectedAddons);
                    onClose();
                }} style={styles.modalButton}>
                    <Text style={styles.modalButtonText}>Dodaj u korpu</Text>
            </Pressable>

                <Pressable onPress={onClose} style={styles.modalButton}>
                    <Text style={styles.modalButtonText}>Zatvori</Text>
                </Pressable>
            </View>
        </Modal>
    );
};

export default ProductModal;

const styles = StyleSheet.create({
    modalContainer: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContent: {
        height: '60%',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 10,
    },
    sizeSelector: {
        width: '100%',
        marginBottom: 20,
    },
    addonsSelector: {
        width: '100%',
        marginBottom: 20,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: Colors.light.tint,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    checked: {
        backgroundColor: Colors.light.tint,
    },
    checkboxLabel: {
        fontSize: 16,
        color: 'black',
    },
    modalButton: {
        backgroundColor: Colors.light.tint,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 10,
        width: '80%',
    },
    modalButtonText: {
        color: 'white',
        fontSize: 18,
    },
});
