import React from "react";
import SelectPhotoPresenter from "./SelectPhotoPresenter";
import MessagesLink from "../../../components/MessagesLink";


export default class extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title:"갤러리",
    headerRight:<MessagesLink onPress={navigation.getParam("onSubmit", () => null)} />,
  });

  state = {
    selected:null
  }

  constructor(props) {
    super(props);
    const { navigation } = props;
    console.log(navigation);
    this.state = {
      selected: null,
    };

    navigation.setParams({
      onSubmit: this.onSubmit
    });
  }
  handleSelected = (photo) => {
    this.setState({ selected: photo });
  }
  
  onSubmit = () => {
    navigation.navigate("Upload", { photo: selected });
  };

  render() {
    const { selected } = this.state;
    return <SelectPhotoPresenter selected={selected} handleSelected={this.handleSelected}/>;
  }
}
