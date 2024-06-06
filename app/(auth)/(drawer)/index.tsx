import Colors from '@/constants/Colors';
import {defaultStyles} from '@/constants/styles';
import {Ionicons} from '@expo/vector-icons';
import {Stack, useRouter} from 'expo-router';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import LottieView from "lottie-react-native";
import {useEffect, useRef} from "react";
import {useSQLiteContext} from "expo-sqlite/next";
import {clearTicketsTable, getTickets} from "@/utils/Database";
import {useAppSelector} from "@/store/hooks";
import {selectPendingTickets} from "@/store/features/tickets/ticketsSlice";

const Page = () => {
    const router = useRouter();
    const animation = useRef(null);
    const db = useSQLiteContext();
    const tickets = useAppSelector(selectPendingTickets);

    useEffect(() => {
        checkForTickets();
        // clearTickets()
    }, [tickets]);

    async function checkForTickets() {
        const pendingTickets = await getTickets(db, 'pending');
        console.log('sqlite', pendingTickets?.map(ticket => ({...ticket, base64: ticket.base64.substring(0, 10).concat('...')})))
    }

    async function clearTickets() {
        await clearTicketsTable(db);
    }

    return (
        <View style={defaultStyles.pageContainer}>
            <Stack.Screen
                options={{}}
            />
            <LottieView
                autoPlay
                ref={animation}
                style={{
                    width: 300,
                    height: 300,
                }}
                // Find more Lottie files at https://lottiefiles.com/featured
                source={require('../../../assets/animations/scan-animation.json')}
            />
            <TouchableOpacity style={styles.button} onPress={() => router.push('/(auth)/scanner')}>
                <Text style={styles.buttonLabel}>Iniciar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    logoContainer: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
        backgroundColor: '#000',
        borderRadius: 50,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.greyLight,
    },

    button: {
        marginTop: 20,
        backgroundColor: Colors.grey,
        width: 200,
        borderRadius: 12,
        padding: 10
    },
    buttonLabel: {
        textAlign: 'center',
        color: Colors.light
    },
    image: {
        resizeMode: 'cover',
    },
    page: {
        flex: 1,
    },
    label: {
        color: Colors.grey,
        fontSize: 16,
    },
});
export default Page;
