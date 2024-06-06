import {ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import LottieView from "lottie-react-native";
import Colors from "@/constants/Colors";
import {useAppSelector} from "@/store/hooks";
import {selectErrorTickets, selectPendingTickets} from "@/store/features/tickets/ticketsSlice";
import {useRef} from "react";
import {useRouter} from "expo-router";
import {FlashList} from "@shopify/flash-list";
import {Ticket} from "@/utils/interfaces";

export default function Page() {
    const tickets = useAppSelector(selectErrorTickets);
    const animation = useRef(null);
    const router = useRouter();
    const list = useRef<FlashList<Ticket> | null>(null);


    if (tickets.length === 0) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <LottieView
                    autoPlay
                    speed={0.5}
                    ref={animation}
                    style={{
                        width: 300,
                        height: 300,
                    }}
                    // Find more Lottie files at https://lottiefiles.com/featured
                    source={require('../../../assets/animations/empty-animation.json')}
                />
                <Text> No hay tickes con erorres...</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={{ color: Colors.light }}>Volver</Text>
                </TouchableOpacity>
            </View>
        )
    }
    return (
        <View style={styles.container}>
            <FlashList
                data={tickets}
                ref={list}
                estimatedItemSize={50}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                renderItem={({item, index}) => (
                    <TouchableOpacity onPress={() => {}} style={styles.ticket} key={item.id}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{index + 1}</Text>
                        <Image style={styles.image} source={{uri: item.uri}} width={50} height={50}/>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                            <Text style={styles.ticketProgressLabel}>Ver detalle de error</Text>
                            <View style={styles.error} />
                        </View>
                    </TouchableOpacity>
                ) }
            />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        flex: 1
    },
    separator: {
        backgroundColor: Colors.greyLight,
        marginVertical: 10,
        height: 1,
    },
    ticket: {
        borderStyle: 'solid',
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center'
    },
    error: {
        width: 10,
        height: 10,
        borderRadius: 50,
        backgroundColor: Colors.orange
    },
    ticketProgressLabel: {
        fontSize: 16,
    },
    image: {
        borderRadius: 8,
    },
    backButton: {
        marginTop: 10,
        backgroundColor: Colors.dark,
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 12,
    }
})
