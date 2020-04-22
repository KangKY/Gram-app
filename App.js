import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { AppLoading } from "expo";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import { AsyncStorage, Platform, Vibration } from "react-native";
import { ApolloProvider } from "react-apollo-hooks";
import apolloClient from "./apollo";
import { ThemeProvider } from "styled-components";
import styles from "./styles";
import NavController from "./components/NavController";
import { AuthProvider } from "./AuthContext";

import * as Permissions from "expo-permissions";
import { Notifications } from "expo";

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [client, setClient] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  const [notificationStatus, setStatus] = useState(false);
  const [expoPushToken, setToken] = useState('');

  const ask = async () => {


    const { status: existStatus } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    console.log(existStatus);

    let finalStatus = existStatus;
    if (existStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    
    let token = await Notifications.getExpoPushTokenAsync();
   
    console.log(token);
    setToken(token);
    if(Platform.OS === "ios") {
      Notifications.setBadgeNumberAsync(0);
    }
  };

  const handleNotifications = () => {
    Vibration.vibrate();

  }

  const preLoad = async () => {
    //AsyncStorage.clear();

    try {
      await Font.loadAsync({
        Roboto: require('native-base/Fonts/Roboto.ttf'),
        Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
        ...Ionicons.font
      });
      await Asset.loadAsync([require("./assets/instagram.png")]);

      const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
      if (isLoggedIn === null || isLoggedIn === "false") {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }

      setLoaded(true);
      setClient(apolloClient);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    preLoad();
    ask();
    Notifications.addListener(handleNotifications);
  }, []);

  return loaded && client ? (
    <ApolloProvider client={client}>
      <ThemeProvider theme={styles}>
        <AuthProvider isLoggedIn={isLoggedIn}>
          <NavController />
        </AuthProvider>
      </ThemeProvider>
    </ApolloProvider>
  ) : (
    <AppLoading />
  );
  // return (
  //   <View >
  //     <Text>Open up App.js to start working on your app!</Text>
  //   </View>
  // );
}
