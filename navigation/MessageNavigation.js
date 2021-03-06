import { createStackNavigator } from "react-navigation-stack";
import Messages from "../screens/Messages/Messages";
//import Messages from "../screens/Review/ReviewDetail";
import Message from "../screens/Messages/Message";
import { stackStyles } from "./config";
import UserDetail from "../screens/UserDetail";

export default createStackNavigator(
  {
    Messages: {
      screen: Messages,
      navigationOptions: ({ navigation }) => ({
        headerTitleAlign: "left",
        title: "메시지"
      })
    },
    Message: {
      screen: Message,
      navigationOptions: ({ navigation }) => ({
        headerTitleAlign: "center",
        title: navigation.getParam("username")
      })
    },
    UserDetail: {
      screen: UserDetail,
      navigationOptions: ({ navigation }) => ({
        headerTitleAlign: "center",
        headerBackTitle:"",
        title: navigation.getParam("username")
      })
    },
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        ...stackStyles
      },
      headerBackTitle:" ",
    }
  }
);
