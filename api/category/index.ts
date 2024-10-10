import { useQuery } from '@tanstack/react-query';
import {supabase} from "@/lib/supabase";

export const useCategoryList=(res_id:number)=>{
    return useQuery({
        queryKey:['restorans_category',res_id],
        queryFn:async ()=>{
            const {data,error}=await supabase.from('restorans_category').select(`category(*)`).eq('restorans_id',res_id);
            if (error)
            {
                throw new Error(error.message);
            }
            console.log(data);
            return data;
        },
    });
};
export const useCategoryListAdmin=()=>{
    return useQuery({
        queryKey:['category'],
        queryFn:async ()=>{
            const {data,error}=await supabase.from('category').select('*');
            if (error)
            {
                throw new Error(error.message);
            }
            return data;
        },
    });
};
export const useCategoryName=(id:number)=>{
    return useQuery({
        queryKey:['restorans_category'],
        queryFn:async ()=>{
            const {data,error}=await supabase.from('category').select('name').eq('id',id);
            if (error)
            {
                throw new Error(error.message);
            }
            return data;
        },
    });
};
