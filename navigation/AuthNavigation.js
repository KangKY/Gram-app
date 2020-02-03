import { View } from "react-native";
import { createStackNavigator, createAppContainer } from "react-navigation";
import Signup from "../screens/Auth/Signup";
import Confirm from "../screens/Auth/Confirm";
import Login from "../screens/Auth/Login";
import AuthHome from "../screens/Auth/AuthHome";

const AuthNavigation = createStackNavigator({
  AuthHome,
  Signup,
  Add:{
    screen:View,
    navigationOptions: {
      tabBarOnPress: () => {
        console.log("Add");
      }
    }
  },
  Confirm,
  Login
}, {
  initialRouteName:"AuthHome",
  headerMode:"none"
});

export default createAppContainer(AuthNavigation);
