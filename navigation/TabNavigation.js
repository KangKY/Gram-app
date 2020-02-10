import React from 'react';
import {Text, TouchableOpacity } from 'react-native';

import {
  createBottomTabNavigator,
  createStackNavigator
} from "react-navigation";
//import { createBottomTabNavigator } from 'react-navigation-tabs';

import Home from "../screens/Home";
import Search from "../screens/Search";
import Notifications from "../screens/Notifications";
import Profile from "../screens/Profile";
import { View } from "react-native";


const stackFactory = (initialRoute, customConfig) =>
  createStackNavigator({
    InialRoute: { screen: initialRoute, navigationOptions: { ...customConfig } }
  });

  console.log("TabNavigation");

const TabNavigation = createBottomTabNavigator({
  Home: {
    screen: stackFactory(Home, {
      title: "홈",
      headerRight:<TouchableOpacity><Text>하이</Text></TouchableOpacity>
    })
  },
  Search: {
    screen: stackFactory(Search,{
      title: "검색"
    })
  },
  Add: {
    screen: View,
    navigationOptions: {
      tabBarOnPress: ({ navigation }) => {
        navigation.navigate("PhotoNavigation");
      }
    }
  },
  Notifications: {
    screen: stackFactory(Notifications,{
      title: "알림"
    })
  },
  Profile: {
    screen: stackFactory(Profile,{
      title: "프로필"
    })
  }
});

export default TabNavigation;
