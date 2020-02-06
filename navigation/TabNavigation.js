import { createBottomNavigator } from "react-navigation";

import Home from "../screens/Home";
import Search from "../screens/Search";
import Notifications from "../screens/Notifications";
import Profile from "../screens/Profile";
import { View } from "react-native";

const TabNavigation = createBottomNavigator({
  Home,
  Search,
  Add: {
    screen:View,
    navigationOptions: {
      tabBarOnPress: ({navigation}) => {
        navigation.navigate("PhotoNavigation");
      }
    }
  },
  Notifications,
  Profile
});

export default TabNavigation;