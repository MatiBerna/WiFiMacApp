// import React, {useEffect, useState} from 'react';
// import {View, Text, PermissionsAndroid, Platform} from 'react-native';
// import WifiManager from 'react-native-wifi-reborn';

// const App = () => {
//   const [macAddress, setMacAddress] = useState<string | null>(null);

//   useEffect(() => {
//     const requestPermissions = async () => {
//       if (Platform.OS === 'android') {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//           {
//             title: 'Permiso de ubicación',
//             message:
//               'Se necesita acceso a la ubicación para obtener información de la red Wi-Fi',
//             buttonNeutral: 'Preguntar después',
//             buttonNegative: 'Cancelar',
//             buttonPositive: 'OK',
//           },
//         );
//         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//           getWifiMac(); // Obtiene la dirección MAC al iniciar

//         } else {
//           console.log('Permiso de ubicación denegado');
//         }
//       }
//     };

//     const getWifiMac = async () => {
//       try {
//         // Obtiene la información del punto de acceso Wi-Fi
//         const wifiInfo = await WifiManager.loadWifiList();
//         if (wifiInfo.length > 0) {
//           const mac = wifiInfo[0].BSSID; // La dirección MAC del primer punto de acceso
//           setMacAddress(mac);
//           sendMacToBackend(mac); // Envía la dirección MAC al backend
//         } else {
//           console.log('No se pudo obtener la información del Wi-Fi.');
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     // Función para enviar la dirección MAC al servidor backend
//     const sendMacToBackend = async (mac: string) => {
//       try {
//         await fetch('https://lavender-dolomite-viper.glitch.me', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({mac}), // Enviar la dirección MAC en el cuerpo de la petición
//         });
//         console.log('MAC Address enviada al backend:', mac);
//       } catch (error) {
//         console.log('Error enviando la MAC al backend:', error);
//       }
//     };

//     requestPermissions(); // Solicita permisos y configura la tarea
//   }, []);

//   return (
//     // eslint-disable-next-line react-native/no-inline-styles
//     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//       <Text>
//         {macAddress
//           ? `MAC Address: ${macAddress}`
//           : 'Obteniendo MAC Address...'}
//       </Text>
//     </View>
//   );
// };

// export default App;

// import React, {useEffect, useState} from 'react';
// import {View, Text, PermissionsAndroid, Platform} from 'react-native';
// import WifiManager from 'react-native-wifi-reborn';

// const App = () => {
//   const [macAddress, setMacAddress] = useState<string | null>(null);

//   useEffect(() => {
//     const requestPermissions = async () => {
//       if (Platform.OS === 'android') {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//           {
//             title: 'Permiso de ubicación',
//             message:
//               'Se necesita acceso a la ubicación para obtener información de la red Wi-Fi',
//             buttonNeutral: 'Preguntar después',
//             buttonNegative: 'Cancelar',
//             buttonPositive: 'OK',
//           },
//         );
//         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//           getWifiMac(); // Obtiene la dirección MAC al iniciar
//         } else {
//           console.log('Permiso de ubicación denegado');
//         }
//       }
//     };

//     const getWifiMac = async () => {
//       try {
//         // Obtiene la información del punto de acceso Wi-Fi
//         const wifiInfo = await WifiManager.loadWifiList();
//         if (wifiInfo.length > 0) {
//           const mac = wifiInfo[0].BSSID; // La dirección MAC del primer punto de acceso
//           setMacAddress(mac);
//           sendMacToBackend(mac); // Envía la dirección MAC al backend
//         } else {
//           console.log('No se pudo obtener la información del Wi-Fi.');
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     // Función para enviar la dirección MAC al servidor backend
//     const sendMacToBackend = async (mac: string) => {
//       try {
//         await fetch('https://lavender-dolomite-viper.glitch.me', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({mac}), // Enviar la dirección MAC en el cuerpo de la petición
//         });
//         console.log('MAC Address enviada al backend:', mac);
//       } catch (error) {
//         console.log('Error enviando la MAC al backend:', error);
//       }
//     };

//     // Función para iniciar la tarea en segundo plano

//     requestPermissions(); // Solicita permisos y configura la tarea
//   }, []);

//   return (
//     // eslint-disable-next-line react-native/no-inline-styles
//     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//       <Text>
//         {macAddress
//           ? `MAC Address: ${macAddress}`
//           : 'Obteniendo MAC Address...'}
//       </Text>
//     </View>
//   );
// };

// export default App;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import BackgroundFetch from 'react-native-background-fetch';
import WifiManager from 'react-native-wifi-reborn';

const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permiso de Ubicación',
          message:
            'Necesitamos acceso a la ubicación para obtener la dirección MAC del punto de acceso.',
          buttonPositive: 'Aceptar',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
};

const sendMacAddressToServer = async (bssid: string): Promise<void> => {
  try {
    await fetch('https://lavender-dolomite-viper.glitch.me', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({macAddress: bssid}),
    });
    console.log('MAC Address enviada:', bssid);
  } catch (error) {
    console.error('Error al enviar la dirección MAC:', error);
  }
};

const BackgroundTask = async (): Promise<void> => {
  try {
    // Obtener la dirección MAC del punto de acceso (BSSID)
    const bssid: string | null = await WifiManager.getBSSID();
    if (bssid) {
      console.log('BSSID obtenido:', bssid);
      // Enviar la dirección MAC al servidor
      await sendMacAddressToServer(bssid);
    } else {
      console.warn('BSSID no disponible.');
    }
  } catch (error) {
    console.error('Error obteniendo la dirección MAC:', error);
  }
};

const App: React.FC = () => {
  useEffect(() => {
    const configureBackgroundFetch = async () => {
      const permissionGranted = await requestLocationPermission();
      if (!permissionGranted) {
        Alert.alert(
          'Permiso denegado',
          'La aplicación no puede funcionar sin el permiso de ubicación.',
        );
        return;
      }

      // Configuración de la tarea en segundo plano
      BackgroundFetch.configure(
        {
          minimumFetchInterval: 1, // Ejecutar cada 1 minuto
          stopOnTerminate: false, // Seguir ejecutándose cuando la app sea terminada
          startOnBoot: true, // Ejecutar al iniciar el dispositivo
          requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY, // Cualquier tipo de red
        },
        async taskId => {
          console.log('[BackgroundFetch] Tarea recibida: ', taskId);
          await BackgroundTask();
          BackgroundFetch.finish(taskId);
        },
        error => {
          console.error('[BackgroundFetch] Error al iniciar la tarea:', error);
        },
      );

      // Comenzar el servicio de BackgroundFetch
      BackgroundFetch.start();
    };

    configureBackgroundFetch();

    return () => {
      BackgroundFetch.stop();
    };
  }, []);

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={{padding: 20}}>
      <Text>Servicio en Segundo Plano</Text>
      <Button title="Forzar Envío" onPress={BackgroundTask} />
    </View>
  );
};

export default App;
