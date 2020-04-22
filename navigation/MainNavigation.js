import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import TabNavigation from "./TabNavigation";
import PhotoNavigation from "./PhotoNavigation";
import ReviewNatigation from "./ReviewNatigation";
import MessageNavigation from "./MessageNavigation";
import { stackStyles } from "./config";

const MainNavigation = createStackNavigator(
  {
    TabNavigation,
    ReviewNatigation,
    PhotoNavigation,
    MessageNavigation
  },
  {
    navigationOptions : {
      headerTitleAlign:"center",
      headerStyle : { ...stackStyles },
      
    },
    
    headerMode: "none",
    
    mode: "card"
  }
);

export default createAppContainer(MainNavigation);
