import React from 'react';
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from 'react-navigation-tabs';
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
import PostDetail from '../screens/PostDetail';
import ReviewDetail from '../screens/Review/ReviewDetail';
import Likes from '../screens/Likes';
import WriteReview from '../screens/Review/WriteReview';


const stackFactory = (initialRoute, customConfig) =>
  createStackNavigator(
    {
      initialRoute: {
        screen: initialRoute,
        navigationOptions: {
          headerTitleAlign: "center",
          ...customConfig
        }
      },
      Detail: {
        screen: Detail,
        navigationOptions: {
          headerTitleAlign: "center",
          title: "게시물"
        }
      },
      UserDetail: {
        screen: UserDetail,
        navigationOptions: ({ navigation }) => ({
          headerTitleAlign: "center",
          title: navigation.getParam("username")
        })
      },
      PostDetail: {
        screen: PostDetail,
        navigationOptions: {
          title: "댓글"
        }
      },
      // ReviewDetail: {
      //   screen: ReviewDetail,
      //   navigationOptions: ({ navigation }) => {
      //     return ({
      //       title: "후기",
      //       headerTitleAlign: "left"
      //     })
      //   }
      // },
      // WriteReview: {
      //   screen: WriteReview,
      //   navigationOptions: ({ navigation }) => {
      //     return ({
      //       title: "후기 작성",
      //       headerTitleAlign: "left"
      //     })
      //   }
      // }, 
      Likes: {
        screen: Likes,
        navigationOptions: ({ navigation }) => {
          return ({
            title: "좋아요"
          })
        }
      }
    },
    {
      defaultNavigationOptions: {
        headerStyle: { ...stackStyles },
        headerBackTitle: null,
        headerTintColor: styles.blackColor,
        headerBackTitle:" ",
        // cardStyle:{
        //   backgroundColor:"#fff"
        // }
      }
    }
  );



const TabNavigation = createBottomTabNavigator({
  Home: {
    screen: stackFactory(Home, {
      headerRight: () => <MessagesLink />,
      headerTitle: () => <Image style={{height:35}} source={require("../assets/instagram.png")} resizeMode="contain" />
    }),
    navigationOptions :({navigation}) => {
      //console.log(navigation.state)
      return {
        tabBarVisible: navigation.state.routes[navigation.state.index].routeName === 'PostDetail' ? false:true,
        tabBarIcon: ({ focused }) => (
          <NavIcon
            focused={focused}
            name={Platform.OS === "ios" ? "ios-home" : "md-home"}
          />
        ),
      };
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
    },
  }
});

export default TabNavigation;
