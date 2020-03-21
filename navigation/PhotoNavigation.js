import React from 'react';
import { createStackNavigator, createMaterialTopTabNavigator } from "react-navigation";
import SelectPhoto from "../screens/Photo/SelectPhoto";
import TakePhoto from "../screens/Photo/TakePhoto";
import UploadPhoto from "../screens/Photo/UploadPhoto";
import { stackStyles } from "./config";
import styles from "../styles";
import styled from 'styled-components';



const TouchableOpacity = styled.TouchableOpacity``;
const Text = styled.Text`
  margin-right:10px;
  font-weight:600;
  font-size:15px;
  padding:10px;
`;


const stackFactory = (initialRoute, customConfig) =>
  createStackNavigator(
    {
      initialRoute: {
        screen: initialRoute,
        navigationOptions: {
          ...customConfig
        }
      },
      Upload: {
        screen: UploadPhoto,
        navigationOptions: {
          title: "업로드"
        }
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

const PhotoTabs = createMaterialTopTabNavigator({
  SelectPhoto:{
    screen:SelectPhoto,
    navigationOptions: {
      headerTitle:"Fuck"
    }
  },
  TakePhoto:{
    screen:TakePhoto,
    navigationOptions : {
      tabBarLabel:"사진 촬영"
    }
  }
},{
  tabBarPosition:"bottom",
  tabBarOptions: {
    indicatorStyle: {
      backgroundColor: styles.blackColor,
      marginBottom:10
    },
    style : {
      paddingBottom:10,
      ...stackStyles
    },
    labelStyle: {
      color:styles.blackColor,
      fontWeight: "600"
    }
  }
});

export default createStackNavigator({
  Tabs: {
    screen:PhotoTabs,
    navigationOptions: ({navigation}) => {
      if(navigation.state.routes[navigation.state.index].routeName === "SelectPhoto") {
        if(navigation.state.routes[navigation.state.index].params) {
          return {
            title: "사진 선택",
            headerBackTitle: null,
            headerRight:<TouchableOpacity onPress={navigation.state.routes[navigation.state.index].params.onSubmit}><Text>업로드</Text></TouchableOpacity>
          }
        } else {
          return {
            title: "사진 선택",
            headerBackTitle: null,
            headerRight:<TouchableOpacity onPress={() => {}}><Text>업로드</Text></TouchableOpacity>
          }
        }
        
      } else if(navigation.state.routes[navigation.state.index].routeName === "TakePhoto"){
        return {
          title: "사진 촬영",
          headerBackTitle: null
        }
      }
      
    }
  },
  Upload: {
    screen: UploadPhoto,
    navigationOptions: {
      title: "업로드"
    }
  }
},{
  defaultNavigationOptions : {
    headerTintColor:styles.blackColor,
    headerStyle: {
      ...stackStyles
    },
    headerLayoutPreset:"center"
  }
})
