import { StatusBar } from 'expo-status-bar';
import {Platform, StyleSheet} from 'react-native';
import { Text, View } from '../components/Themed';
import {BarCodeScanner} from "expo-barcode-scanner";
import {useState} from "react";
import WifiManager from "react-native-wifi-reborn";
import {useNavigation} from "@react-navigation/native";

export default function ModalScreen() {

  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation()

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    connectWifi(data);
  };

  const connectWifi = async (data) => {
    try {
      const splits = data.split(";")
      const sSsid = splits.find(v => v.includes("S:"))
      const sPassword = splits.find(v => v.includes("P:"))
      const myssid = sSsid.substring(sSsid.lastIndexOf("S:") + 2)
      const mypassword = sPassword.substring(sSsid.lastIndexOf("P:") + 3)
      const sType = splits.find(v => v.includes("T:"))
      const myType = sType.substring(sType.lastIndexOf("T:") + 2)
      console.log({ myssid, mypassword, myType })
      //myType == "WEP" ? true : false

      WifiManager.connectToProtectedSSID(myssid.toString(), mypassword.toString(), myType == "WEP" ? true : false)
          .then(
              () => {
                console.log("Connected successfully!");
                navigation.goBack()
              },
              (err) => {
                console.log("Connection failed!", err);
              }
          );

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
      />
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
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
});
