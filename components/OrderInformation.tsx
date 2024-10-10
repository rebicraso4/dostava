import { View, Text, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import { Order } from '@/types';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';

dayjs.extend(relativeTime);

type OrderListItemProps = {
    order: Order;
};

const OrderInformation = ({ order }: OrderListItemProps) => {

    return (
            <Pressable style={styles.container}>
                <View style={styles.noteInfo}>
                    <Text style={styles.title}>{order.name}</Text>
                    <Text>{order.address}</Text>
                    <Text>{order.telephone}</Text>
                    <Text style={styles.note}>Napomena:</Text>
                    <Text>{order.note}</Text>
                    <Text style={styles.time}>{dayjs(order.created_at).fromNow()}</Text>

                </View>
                <View>
                <Text style={styles.status}>{order.status}</Text>
                    < Text style={styles.title}>{order.total.toFixed(2) ?? '0.00'} KM</Text>
                </View>

            </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontWeight: 'bold',
        marginVertical: 5,
    },
    time: {
        color: 'gray',
    },
    status: {
        fontWeight: '500',
    },
    note:{
    fontWeight: 'bold',
    marginTop:10,
    },
    noteInfo:{
        width:'78%'
}
});

export default OrderInformation;