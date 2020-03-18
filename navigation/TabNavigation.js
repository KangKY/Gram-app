import React from 'react';
import {
  createBottomTabNavigator,
  createStackNavigator
} from "react-navigation";
//import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Image, Platform } from "react-native";
import Home from "../screens/Home";
import Search from "../screens/Search";
import Notifications from "../screens/Notifications";
import Profile from "../screens/Profile";
import UserDetail from "../screens/UserDetail";
import Detail from "../screens/Detail";
import MessagesLink from "../components/MessagesLink";
import { View } from 'react-native';
import NavIcon from '../components/NavIcon';
import { stackStyles } from './config';
import styles from '../styles';


const stackFactory = (initialRoute, customConfig) =>
  createStackNavigator(
    {
      initialRoute: {
        screen: initialRoute,
        navigationOptions: {
          ...customConfig
        }
      },
      Detail: {
        screen: Detail,
        navigationOptions: {
          title: "게시물"
        }
      },
      UserDetail: {
        screen: UserDetail,
        navigationOptions: ({ navigation }) => ({
          title: navigation.getParam("username")
        })
      }
    },
    {
      headerLayoutPreset: "center",
      defaultNavigationOptions: {
        headerStyle: { ...stackStyles },
        headerBackTitle: null,
        headerTintColor: styles.blackColor
      }
    }
  );



const TabNavigation = createBottomTabNavigator({
  Home: {
    screen: stackFactory(Home, {
      headerRight:<MessagesLink />,
      headerTitle: <Image style={{height:35}} source={require("../assets/instagram.png")} resizeMode="contain" />
    }),
    navigationOptions : {
      tabBarIcon: ({focused}) => ( 
        <NavIcon focused={focused} name={Platform.OS === "ios" ? "ios-home" : "md-home"}/>
      )
    }
  },
  Search: {
    screen: stackFactory(Search,{
      headerBackTitle:null
    }),
    navigationOptions : {
      tabBarIcon: ({focused}) => ( 
        <NavIcon focused={focused} name={Platform.OS === "ios" ? "ios-search" : "md-search"}/>
      )
    }
  },
  Add: {
    screen: View,
    navigationOptions: {
      tabBarOnPress: ({ navigation }) => {
        navigation.navigate("PhotoNavigation");
      },
      tabBarIcon: ({focused}) => ( 
        <NavIcon focused={focused} name={Platform.OS === "ios" ? "ios-add" : "md-add"}/>
      )
    }
  },
  Notifications: {
    screen: stackFactory(Notifications,{
      title: "알림"
    }),
    navigationOptions : {
      tabBarIcon: ({focused}) => ( 
        <NavIcon focused={focused} name={Platform.OS === "ios" ? "ios-heart" : "md-heart"}/>
      )
    }
  },
  Profile: {
    screen: stackFactory(Profile,{
      title: "프로필"
    }),
    navigationOptions : {
      tabBarIcon: ({focused}) => ( 
        <NavIcon focused={focused} name={Platform.OS === "ios" ? "ios-person" : "md-person"}/>
      )
    }
  }
}, {
  initialRouteName:"Home",
  tabBarOptions:{
    showLabel:false,
    style : {
      backgroundColor:"#FAFAFA"
    }
  }
});

export default TabNavigation;
