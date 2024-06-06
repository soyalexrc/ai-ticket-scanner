import {Button, Text, View} from "react-native";
import {useRouter} from "expo-router";
import AnimatedIntro from "@/components/AnimatedIntro";
import BottomLoginSheet from "@/components/BottomLoginSheet";
import {useAppDispatch} from "@/store/hooks";
import {useEffect} from "react";
import NetInfo from "@react-native-community/netinfo";
import {changeNetworkState} from "@/store/features/network/networkSlice";

export default function Index() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            dispatch(changeNetworkState(state));
        });
        return () => unsubscribe();
    }, []);
    return (
        <View
            style={{
                flex: 1,
            }}
        >
            <AnimatedIntro />
            <BottomLoginSheet />
        </View>
    );
}
