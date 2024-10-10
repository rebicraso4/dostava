import { useQuery} from "@tanstack/react-query";
import {supabase} from "@/lib/supabase";
import {useAuth} from "@/providers/AuthProvider";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {InsertTables, UpdateTables} from "@/types";

export const useAdminOrderList=({archived=false})=>{
    const statuses=archived?['Dostavljeno']:['Novo','Kuvanje','Isporuka'];
    const {session}=useAuth();
    const id=session?.user.id;

    return useQuery({
        queryKey:['orders',{archived}],
        queryFn:async ()=>{
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('res_admin_id')
                .eq('id', id)
                .single();

            const restoranID=profileData?.res_admin_id;

            const {data,error}=await supabase.from('orders').select('*').in('status',statuses).eq('res_id_ord',restoranID).order('created_at',{ascending:false});
            if (error)
            {
                throw new Error(error.message);
            }
            return data;
        },
    });
};

export const useMyOrderList=()=>{
    const {session}=useAuth();
    const id=session?.user.id;

    return useQuery({
        queryKey:['orders',{userId:id}],
        queryFn:async ()=>{
            if (!id) return null;
            const {data,error}=await supabase.from('orders').select('*').eq('user_id',id).order('created_at',{ascending:false});
            if (error)
            {
                throw new Error(error.message);
            }
            return data;
        },
    });
};

export const useOrderDetails=(id:number)=>{
    return useQuery({
        queryKey:['orders',id],
        queryFn:async ()=>{
            const {data,error}=await supabase.from('orders').select('*,order_items(*,products(*))').eq('id',id).single();
            if (error)
            {
                throw new Error(error.message);
            }
            return data;
        },
    });
}

export const useInsertOrder= () => {
    const queryClient=useQueryClient();
    const {session}=useAuth();
    const userId=session?.user.id;

    return useMutation({
        async mutationFn(data:InsertTables<'orders'>& {name:string,address:string,telephone:string,note:string}){
            if (!userId) {
                throw new Error("User is not authenticated");
            }

            const {error,data:newProduct} = await supabase.from('orders')
                .insert({ ...data,
                    user_id:userId,
                     name:data.name,
                    address:data.address,
                    telephone:data.telephone,
                    note:data.note,
                })
                .select()
                .single();
            if (error)
            {
                throw new Error(error.message);
            }
            return newProduct;
        },
        async onSuccess(){
            await queryClient.invalidateQueries(['orders']);
        },
    });
};
export const useUpdateOrder= () => {
    const queryClient=useQueryClient();
    return useMutation({
        async mutationFn({id,updatedFields}:{id:number;updatedFields:UpdateTables<'orders'>;}){
            const {error,data:updatedOrder} = await supabase.from('orders')
                .update(updatedFields)
                .eq('id',id)
                .select()
                .single();
            if (error)
            {
                throw new Error(error.message);
            }
            return updatedOrder;
        },
        async onSuccess(_,{id}){
            await queryClient.invalidateQueries(['orders']);
            await queryClient.invalidateQueries(['orders',id]);

        },
    });
};
