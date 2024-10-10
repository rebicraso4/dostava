import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import {data} from "@remix-run/router/utils";

type AuthData = {
    session: Session | null;
    profile: any;
    loading: boolean;
    isAdmin: boolean;
    res_admin_id: number | null;
};

const AuthContext = createContext<AuthData>({
    session: null,
    loading: true,
    profile: null,
    isAdmin: false,
    res_admin_id: null,
});

export default function AuthProvider({ children }: PropsWithChildren) {
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [res_admin_id, set_res_admin_id] = useState<number | null>(null);

    useEffect(() => {
        const fetchSession = async () => {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            setSession(session);
            if (!session || sessionError) {
                setLoading(false);
                setProfile(data);
                return;
            }

            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (profileError) {
                console.error('Error fetching profile:', profileError);
                setProfile(null);
                setIsAdmin(false);
            } else {
                setProfile(profileData || null);
                setIsAdmin(profileData?.group === "ADMIN");
                set_res_admin_id(profileData?.res_admin_id || null);
            }

            setLoading(false);
        };

        fetchSession();

        const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) {
                supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single()
                    .then(({ data, error }) => {
                        if (error) {
                            console.error('Error fetching profile on auth state change:', error);
                            setProfile(null);
                            setIsAdmin(false);
                        } else {
                            setProfile(data || null);
                            setIsAdmin(data?.group === "ADMIN");
                            set_res_admin_id(data?.res_admin_id || null);
                        }
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            } else {
                setProfile(null);
                setIsAdmin(false);
                setLoading(false);
            }
        });

        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ session, loading, profile, isAdmin, res_admin_id }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
