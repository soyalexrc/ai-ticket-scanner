import {ActivityIndicator, Image, LayoutAnimation, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {selectPendingTickets} from "@/store/features/tickets/ticketsSlice";
import Colors from "@/constants/Colors";
import {FlashList} from "@shopify/flash-list";
import {useRef} from "react";
import {Ticket} from "@/utils/interfaces";
import LottieView from "lottie-react-native";
import {useRouter} from "expo-router";
import {selectNetworkState} from "@/store/features/network/networkSlice";
import * as net from "net";

export default function Page() {
    const list = useRef<FlashList<Ticket> | null>(null);
    const animation = useRef(null);
    const tickets = useAppSelector(selectPendingTickets);
    const router = useRouter();
    const network = useAppSelector(selectNetworkState);
    //
    // useEffect(() => {
    //     console.log(tickets?.map(ticket => ({ id: ticket.id })));
    // }, [tickets]);

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
                <Text> No hay tickets pendientes por subir...</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={{ color: Colors.light }}>Volver</Text>
                </TouchableOpacity>
            </View>
        )
    }

    // console.log(tickets.map(ticket => ({id: ticket.id, uri: ticket.uri})))
    return (
        <View style={styles.container}>
            <FlashList
                data={tickets}
                ref={list}
                estimatedItemSize={50}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                renderItem={({item, index}) => (
                    <View style={styles.ticket} key={item.id}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{index + 1}</Text>
                        <Image style={styles.image} source={{uri: item.uri}} width={50} height={50}/>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                            <Text style={styles.ticketProgressLabel}>
                                {index === 0 && network.isConnected ? 'Subiendo...' : 'En cola por subir...'}
                            </Text>
                            {index === 0 && network.isConnected && <ActivityIndicator /> }
                            {index === 0 && !network.isConnected && <View style={styles.pending} />}
                            {index !== 0 && <View style={styles.pending} />}
                        </View>
                    </View>
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
    pending: {
        width: 10,
        height: 10,
        borderRadius: 50,
        backgroundColor: Colors.yellow
    },
    ticketProgressLabel: {
        fontSize: 20,
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
