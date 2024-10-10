import {useMutation} from "@tanstack/react-query";
import {InsertTables} from "@/types";
import {supabase} from "@/lib/supabase";

export const useInsertOrderItems = () => {

    return useMutation({
        async mutationFn(items: InsertTables<'order_items'>[]) {
            const updatedItems = await Promise.all(items.map(async (item) => {
                if (item.product_size_id !== undefined) {

                    const { data: sizeData, error: sizeError } = await supabase
                        .from('product_size')
                        .select('id')
                        .eq('product_id', item.product_id)
                        .eq('size_id', item.product_size_id);

                    if (sizeError) {
                        console.error('Greška pri čitanju size_id iz product_size tabele:', sizeError);
                        throw new Error('Greška pri čitanju size_id.');
                    }
                    const sizeId = sizeData[0].id;
                    item.product_size_id = sizeId;
                }

                return item;
            }));

            const { error, data: newProduct } = await supabase
                .from('order_items')
                .insert(updatedItems)
                .select();

            if (error) {
                throw new Error(error.message);
            }

            return newProduct;
        },
    });
};

export const useInsertOrderAddons= () => {

    return useMutation({
        async mutationFn(items:InsertTables<'order_items_addons'>[]){
            const {error,data:newAddons} = await supabase.from('order_items_addons')
                .insert(items)
                .select();
            if (error)
            {
                throw new Error(error.message);
            }
            return newAddons;
        },
    });
};
