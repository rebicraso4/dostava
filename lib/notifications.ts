import {Platform} from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import {supabase} from "@/lib/supabase";
import {Tables} from "@/types";

export async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } =
            await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (
            await Notifications.getExpoPushTokenAsync({
                projectId: Constants.expoConfig?.extra?.eas.projectId,
            })
        ).data;
        
    } else {

    }

    return token;
}

export async function sendPushNotification(expoPushToken: string,title:string,body:string) {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title,
        body,
        data: { someData: 'goes here' },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
}

 const getUserToken=async (userId)=>{
    const {data,error}=await supabase.from('profiles')
        .select('*')
        .eq('id',userId)
        .single();
return data?.expo_push_token;
}

export const notifyUserAboutOrderUpdate=async (order:Tables<'orders'>)=>{
    const token=await getUserToken(order.user_id);
    const title=`Vasa narudzba ${order.status}`;
    const body='body';
    sendPushNotification(token,title,body);
}

export const notifyUserAboutOrderNew=async (order:Tables<'orders'>)=>{
    const token=await getUserTokenAdmin(order.res_id_ord);
    const title=`Nova naruduzba ${order.name}`;
    const body='body';
    sendPushNotification(token,title,body);
}

const getUserTokenAdmin=async (res_id_ord)=>{
    const {data,error}=await supabase.from('profiles')
        .select('*')
        .eq('res_admin_id',res_id_ord)
        .single();
    return data?.expo_push_token;
}