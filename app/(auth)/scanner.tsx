import {

    CameraType,
    CameraView,
    useCameraPermissions
} from 'expo-camera';
import {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Alert, Button, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Colors from "@/constants/Colors";
import DocumentsQueueButton from "@/components/scanner/DocumentsQueueButton";
import DocumentsErrorButton from "@/components/scanner/DocumentsErrorButton";
import {addToQueue, removeFromQueue, selectPendingTickets} from "@/store/features/tickets/ticketsSlice";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import * as Crypto from 'expo-crypto';
import {Ticket} from "@/utils/interfaces";
import {useSQLiteContext} from "expo-sqlite/next";
import {addTicketToQueue, removeTicketFromQueue} from "@/utils/Database";
import {selectNetworkState} from "@/store/features/network/networkSlice";
import * as net from "net";


export default function Page() {
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<any>(null);
    const dispatch = useAppDispatch();
    const tickets = useAppSelector(selectPendingTickets);
    const network = useAppSelector(selectNetworkState);
    const db = useSQLiteContext();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        if (!isSubmitting) {
            processQueue(tickets);
        }
    }, [tickets, isSubmitting]);

    async function processQueue(ticketsList: Ticket[]) {
        const data = [...ticketsList];
        if (data.length === 0) return;
        // console.log('inicio de funcion', data.length)
        setIsSubmitting(true);
        const ticket = data.shift()!;

        try {
            if (network.isConnected) {
                await readTextFromImage(ticket.base64);
                await removeTicketFromStore(ticket.id, 'pending');
                // console.log('respuesta de peticion', data.length, response)
            }
        } catch (e) {
            console.error(e);
            await removeTicketFromStore(ticket.id, 'pending');
            dispatch(addToQueue({ticket, type: 'error'}));
        } finally {
            // console.log('finally de try / catch', data.length)

            setIsSubmitting(false);
            // if (data.length > 0) {
            //     processQueue();
            // }
        }
    }

    async function storeTicket(ticket: Ticket, type: 'pending' | 'error') {
        await addTicketToQueue(db, ticket, type )
        dispatch(addToQueue({ticket, type}));
    }

    async function removeTicketFromStore(ticketId: string, type: 'pending' | 'error') {
        await removeTicketFromQueue(db, ticketId, type )
        dispatch(removeFromQueue({ticketId, type}));
    }

    async function simulateFetchRequest() {
            return new Promise((resolve, reject) => {
                try {
                    // throw new Error('Ocurrio un error');
                    setTimeout(() => {
                        const simulatedData = {message: "Data fetched after 10 second!"};
                        resolve(simulatedData);
                    }, 10000); // 10 seconds delay
                } catch (e) {
                    reject(e);
                }
            });
    }

    useEffect(() => {
        if (!network.isConnected) {
            Alert.alert('Te encuentras en modo offline', 'Los tickets que registres se guardaran en el almacenamiento del dispositivo y puedes volver luego para enviarlos a el servidor.')
        }
    }, [network]);

    if (!permission) {
        // Camera permissions are still loading.
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator /></View>;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                <Text style={{textAlign: 'center'}}>Se necesita acceso a la camara para continuar.</Text>
                <Button onPress={requestPermission} title="Dar acceso"/>
            </View>
        );
    }


    const takePicture = () => {

        if (cameraRef.current) {
            const start = Date.now();

            cameraRef.current
                ?.takePictureAsync({
                    skipProcessing: true,
                    base64: true,
                    imageType: 'png',
                })
                .then(async (photoData: any) => {
                    // console.log(photoData)
                    const ticket: Ticket = {
                        id: Crypto.randomUUID(),
                        base64: photoData.base64,
                        uri: photoData.uri,
                    }
                    await storeTicket(ticket, 'pending');

                    // console.log(`Delay after takePictureAsync: ${Date.now() - start} ms`);

                    // const base64 = photoData.base64.replaceAll(' ', '+')
                    // await readTextFromImage(base64);
                    // console.log(`Delay after responding open ai: ${Date.now() - start} ms`);
                });
        }
    };

    async function readTextFromImage(img: string) {
        try {
            await fetch('https://smart-report-web.vercel.app/api/ai/analyzeImage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    image: img
                })
            }).then(async result => {
                const json = await result.json();
                console.log(json);
                // dispatch(addToQueue({ ticket: { id: new Date().getDate() }, type: 'pending' }))

            }).catch(e => {
                alert(JSON.stringify(e));
                console.error(e);
            })

        } catch (e: any) {
            alert(JSON.stringify(e));
            console.error(e);
        }

    }

    // if (loading) {
    //     return (
    //         <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    //             <ActivityIndicator/>
    //         </View>
    //     )
    // }

    return (
        <View style={styles.container}>
            <CameraView ref={cameraRef} style={styles.camera} facing='back'>
                <View style={styles.buttonContainer}>
                    <DocumentsQueueButton/>
                    <TouchableOpacity style={styles.shotButtonCircle} onPress={takePicture}>
                        <View style={styles.shotButton}/>
                    </TouchableOpacity>
                    <DocumentsErrorButton/>
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
        justifyContent: 'flex-end'
    },

    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        backgroundColor: 'transparent',
        marginVertical: 64,
        marginHorizontal: 32
    },
    documentsQueue: {
        alignSelf: 'flex-end',
    },
    shotButtonCircle: {
        borderColor: Colors.light,
        borderWidth: 5,
        width: 90,
        height: 90,
        borderRadius: 50,
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center'
    },
    shotButton: {
        backgroundColor: Colors.light,
        width: 65,
        height: 65,
        borderRadius: 50,
    },
});
