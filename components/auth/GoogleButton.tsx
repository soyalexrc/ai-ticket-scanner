import {StyleSheet, Text, TouchableOpacity} from "react-native";
import {defaultStyles} from "@/constants/styles";
import {Ionicons} from "@expo/vector-icons";
import {useOAuth} from "@clerk/clerk-expo";
import {useCallback} from "react";
import Colors from "@/constants/Colors";

export default function GoogleButton() {
    const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });


    const signInWIthGoogle = useCallback(async () => {
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
        <TouchableOpacity onPress={signInWIthGoogle} style={[defaultStyles.btn, styles.btnDark]}>
            <Ionicons name="logo-google" size={16} style={styles.btnIcon} color={'#fff'} />
            <Text style={styles.btnDarkText}>Continue with Google</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
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
