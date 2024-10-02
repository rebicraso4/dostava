import { Text, StyleSheet, View, Pressable } from 'react-native';
import { Tables } from "@/types";
import { Link, useSegments } from 'expo-router';
import RemoteImage from "@/components/RemoteImage";

export const defaultImage = 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png';

type RestoransListItemProps = {
    kafana: Tables<'restorans'>;
}

const RestoransListItem = ({ kafana }: RestoransListItemProps) => {
    const segments = useSegments();

    const workHours = kafana.work_hours ? kafana.work_hours.split('-') : ['00:00', '00:00'];
    const [openingTime, closingTime] = workHours;
    const isOpen = isRestaurantOpen(openingTime, closingTime);

    return (
        <Link href={`/${segments[0]}/menu/${kafana.id}`} asChild>
            <Pressable style={styles.container}>
                <View style={styles.imageContainer}>
                    <RemoteImage
                        path={kafana.image ?? defaultImage}
                        fallback={defaultImage}
                        style={styles.image}
                        resizeMode="contain"
                    />
                    <View style={[styles.openBadge, isOpen ? styles.open : styles.closed]}>
                        <Text style={isOpen ? styles.openText : styles.closedText}>
                            {isOpen ? "Otvoreno" : "Zatvoreno"}
                        </Text>
                    </View>
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.title}>{kafana.name}</Text>
                    <Text style={styles.address}>{kafana.address}</Text>
                    <Text style={styles.hours}>Radno vreme: {kafana.work_hours}</Text>
                </View>
            </Pressable>
        </Link>
    );
};

const isRestaurantOpen = (openingTime: string, closingTime: string): boolean => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    const [openHour, openMinute] = openingTime.split(':').map(Number);
    const [closeHour, closeMinute] = closingTime.split(':').map(Number);

    if (closeHour < openHour) {
        const isAfterOpening = (currentHour > openHour) || (currentHour === openHour && currentMinute >= openMinute);
        const isBeforeMidnight = currentHour < 24;
        const isAfterMidnight = (currentHour < closeHour) || (currentHour === closeHour && currentMinute < closeMinute);

        return isAfterOpening || isAfterMidnight;
    } else {
        const isAfterOpening = (currentHour > openHour) || (currentHour === openHour && currentMinute >= openMinute);
        const isBeforeClosing = (currentHour < closeHour) || (currentHour === closeHour && currentMinute < closeMinute);

        return isAfterOpening && isBeforeClosing;
    }
}

export default RestoransListItem;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        marginVertical: 10,
        overflow: 'hidden',
    },
    imageContainer: {
        flex: 1,
        position: 'relative',
        marginRight: 10,
    },
    infoContainer: {
        flex: 2,
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 10,
    },
    openBadge: {
        position: 'absolute',
        bottom: 10,
        left: 24,
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 4,
        minWidth: 60,
    },
    open: {
        backgroundColor: 'green',
    },
    closed: {
        backgroundColor: 'red',
    },
    openText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 10,
        textAlign:'center',
    },
    closedText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 10,
        textAlign:'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginVertical: 10,
    },
    address: {
        fontSize: 14,
        color: 'gray',
    },
    hours: {
        fontSize: 14,
        color: 'gray',
        marginTop: 4,
    },
});
