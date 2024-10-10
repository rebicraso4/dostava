import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {supabase} from "@/lib/supabase";


export const useSize=(product_id:number)=>{
    return useQuery({
        queryKey:['product_size',product_id],
        queryFn:async ()=> {
            const {data, error} = await supabase
                .from('product_size')
                .select('*,size_id(*)')
                .eq('product_id', product_id);

            if (error) {
                console.error('Error fetching pizza sizes useSize:', error);
            }
            return data;
        }});
};
export const useAddon=(product_id:number)=>{
    return useQuery({
        queryKey:['product_addons',product_id],
        queryFn:async ()=> {
            const { data, error } = await supabase
                .from('product_addons')
                .select('*,addon_id(*)')
                .eq('product_id',product_id);
            if (error) {
                console.error('Error fetching pizza sizes useAddon:', error);
            }
            return data;
        }});
};

export const useAddonName=(id:number[])=>{
    return useQuery({
        queryKey:['product_addons',id],
        queryFn:async ()=> {
            const validIds = id.filter((addonId) => addonId !== undefined);

            if (validIds.length === 0) {
                return [];
            }
            const { data, error } = await supabase
                .from('product_addons')
                .select('addon_id(name)')
                .in('id',id);
            if (error) {
                console.error('Error fetching pizza sizes useAddonName:', error);
            }
            return data;
        }});
};
export const useSizeName=(id:number)=>{
    return useQuery({
        queryKey:['product_size',id],
        queryFn:async ()=> {
            const {data, error} = await supabase
                .from('product_size')
                .select('*,size_id(*)')
                .eq('id', id);

            if (error) {
                console.error('Error fetching pizza sizes useSizeName:', error);
            }
            return data;
        }});
};

export const useSizePrice=()=>{
    return useQuery({
        queryKey:['product_size'],
        queryFn:async ()=> {
            const {data, error} = await supabase
                .from('product_size')
                .select('*')

            if (error) {
                console.error('Error fetching pizza sizes useSizePrice:', error);
            }
            return data;
        }});
};

export const useOrderItemAddons = (orderItemId: number) => {
    return useQuery({
        queryKey: ['order_items_addons', orderItemId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('order_items_addons')
                .select(`
                    product_addon_id,
                    product_addon_id(addon_id(name))
                `)
                .eq('order_item_id', orderItemId);

            if (error) {
                console.error('Error fetching order item addons:', error);
                return null;
            }

            return data;
        },
        retry: 1,
        onError: (error) => {
            console.error('Query failed:', error);
        }
    });
};

export const useAddonOld=()=>{
    return useQuery({
        queryKey:['addons'],
        queryFn:async ()=> {
            const { data, error } = await supabase
                .from('addons')
                .select('*')

            if (error) {
                console.error('Error fetching addons :', error);
            }
            return data;
        }});
};

export const useInsertProductAddons = () => {
    const queryClient = useQueryClient();

    return useMutation({
        async mutationFn({ productId, addons }) {
            const { error } = await supabase
                .from('product_addons')
                .insert(addons.map(addon => ({ product_id: productId, addon_id: addon.id })));

            if (error) {
                throw new Error(error.message);
            }
        },
       /* async onSuccess() {
            await queryClient.invalidateQueries(['product_addons']);
        },*/
    });
};

export const useUpdateProductAddons = () => {
    const queryClient = useQueryClient();

    return useMutation({
        async mutationFn({ productId, addons }) {
            const { error: deleteError } = await supabase
                .from('product_addons')
                .delete()
                .eq('product_id', productId);

            if (deleteError) {
                throw new Error(deleteError.message);
            }

            const { error: insertError } = await supabase
                .from('product_addons')
                .insert(addons.map(addon => ({ product_id: productId, addon_id: addon.id })));

            if (insertError) {
                throw new Error(insertError.message);
            }
        },
       /* async onSuccess() {
            // Invalidejte keširane podatke o dodatcima proizvoda
            await queryClient.invalidateQueries(['product_addons']);
        },*/
    });
};

export const useSizeOld=()=>{
    return useQuery({
        queryKey:['meal_size'],
        queryFn:async ()=> {
            const { data, error } = await supabase
                .from('meal_size')
                .select('*')

            if (error) {
                console.error('Error fetching addons :', error);
            }
            return data;
        }});
};

export const useInsertProductSize = () => {
    const queryClient = useQueryClient();

    return useMutation({
        async mutationFn({ productId, sizes }) {
            for (const size of sizes) {
                const { data: sizeData, error: sizeError } = await supabase
                    .from('meal_size')
                    .select('id')
                    .eq('size', size.size)
                    .single();

                if (sizeError) {
                    console.error('Greška pri čitanju size_id iz meal_size tabele:', sizeError);
                    continue;
                }

                const sizeId = sizeData.id;

                const { error: insertError } = await supabase
                    .from('product_size')
                    .insert({
                        product_id: productId,
                        size_id: sizeId,
                        price: size.price
                    });

                if (insertError) {
                    console.error('Greška pri ubacivanju u product_size:', insertError);
                }
            }
        },
      /*  async onSuccess() {
            await queryClient.invalidateQueries(['product_size']);
        },*/
    });
};

export const useUpdateProductSizes = () => {
    const queryClient = useQueryClient();

    return useMutation({
        async mutationFn({ productId, sizes }) {
            const { error: deleteError } = await supabase
                .from('product_size')
                .delete()
                .eq('product_id', productId);

            if (deleteError) {
                throw new Error(deleteError.message);
            }

            for (const size of sizes) {
                const { data: sizeData, error: sizeError } = await supabase
                    .from('meal_size')
                    .select('id')
                    .eq('size', size.size)
                    .single();

                if (sizeError) {
                    console.error('Greška pri čitanju size_id iz meal_size tabele:', sizeError);
                    continue;
                }

                const sizeId = sizeData.id;

                const { error: insertError } = await supabase
                    .from('product_size')
                    .insert({
                        product_id: productId,
                        size_id: sizeId,
                        price: size.price
                    });

                if (insertError) {
                    console.error('Greška pri ubacivanju u product_size:', insertError);
                }
            }
        },
       /* async onSuccess() {
            // Invalidejte keširane podatke o dodatcima proizvoda
            await queryClient.invalidateQueries(['product_addons']);
        },*/
    });
};

export const useSizeNamePrice=(idSize:number,idProduct:number)=>{
    return useQuery({
        queryKey:['product_size',idSize,idProduct],
        queryFn:async ()=> {
            const {data, error} = await supabase
                .from('product_size')
                .select('*,size_id(*)')
                .eq('size_id', idSize)
                .eq('product_id',idProduct);

            if (error) {
                console.error('Error fetching pizza sizes useSizeName:', error);
            }
            return data;
        }});
};
