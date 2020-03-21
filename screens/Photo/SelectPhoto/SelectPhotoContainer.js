import React from "react";
import SelectPhotoPresenter from "./SelectPhotoPresenter";

export default class extends React.Component {
  static navigationOptions = () => {
    return {
      title:"갤러리"
    }
  };

  state = {
    selected:null
  }

  constructor(props) {
    super(props);
    const { navigation } = props;
    //console.log(navigation);
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
    const { navigation } = this.props;
    navigation.navigate("Upload", { photo: this.state.selected });
  };

  render() {
    const { selected } = this.state;
    return <SelectPhotoPresenter selected={selected} handleSelected={this.handleSelected}/>;
  }
}
