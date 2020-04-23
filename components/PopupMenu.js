import React, { useState, useRef } from 'react';
import PropTypes from "prop-types";
import { SafeAreaView, FlatList, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components';
import { Container, Header, Content, List, Text } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import Loader from './Loader';

const ICON_SIZE = 24;

const View = styled.View`
  margin-top:10px;
  margin-right:20px;
`;

const Touchble = styled.TouchableOpacity`
  flex-direction:row;
  align-items:center;
`;

const ListItem = styled.View`
  background-color:#fff;
  padding:10px 5px;
  border-bottom-width:1px;
  /* position:absolute;
  top:50px; */
  border-bottom-color:#f2f2f2;
`;
const ListText = styled.Text`
  text-align:center;
`;

const PopupMenu = ({
  defaultIndex = -1,
  defaultValue,
  text,
  iconRender = null,
  items=[],
  onPress=() => {},
  children,

  dropdownStyle,
  dropdownTextStyle,
  dropdownTextHighlightStyle
}) => {
  const buttonRef = useRef();
  const [isShow, setIsShow] = useState(false);
  const [loading, setIsLoading] = useState(!items);
  const handleToggle = () => {
    setIsShow(!isShow);
  }

  const handleItemSelect = () => {

  }

  const renderRow = (rowText) => {
    return (
      <ListItem>
        <ListText>{rowText}</ListText>
      </ListItem>
    )
  };

  const renderModal = () => {
    if (isShow && _buttonFrame) {
      const frameStyle = this._calcPosition();
      const animationType = animated ? 'fade' : 'none';
      return (
        <Modal animationType={animationType}
               visible={true}
               transparent={true}
               onRequestClose={this._onRequestClose}
               supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}
        >
          <TouchableWithoutFeedback accessible={accessible}
                                    disabled={!showDropdown}
                                    onPress={this._onModalPress}
          >
            <View style={styles.modal}>
              <View style={[styles.dropdown, dropdownStyle, frameStyle]}>
                {loading ? this._renderLoading() : this._renderDropdown()}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      );
    }
  }

  //const 
  return (
    <SafeAreaView >
      <Touchble onPress={handleToggle} ref={buttonRef}>
        <Text>{text}</Text>
        {iconRender ? iconRender : (
          <Ionicons 
            name={Platform.OS === 'ios'? "ios-arrow-dropdown":"md-arrow-dropdown"}
            size={14}
            style={{marginLeft:5}}
          />
        )}
        
      </Touchble>
      
      {isShow && 
        <Modal
          animationType={'fade'}
          visible={false}
          transparent={true}
          onRequestClose={handleToggle}
        >
          {loading ? <ActivityIndicator /> : (
            <FlatList
              style={[styles.dropdown, dropdownStyle]}
              keyExtractor={item => item}
              data={items}
              renderItem={({item}) => renderRow(item)}
            />
          )}
          
        </Modal>

      }
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  dropdown: {
    position: 'absolute',
    top:50,
    //height: (33 + StyleSheet.hairlineWidth) * 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'lightgray',
    borderRadius: 2,
    backgroundColor: 'white',
    // justifyContent: 'center'
  },
})
// class PopupMenu extends React.Component {
//   handleShowPopupError = () => {
//     // show error here
//   };

//   handleMenuPress = () => {
//     const { actions, onPress } = this.props;
//     // UIManager.showPopupMenu(
//     //   findNodeHandle(this.refs.menu),
//     //   actions,
//     //   this.handleShowPopupError,
//     //   onPress,
//     // );


//   };

//   render() {
//     return (
//       <View>
//         <Touchble onPress={this.handleMenuPress}>
//           { this.props.children }
//           <Icon
//             name="md-more"
//             size={ICON_SIZE}
//             color='black'
//             ref="menu"
//             style={{marginLeft:5}}
//           />
//         </Touchble>
//       </View>
//     );
//   }
// }

PopupMenu.propTypes = {
  items: PropTypes.array.isRequired,
  onPress: PropTypes.func.isRequired,
  children: PropTypes.any,
};

export default PopupMenu;