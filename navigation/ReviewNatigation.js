import { createStackNavigator } from "react-navigation-stack";
import ReviewDetail from "../screens/Review/ReviewDetail";
import WriteReview from "../screens/Review/WriteReview";
import { stackStyles } from "./config";
import UserDetail from "../screens/UserDetail";

export default createStackNavigator(
  {
    ReviewDetail: {
      screen: ReviewDetail,
      navigationOptions: {
        headerTitleAlign: "left",
        title: "후기"
      }
    },
    WriteReview: {
      screen: WriteReview,
      navigationOptions: {
        //headerTitleAlign: "center",
        headerBackTitle:" ",
        title: "후기 작성"
      }
    },
    UserDetail: {
      screen: UserDetail,
      navigationOptions: ({ navigation }) => ({
        headerTitleAlign: "center",
        headerBackTitle:" ",
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
