import {Text, TouchableOpacity, View, StyleSheet} from "react-native";
import {FontAwesome5} from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import {useRouter} from "expo-router";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {removeFromQueue, selectPendingTickets} from "@/store/features/tickets/ticketsSlice";
import {useEffect} from "react";

export default function DocumentsQueueButton() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const tickets = useAppSelector(selectPendingTickets);


    // useEffect(() => {
    //     setTimeout(() => {
    //         if (tickets.length > 0) {
    //             dispatch(removeFromQueue({ type: 'pending', ticket: tickets[0] }))
    //         }
    //     }, 10000)
    // }, [tickets]);

    return (
        <View style={styles.wrapper}>
            <TouchableOpacity onPress={() => router.push('/(auth)/(modal)/documents-queue')}>
                <FontAwesome5 name="file-upload" size={45} color={Colors.light} />
            </TouchableOpacity>
            <View style={styles.badge}>
                <Text style={styles.badgeLabel}>{tickets.length}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        alignSelf: 'flex-end',
        position: 'relative'
    },
    badge: {
        position: 'absolute',
        backgroundColor: Colors.orange,
        borderRadius: 50,
        padding: 3,
        left: 0,
        width: 22,
        top: -10
    },
    badgeLabel: {
        color: Colors.light,
        textAlign: 'center'
    }
})
