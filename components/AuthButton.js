import React from 'react';
import styled from 'styled-components';
import PropTypes from "prop-types";
import constants from "../constants";

const Touchable = styled.TouchableOpacity``;
const Container = styled.View`
  background-color:${props => props.theme.blueColor};
  padding:10px;
  border-radius:4px;
  width:${constants.width / 2};
  margin:0px 50px 15px;
`;
const Text = styled.Text`
  color:#fff;
  text-align:center;
  font-weight: 600;
`;

const AuthButton = ({ text, onPress }) => {
  return (
    <Touchable onPress={onPress}>
      <Container>
        <Text>{text}</Text>
      </Container>
    </Touchable>
  )
}

AuthButton.propTypes = {
  text:PropTypes.string.isRequired,
  onPress:PropTypes.func.isRequired
}

export default AuthButton;