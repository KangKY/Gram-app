import { createStackNavigator, createAppContainer } from "react-navigation";
import TabNavigation from "../navigation/TabNavigation";

const MainNavigation = createStackNavigator({
  TabNavigation
});

export default createAppContainer(MainNavigation);