import React from "react";
import styled from "styled-components";
import { TouchableOpacity, Image } from "react-native";
import PropTypes from "prop-types";
import constants from "../constants";
import {withNavigation } from 'react-navigation';

const Container = styled.View``;

const BoxPost = ({ navigation,  files = [], id }) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate("Detail", { id })}>
      <Image
        source={{ uri: files[0].url }}
        style={{ width: constants.width / 3, height: constants.height / 6 }}
      />
    </TouchableOpacity>
  );
};

BoxPost.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    })
  ).isRequired,
  id: PropTypes.string.isRequired
};

export default withNavigation(BoxPost);