import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { registerForPushNotificationsAsync } from "@/lib/notifications";
import * as Notifications from 'expo-notifications';
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

const NotificationProvider = ({ children }: PropsWithChildren) => {
    const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
    const { profile,loading } = useAuth();
    const [notification, setNotification] = useState<Notifications.Notification>();
    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();

    const savePushToken = async (newToken: string | undefined) => {
        if (!newToken || !profile?.id) {
            console.error('Invalid push token or profile is not set.');
            return;
        }

        try {
            setExpoPushToken(newToken);

            const { error } = await supabase
                .from('profiles')
                .update({ expo_push_token: newToken })
                .eq('id', profile.id);

            if (error) {
                console.error('Error updating push token:', error.message);
            }
        } catch (err) {
            console.error('Error saving push token:', err);
        }
    };

    useEffect(() => {
        if (loading) {
            return;
        }
        registerForPushNotificationsAsync().then((token) => {
            savePushToken(token);
        });

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            if (notificationListener.current) {
                Notifications.removeNotificationSubscription(notificationListener.current);
            }
            if (responseListener.current) {
                Notifications.removeNotificationSubscription(responseListener.current);
            }
        };
    }, [profile,loading]);

    return <>{children}</>;
};

export default NotificationProvider;
