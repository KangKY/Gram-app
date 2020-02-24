import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import constants from "../constants";

const Container = styled.View`
  margin-bottom: 10px;
`;
const TextInput = styled.TextInput`
  width: ${constants.width / 2};
  padding: 7px 10px;
  background-color: ${props => props.theme.greyColor};
  border: 1px solid ${props => props.theme.lightGreyColor};
  border-radius: 4px;
`;

const AuthInput = ({
  value,
  placeholder,
  onChange,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
  returnKeyType = "done",
  onSubmitEditing = () => null,
  autoCorrect = true
}) => (
  <Container>
    <TextInput
      value={value}
      secureTextEntry={secureTextEntry}
      placeholder={placeholder}
      onChangeText={onChange}
      autoCapitalize={autoCapitalize}
      keyboardType={keyboardType}
      returnKeyType={returnKeyType}
      onSubmitEditing={onSubmitEditing}
      autoCorrect={autoCorrect}
    />
  </Container>
);

AuthInput.propTypes = {
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  keyboardType: PropTypes.oneOf([
    "default",
    "number-pad",
    "decimal-pad",
    "numeric",
    "email-address",
    "phone-pad"
  ]),
  secureTextEntry: PropTypes.bool,
  autoCapitalize: PropTypes.oneOf(["none", "sentences", "words", "characters"]),
  returnKeyType: PropTypes.oneOf(["done", "go", "next", "search", "send"]),
  onSubmitEditing: PropTypes.func,
  autoCorrect: PropTypes.bool
};

export default AuthInput;
