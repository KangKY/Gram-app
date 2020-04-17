
import React, { useState } from "react";
import PropTypes from "prop-types";
import { useMutation } from "react-apollo-hooks";
import { gql } from 'apollo-boost';
import styled from "styled-components";
import styles from "../styles";
import { FEED_QUERY } from "../screens/Home";
import { GET_USER } from "../SharedQueries";
import { ActivityIndicator } from "react-native";
export const FOLLOW = gql`
  mutation follow($id:String!) {
    follow(id:$id)
  }
`;

export const UNFOLLOW = gql`
  mutation unfollow($id:String!) {
    unfollow(id:$id)
  }
`;

const Touchable = styled.TouchableOpacity``;
const Container = styled.View`
  background-color: ${props =>
  props.isFollowing ? "#fff" : props.theme.blueColor};
  border-width:1px;
  border-color: ${props =>
  props.isFollowing ? styles.darkGreyColor : props.theme.blueColor};
  padding: 5px 10px;
  border-radius: 4px;
  margin: 0px 10px;
`;

const Text = styled.Text`
  color: ${props =>
  props.isFollowing ? styles.blackColor : "#fff"};
  text-align: center;
  font-weight: 600;
`;

const FollowButton = ({ id, isFollowing }) => {
  const options = {
    variables: {
      id
    },
    refetchQueries: () => [{ query: FEED_QUERY }, { query: GET_USER, variables: { id }}]
  };
  const [loading, setLoading] = useState(false);
  const [isFollowingState, setIsFollowing] = useState(isFollowing);
  const [followMutaion] = useMutation(FOLLOW, options);
  const [unfollowMutaion] = useMutation(UNFOLLOW, options);

  const onClick = async () => {
    setLoading(true);
    try {
      if (isFollowingState === true) {
        setIsFollowing(false);
        await unfollowMutaion();
      } else {
        setIsFollowing(true);
        await followMutaion();
      }
    } catch(e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <Touchable onPress={onClick}>
      <Container isFollowing={isFollowingState}>
        {loading ? <ActivityIndicator color={"black"} /> : <Text isFollowing={isFollowingState}>{isFollowingState ? "팔로잉" : "팔로우"}</Text>}
      </Container>
    </Touchable>
  );
};

FollowButton.propTypes = {
  id: PropTypes.string.isRequired,
  isFollowing: PropTypes.bool.isRequired
};

export default FollowButton;