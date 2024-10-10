import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { CartItem, Tables } from "@/types";
import { randomUUID } from "expo-crypto";
import { useInsertOrder } from "@/api/orders";
import { useRouter } from "expo-router";
import { useInsertOrderAddons, useInsertOrderItems } from "@/api/order-items";
import { notifyUserAboutOrderNew } from "@/lib/notifications";
import {  Alert } from "react-native";
import { useSizePrice } from "@/api/addons_sizes";

type Product = Tables<'products'>;

type CartType = {
    items: CartItem[],
    addItem: (product: Product, size: CartItem['size'], addons: number[]) => void;
    updateQuantity: (itemId: string, amount: -1 | 1) => void;
    total: number;
    res_id_ord: number;
    checkout: (name: string, address: string, telephone: string, note: string) => void;
};

const CartContext = createContext<CartType>({
    items: [],
    addItem: () => { },
    updateQuantity: () => { },
    total: 0,
    res_id_ord: 0,
    checkout: () => { },
});

const CartProvider = ({ children }: PropsWithChildren) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [res_id_ord, set_res_id_ord] = useState<number | null>(null);
    const [selectedSize, setSelectedSize] = useState<number | null>(null);
    const [selectedPrices, setSelectedPrices] = useState<{ [key: string]: number }>({});
    const { mutate: insertOrder } = useInsertOrder();
    const { mutate: insertOrderItems } = useInsertOrderItems();
    const { mutate: insertOrderAddons } = useInsertOrderAddons();
    const router = useRouter();

    const { data: sizeData, isLoading: sizeLoading, error: sizeError } = useSizePrice();


    useEffect(() => {
        if (selectedSize != undefined && sizeData && Array.isArray(sizeData) && sizeData.length > 0) {

            const sizeIndex = sizeData.findIndex(
                (item) => item.product_id === items[0].product.id && item.size_id === selectedSize);

            if (sizeIndex >= 0 && sizeIndex < sizeData.length && sizeData[sizeIndex]?.price) {
                console.log('index ',sizeIndex);
                const priceToAdd = parseFloat(sizeData[sizeIndex].price);

                setSelectedPrices(prevPrices => {
                    return {
                        ...prevPrices,
                        [sizeIndex]: priceToAdd,
                    };
                });

                setSelectedSize(null);
            } else {
                console.warn('Size data is missing or invalid for selectedSize:', selectedSize);
            }
        }
    }, [selectedSize, sizeData]);


    const addItem = (product: Product, size: number, addons: number[]) => {
        const newCartItem: CartItem = {
            id: randomUUID(),
            product,
            product_id: product.id,
            product_size_id: size,
            quantity: 1,
            addons
        };

        if (items.length === 0) {

            set_res_id_ord(product.res_id);
            setItems([newCartItem]);
            setSelectedSize(size);

        } else {
            if (res_id_ord === product.res_id) {

                const existingItem = items.find(
                    (item) =>
                        item.product_id === product.id &&
                        item.product_size_id === size &&
                        compareAddons(item.addons, addons)
                );

                if (existingItem) {

                    updateQuantity(existingItem.id, 1);
                } else {
                    setItems([newCartItem, ...items]);
                    setSelectedSize(size);

                }
            } else {
                Alert.alert(
                    'Upozorenje',
                    'Ne možete kombinovati proizvode iz različitih restorana. Želite li da ispraznite korpu i dodate novi proizvod?',
                    [
                        { text: 'Ne', style: 'cancel' },
                        {
                            text: 'Da',
                            onPress: () => {
                                setItems([newCartItem]);
                                set_res_id_ord(product.res_id);
                            },
                        },
                    ],
                    { cancelable: false }
                );
            }
        }
    };

    const compareAddons = (addons1: number[], addons2: number[]) => {
        if (addons1.length !== addons2.length) return false;
        const sorted1 = [...addons1].sort();
        const sorted2 = [...addons2].sort();
        return sorted1.every((val, index) => val === sorted2[index]);
    };

    const updateQuantity = (itemId: string, amount: -1 | 1) => {
        setItems(prevItems => {
            const updatedItems = prevItems.map(item =>
                item.id !== itemId
                    ? item
                    : { ...item, quantity: item.quantity + amount }
            );

            const filteredItems = updatedItems.filter(item => item.quantity > 0);

            if (filteredItems.length < prevItems.length) {
                const removedItem = prevItems.find(item => item.id === itemId);
                const sizeIndex = sizeData.findIndex(
                    (item) => item.product_id === removedItem.product_id && item.size_id === removedItem.product_size_id);
                if (removedItem) {
                    setSelectedPrices(prevPrices => {
                        const updatedPrices = { ...prevPrices };
                        delete updatedPrices[sizeIndex];
                        return updatedPrices;
                    });
                }
            }

            return filteredItems;
        });
    };

    const totalSelectedPrice = items.reduce((sum, item) => {
        console.log(sizeData);
        if (sizeData) {
            const sizeIndexNew = sizeData.findIndex(
                (iteme) => iteme.product_id === item.product.id && iteme.size_id === item.product_size_id);
            let nova=0;
            if (sizeIndexNew===-1) {
                 nova=item.product.price * item.quantity
            }
            const price = selectedPrices[sizeIndexNew] || 0;

            return sum + price * item.quantity+nova;
        }
    }, 0);

    const total = totalSelectedPrice;

    const clearCart = () => {
        setItems([]);
        setSelectedPrices({});
    }

    const checkout = (name: string, address: string, telephone: string, note: string) => {
        insertOrder({ total, res_id_ord: res_id_ord!, name, address, telephone, note }, {
            onSuccess: saveOrderItems,
        });
    };

    const saveOrderItems = (order: Tables<'orders'>) => {
        const orderItems = items.map((cartItem) => ({
            order_id: order.id,
            product_id: cartItem.product_id,
            quantity: cartItem.quantity,
            size: cartItem.size,
            product_size_id: cartItem.product_size_id,
            }));
        
        insertOrderItems(orderItems, {
            onSuccess: async (insertedItems) => {
                const orderAddons = [];

                for (let i = 0; i < insertedItems.length; i++) {
                    const cartItem = items[i];
                    const orderItemId = insertedItems[i].id;

                    cartItem.addons.forEach((addonId) => {
                        orderAddons.push({
                            order_item_id: orderItemId,
                            product_addon_id: addonId,
                        });
                    });
                }

                await insertOrderAddons(orderAddons);

                clearCart();
                router.push(`/(restorani)/orders/${order.id}`);
            },
        });

        notifyUserAboutOrderNew({ ...order });
    };

    return (
        <CartContext.Provider value={{ items, addItem, updateQuantity, total, checkout }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;

export const useCart = () => useContext(CartContext);
