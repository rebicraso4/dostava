import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {supabase} from "@/lib/supabase";
import {useAuth} from "@/providers/AuthProvider";

export const useProductList = (restaurantId, categoryId) => {
    return useQuery({
        queryKey: ['products', restaurantId, categoryId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('res_id', restaurantId)
                .eq('cat_id', categoryId);

            if (error) {
                throw new Error(error.message);
            }
            return data;
        },
        enabled: !!restaurantId && !!categoryId,
    });
};

export const useProduct=(id:number)=>{
    return useQuery({
        queryKey:['products',id],
        queryFn:async ()=>{
            const {data,error}=await supabase.from('products').select('*').eq('id',id).single();
            if (error)
            {
                throw new Error(error.message);
            }
            return data;
        },
    });
}

export const useInsertProduct= () => {
    const queryClient=useQueryClient();
    const {session}=useAuth();
    const id=session?.user.id;

    return useMutation({
        async mutationFn(data:any){
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('res_admin_id')
                .eq('id', id)
                .single();

            const restoranID=profileData?.res_admin_id;

            const { data: newProduct, error } = await supabase
                .from('products')
                .insert({
                    name: data.name,
                    price: data.price,
                    image: data.image,
                    cat_id: data.cat_id,
                    res_id: restoranID,
                    description:data.description,
                })
                .select('id')
                .single();

            if (error) {
                console.error('Error inserting product:', error);
                throw new Error(error.message);
            }
            console.log('New Product Data:', newProduct);
            return newProduct;
        },
        async onSuccess(){
            await queryClient.invalidateQueries(['products']);
        },
    });
};

export const useUpdateProduct= () => {
    const queryClient=useQueryClient();
    return useMutation({
        async mutationFn(data:any){
            const {error,data:updateProduct} = await supabase.from('products').update({
                name:data.name,
                price:data.price,
                image:data.image,
                cat_id:data.cat_id,
                description:data.description,
            })
                .eq('id',data.id)
                .select()
                .single();
            if (error)
            {
                throw new Error(error.message);
            }
            return updateProduct;
        },
        async onSuccess(_,{id}){
            await queryClient.invalidateQueries(['products']);
            await queryClient.invalidateQueries(['product',id]);

        },
    });
};

export const useDeleteProduct=()=>{
    const queryClient=useQueryClient();
    return useMutation({
        async mutationFn(id:number){
            const{error}=await supabase.from('products').delete().eq('id',id);
            if (error)
            {
                throw new Error(error.message);
            }
        },
      async  onSuccess(){
            await queryClient.invalidateQueries(['products']);
        }
        });
};