import React, { useState } from "react";
import { Image, Platform } from "react-native";
import styled from "styled-components";
import { Ionicons } from "@expo/vector-icons";
import PropTypes from "prop-types";
import Swiper from "react-native-swiper";
import { gql } from "apollo-boost";
import constants from "../constants";
import styles from "../styles";
import { useMutation } from "react-apollo-hooks";
import { withNavigation } from "react-navigation";

const Post = () => {
  return null;
}

Post.propTypes = {
  id: PropTypes.string.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    username: PropTypes.string.isRequired
  }).isRequired,
  files: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    })
  ).isRequired,
  likeCount: PropTypes.number.isRequired,
  isLiked: PropTypes.bool.isRequired,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired
      }).isRequired
    })
  ).isRequired,
  caption: PropTypes.string.isRequired,
  location: PropTypes.string,
  createdAt: PropTypes.string.isRequired
};

export default withNavigation(Post);