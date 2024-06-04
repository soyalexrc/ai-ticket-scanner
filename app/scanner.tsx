import {

    CameraType,
    CameraView,
    useCameraPermissions
} from 'expo-camera';
import {useRef, useState} from 'react';
import {ActivityIndicator, Button, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';



export default function Scanner() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [resultFromOpenAi, setResultFromOpenAi] = useState(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<any>(null);

    if (!permission) {
        // Camera permissions are still loading.
        return <View/>;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                <Text style={{textAlign: 'center'}}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission"/>
            </View>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
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
                    setLoading(true);

                    console.log(`Delay after takePictureAsync: ${Date.now() - start} ms`);

                    const base64 = photoData.base64.replaceAll(' ', '+')
                    await readTextFromImage(base64);
                    console.log(`Delay after responding open ai: ${Date.now() - start} ms`);

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
                setResultFromOpenAi(json);
                setLoading(false)
            }).catch(e => {
                alert(JSON.stringify(e));
                console.error(e);
            })

        } catch (e: any) {
            alert(JSON.stringify(e));
            console.error(e);
        }

    }

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator  />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {
                resultFromOpenAi ? (
                    <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                        <Text>
                            {JSON.stringify(resultFromOpenAi, null, 2)}
                        </Text>
                        <TouchableOpacity onPress={() => setResultFromOpenAi(null)}>
                            <Text style={styles.text}>Re take</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                                <Text style={styles.text}>Flip Camera</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={takePicture}>
                                <Text style={styles.text}>take picture</Text>
                            </TouchableOpacity>
                        </View>
                    </CameraView>
                )
            }
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
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
});
