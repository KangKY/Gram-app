import { createAppContainer, createStackNavigator } from "react-navigation";
//import { createStackNavigator } from "react-navigation-stack";
import TabNavigation from "./TabNavigation";
import PhotoNavigation from "./PhotoNavigation";
import MessageNavigation from "./MessageNavigation";
import { stackStyles } from "./config";

const MainNavigation = createStackNavigator(
  {
    PhotoNavigation,
    TabNavigation,
    MessageNavigation
  },
  {
    navigationOptions : {
      headerStyle : { ...stackStyles }
    },
    headerLayoutPreset:"center",
    headerMode: "none",
    mode: "modal"
  }
);

export default createAppContainer(MainNavigation);
