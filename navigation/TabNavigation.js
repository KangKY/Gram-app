import { createBottomNavigator, createAppContainer } from "react-navigation";

import Home from "../screens/Home";
import Search from "../screens/Search";
import Notifications from "../screens/Notifications";
import Profile from "../screens/Profile";

const TabNavigation = createBottomNavigator({
  Home,
  Search,
  Notifications,
  Profile
});

export default createAppContainer(TabNavigation);