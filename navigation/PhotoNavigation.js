import { createStackNavigator, createMaterialTopTabNavigator } from "react-navigation";
//import { createMaterialTopTabNavigator } from "react-navigation-tabs";
import SelectPhoto from "../screens/Photo/SelectPhoto";
import TakePhoto from "../screens/Photo/TakePhoto";
import UploadPhoto from "../screens/Photo/UploadPhoto";
import { stackStyles } from "./config";
import styles from "../styles";

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
      backgroundColor: styles.blackColor
    },
    style : {
      paddingBottom:5,
      ...stackStyles
    },
    labelStyle: {
      color:styles.blackColor,
      fontWeight: "600"
    }
  },
  navigationOptions : {
    headerStyle: {
      ...stackStyles
    }
  }
});
console.log("PhotoNavigation")

export default createStackNavigator({
  Tabs: {
    screen:PhotoTabs,
    navigationOptions: {
      header:null
    }
  },
  UploadPhoto
})
