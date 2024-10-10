import { useQuery } from '@tanstack/react-query';
import {supabase} from "@/lib/supabase";

export const useRestoranList=()=>{
    return useQuery({
        queryKey:['restorans'],
        queryFn:async ()=>{
            const {data,error}=await supabase.from('restorans').select('*');
            if (error)
            {
                throw new Error(error.message);
            }
            return data;
        },
    });
};

export const useRestoran=(id:uuid)=>{

    return useQuery({
    queryKey:['profiles'],
    queryFn:async ()=> {
        const {data: profileData, error: profileError} = await supabase
            .from('profiles')
            .select('res_admin_id')
            .eq('id', id)
            .single();

        if (profileError) {
            throw new Error(profileError.message);
        }
        return profileData;
    },
    });
};

export const useRestoranName=(id:number)=>{
    return useQuery({
        queryKey:['restorans',id],
        queryFn:async ()=>{
            const {data,error}=await supabase.from('restorans').select('name').eq('id',id);
            if (error)
            {
                throw new Error(error.message);
            }
            return data;
        },
    });
};