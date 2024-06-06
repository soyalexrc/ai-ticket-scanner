import {TouchableOpacity, StyleSheet, View, Text} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import {useRouter} from "expo-router";
import {useAppSelector} from "@/store/hooks";
import {selectErrorTickets} from "@/store/features/tickets/ticketsSlice";

export default function DocumentsErrorButton() {
    const router = useRouter();
    const tickets = useAppSelector(selectErrorTickets);

    return (
        <View style={styles.wrapper}>
            <TouchableOpacity onPress={() => router.push('/(auth)/(modal)/documents-errors')}>
                <MaterialIcons name="error" size={50} color={Colors.light} />
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
        right: 0,
        width: 22,
        top: -10
    },
    badgeLabel: {
        color: Colors.light,
        textAlign: 'center'
    }
})
