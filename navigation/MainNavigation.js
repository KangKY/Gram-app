import { createAppContainer, createStackNavigator } from "react-navigation";
//import { createStackNavigator } from "react-navigation-stack";
import TabNavigation from "./TabNavigation";
import PhotoNavigation from "./PhotoNavigation";

const MainNavigation = createStackNavigator(
  {
    TabNavigation,
    PhotoNavigation
  },
  {
    headerMode: "none",
    mode: "modal"
  }
);
console.log("MainNavigation!!");
export default createAppContainer(MainNavigation);
