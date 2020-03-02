import { createStackNavigator, createMaterialTopTabNavigator } from "react-navigation";
//import { createMaterialTopTabNavigator } from "react-navigation-tabs";
import SelectPhoto from "../screens/Photo/SelectPhoto";
import TakePhoto from "../screens/Photo/TakePhoto";
import UploadPhoto from "../screens/Photo/UploadPhoto";
import { stackStyles } from "./config";

const PhotoTabs = createMaterialTopTabNavigator({
  SelectPhoto,
  TakePhoto
},{
  tabBarPosition:"bottom",
  navigationOptions : {
    headerStyle: {
      ...stackStyles
    }
  }
});
console.log("PhotoNavigation")

export default createStackNavigator({
  PhotoTabs,
  UploadPhoto
})
