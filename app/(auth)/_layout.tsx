import Colors from '@/constants/Colors';
import {Ionicons} from '@expo/vector-icons';
import {Stack, useRouter} from 'expo-router';
import {TouchableOpacity} from 'react-native';

import {SQLiteProvider} from 'expo-sqlite';
import {migrateDbIfNeeded} from '@/utils/Database';
import {Provider} from "react-redux";
import {store} from "@/store";

const Layout = () => {
    const router = useRouter();

    return (
        <SQLiteProvider databaseName="smart_report.db" onInit={migrateDbIfNeeded}>
            <Stack
                screenOptions={{
                    contentStyle: {backgroundColor: Colors.selected},
                }}>
                <Stack.Screen name="(drawer)" options={{headerShown: false}}/>
                <Stack.Screen name="scanner" options={{headerShown: false}}/>
                <Stack.Screen
                    name="(modal)/documents-errors"
                    options={{
                        headerTitle: 'Tickets con fallas al subir',
                        presentation: 'modal',
                        headerShadowVisible: false,
                        headerStyle: {backgroundColor: Colors.selected},
                        headerRight: () => (
                            <TouchableOpacity
                                onPress={() => router.back()}
                                style={{backgroundColor: Colors.greyLight, borderRadius: 20, padding: 4}}>
                                <Ionicons name="close-outline" size={16} color={Colors.grey}/>
                            </TouchableOpacity>
                        ),
                    }}
                />
                <Stack.Screen
                    name="(modal)/documents-queue"
                    options={{
                        headerTitle: 'Tickets en cola por subir',
                        presentation: 'modal',
                        headerShadowVisible: false,
                        headerStyle: {backgroundColor: Colors.selected},
                        headerRight: () => (
                            <TouchableOpacity
                                onPress={() => router.back()}
                                style={{backgroundColor: Colors.greyLight, borderRadius: 20, padding: 4}}>
                                <Ionicons name="close-outline" size={16} color={Colors.grey}/>
                            </TouchableOpacity>
                        ),
                    }}
                />
                <Stack.Screen
                    name="(modal)/settings"
                    options={{
                        headerTitle: 'Settings',
                        presentation: 'modal',
                        headerShadowVisible: false,
                        headerStyle: {backgroundColor: Colors.selected},
                        headerRight: () => (
                            <TouchableOpacity
                                onPress={() => router.back()}
                                style={{backgroundColor: Colors.greyLight, borderRadius: 20, padding: 4}}>
                                <Ionicons name="close-outline" size={16} color={Colors.grey}/>
                            </TouchableOpacity>
                        ),
                    }}
                />
            </Stack>
        </SQLiteProvider>
    );
};

export default Layout;
