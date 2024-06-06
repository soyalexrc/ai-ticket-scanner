import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/styles';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import {View, Text, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {useOAuth} from "@clerk/clerk-expo";
import {useCallback} from "react";
import {useWarmUpBrowser} from "@/hooks/useWarmUpBrowser";
import * as WebBrowser from 'expo-web-browser';
import GoogleButton from "@/components/auth/GoogleButton";
import AppleButton from "@/components/auth/AppleButton";

WebBrowser.maybeCompleteAuthSession()

const BottomLoginSheet = () => {
    const { bottom } = useSafeAreaInsets();
    useWarmUpBrowser();


    return (
        <View style={[styles.container, { paddingBottom: bottom }]}>
            {
                Platform.OS === 'ios' &&
                <AppleButton />
            }
            <GoogleButton />
            <Link
                href={{
                    pathname: '/login',
                    params: { type: 'register' },
                }}
                style={[defaultStyles.btn, styles.btnDark]}
                asChild>
                <TouchableOpacity>
                    <Ionicons name="mail" size={20} style={styles.btnIcon} color={'#fff'} />
                    <Text style={styles.btnDarkText}>Sign up with email</Text>
                </TouchableOpacity>
            </Link>
            <Link
                href={{
                    pathname: '/login',
                    params: { type: 'login' },
                }}
                style={[defaultStyles.btn, styles.btnOutline]}
                asChild>
                <TouchableOpacity>
                    <Text style={styles.btnDarkText}>Log in</Text>
                </TouchableOpacity>
            </Link>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#000',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 26,
        gap: 14,
    },
    btnLight: {
        backgroundColor: '#fff',
    },
    btnLightText: {
        color: '#000',
        fontSize: 20,
    },
    btnDark: {
        backgroundColor: Colors.grey,
    },
    btnDarkText: {
        color: '#fff',
        fontSize: 20,
    },
    btnOutline: {
        borderWidth: 3,
        borderColor: Colors.grey,
    },
    btnIcon: {
        paddingRight: 6,
    },
});
export default BottomLoginSheet;
