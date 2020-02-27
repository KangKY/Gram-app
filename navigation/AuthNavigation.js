import { View } from "react-native";
import { createAppContainer, createStackNavigator } from "react-navigation";
//import { createStackNavigator } from "react-navigation-stack";
import Signup from "../screens/Auth/Signup";
import Confirm from "../screens/Auth/Confirm";
import Login from "../screens/Auth/Login";
import AuthHome from "../screens/Auth/AuthHome";

const AuthNavigation = createStackNavigator(
  {
    AuthHome,
    Signup,
    Add: {
      screen: View,
      navigationOptions: {
        tabBarOnPress: () => {
          console.log("Add");
        }
      }
    },
    Confirm,
    Login
  },
  {
    headerLayoutPreset:"center",
    initialRouteName: "AuthHome",
    headerMode: "none"
  }
);

export default createAppContainer(AuthNavigation);
