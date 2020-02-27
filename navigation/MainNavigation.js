import { createAppContainer, createStackNavigator } from "react-navigation";
//import { createStackNavigator } from "react-navigation-stack";
import TabNavigation from "./TabNavigation";
import PhotoNavigation from "./PhotoNavigation";
import MessageNavigation from "./MessageNavigation";

const MainNavigation = createStackNavigator(
  {
    TabNavigation,
    PhotoNavigation,
    MessageNavigation
  },
  {
    headerLayoutPreset:"center",
    headerMode: "none",
    mode: "modal"
  }
);
console.log("MainNavigation!!");
export default createAppContainer(MainNavigation);
