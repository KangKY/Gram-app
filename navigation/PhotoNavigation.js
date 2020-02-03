import { createStackNavigator, createAppContainer } from "react-navigation";
import SelectPhoto from "../screens/Photo/SelectPhoto";
import TakePhoto from "../screens/Photo/TakePhoto";
import UploadPhoto from "../screens/Photo/UploadPhoto";

const PhotoNavigation = createStackNavigator({
  SelectPhoto,
  TakePhoto,
  UploadPhoto
});

export default createAppContainer(PhotoNavigation);