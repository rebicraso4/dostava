import { createContext, useContext, useState } from 'react';

const RestaurantContext = createContext(null);

export const useRestaurant = () => {
    return useContext(RestaurantContext);
}; 

export const RestaurantProvider = ({ children }) => {
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);

    return (
        <RestaurantContext.Provider value={ {selectedRestaurant, setSelectedRestaurant} }>
            {children}
        </RestaurantContext.Provider>
    );
};
