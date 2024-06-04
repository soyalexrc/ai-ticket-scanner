import {Button, Text, View} from "react-native";
import {useRouter} from "expo-router";

export default function Index() {
    const router = useRouter();
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text>Edit app/index.tsx to edit this screen.</Text>
            <Button title='Go to scanner' onPress={() => router.push('/scanner')}/>
        </View>
    );
}
