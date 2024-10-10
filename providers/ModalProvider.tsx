import React, { createContext, useContext, useState, ReactNode } from 'react';
import {  Tables } from '@/types';
import { useCart } from '@/providers/CartProvider';
import ProductModal from "@/app/productModal";

type ModalContextType = {
    openModal: (product: Tables<'products'>) => void;
    closeModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Tables<'products'> | null>(null);
    const { addItem } = useCart();

    const openModal = (product: Tables<'products'>) => {
        setSelectedProduct(product);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedProduct(null);
    };

    const addToCart = (product: Tables<'products'>, size: number,addons: number[]) => {
        console.log(size);
        addItem(product,size,addons);
        closeModal();
    };

    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            {children}
            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    isVisible={modalVisible}
                    onClose={closeModal}
                    addToCart={addToCart}
                />
            )}
        </ModalContext.Provider>
    );
};
