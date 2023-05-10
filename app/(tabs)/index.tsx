import {
    Button,
    StyleSheet,
    TextInput,
    Text,
    Pressable,
    useColorScheme,
    PermissionsAndroid,
    ToastAndroid
} from 'react-native';

import EditScreenInfo from '../../components/EditScreenInfo';
import {View} from '../../components/Themed';
import WifiManager from "react-native-wifi-reborn";
import {useEffect, useState} from "react";
import * as Location from 'expo-location'
import { BarCodeScanner } from 'expo-barcode-scanner';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Colors from "../../constants/Colors";
import {Link} from "expo-router";

export default function TabOneScreen() {
    const colorScheme = useColorScheme();

    const [ssid, setSsid] = useState('');
    const [password, setPassword] = useState('');

    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);


    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        getBarCodeScannerPermissions();
    }, []);

    useEffect(() => {
        (async () => {
            const {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }
            const location = await Location.getCurrentPositionAsync({});
            console.log('Location permission granted', location);
        })();

    }, []);

    const connectWifi = async () => {
        try {
            WifiManager.connectToProtectedSSID(ssid, password, false)
                .then(
                    () => {
                        console.log("Connected successfully!");
                    },
                    (err) => {
                        console.log("Connection failed!", err);
                    }
                );
        } catch (error) {
            console.log('Connection failed!', {error});
        }
    }

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={{flex: 1}}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />

            <View style={styles.container}>
                <TextInput style={styles.input} placeholder={'ssid'} onChangeText={setSsid}/>
                <TextInput style={styles.input} placeholder={'password'} onChangeText={setPassword}/>
                <Button
                    onPress={connectWifi}
                    title='Connect to Wifi'
                    color='#841584'
                />

                <Link href="/modal" asChild>
                    <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)}/>
                </Link>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    input: {
        height: 40,
        width: '80%',
        borderWidth: 1,
        borderRadius: 4,
        borderColor: 'gray',
        textAlign: 'center',
        marginBottom: 12
    }
});
