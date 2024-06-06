import {StyleSheet, Text, TouchableOpacity} from "react-native";
import {defaultStyles} from "@/constants/styles";
import {Ionicons} from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import {useOAuth} from "@clerk/clerk-expo";
import {useCallback} from "react";

export default function AppleButton() {
    const { startOAuthFlow } = useOAuth({ strategy: 'oauth_apple' });


    const signInWithApple = useCallback(async () => {
        try {
            const {
                signIn,
                signUp,
                createdSessionId,
                setActive,
            } = await startOAuthFlow();

            if (createdSessionId && setActive) {
                await setActive({ session: createdSessionId })
            } else {
                // Use signIn or signUp for next steps such as MFA
            }

        } catch (err) {
            console.error(err);
        }
    }, []);
    return (
        <TouchableOpacity style={[defaultStyles.btn, styles.btnLight]} onPress={signInWithApple}>
            <Ionicons name="logo-apple" size={14} style={styles.btnIcon} />
            <Text style={styles.btnLightText}>Continue with Apple</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    btnLight: {
        backgroundColor: '#fff',
    },
    btnLightText: {
        color: '#000',
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
