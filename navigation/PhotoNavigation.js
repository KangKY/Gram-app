import { createStackNavigator, createMaterialTopTabNavigator } from "react-navigation";
//import { createMaterialTopTabNavigator } from "react-navigation-tabs";
import SelectPhoto from "../screens/Photo/SelectPhoto";
import TakePhoto from "../screens/Photo/TakePhoto";
import UploadPhoto from "../screens/Photo/UploadPhoto";
import { stackStyles } from "./config";
import styles from "../styles";


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
    navigationOptions:{
      tabBarLabel:"사진 선택"
    }
  },
  TakePhoto:{
    screen:TakePhoto,
    navigationOptions:{
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
    navigationOptions: {
      title: "사진 선택",
      headerBackTitle: null
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
