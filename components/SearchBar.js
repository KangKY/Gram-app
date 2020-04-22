import React from "react";
import { TextInput } from "react-native";
import PropTypes from "prop-types";
import constants from "../constants";
import styles from "../styles";
import { Feather } from "@expo/vector-icons";
import styled from "styled-components";

const View = styled.View`
  flex-direction:row;
  align-items:center;
`;


const SearchBar = ({ onChange, value, onSubmit }) => (
  <View>
    <Feather name={"search"} size={20} style={{ position:"absolute", left:10, zIndex:1}}/>
    <TextInput
        style={{
          width: constants.width - 40,
          height: 40,
          backgroundColor: styles.lightGreyColor,
          padding: 10,
          borderRadius: 5,
          paddingLeft:38
        }}
        returnKeyType="search"
        onChangeText={onChange}
        onEndEditing={onSubmit}
        value={value}
        placeholder={"검색어를 입력해주세요."}
        placeholderTextColor={styles.darkGreyColor}
      />
  </View>
 
);

SearchBar.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired
};
export default SearchBar;