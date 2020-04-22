import React, { useState } from "react";
import { View, Image, Platform } from "react-native";
import styled from "styled-components";
import { Ionicons, EvilIcons, AntDesign } from "@expo/vector-icons";
import PropTypes from "prop-types";
import Swiper from "react-native-swiper";
import { gql } from "apollo-boost";
import constants from "../constants";
import styles from "../styles";
import { useMutation } from "react-apollo-hooks";
import { withNavigation } from "react-navigation";
import moment from "moment";
import "moment/locale/ko";

export const TOGGLE_LIKE = gql`
  mutation toggelLike($postId: String!) {
    toggleLike(postId: $postId)
  }
`;

const Container = styled.View`
  background-color: #fff;
  flex: 1;
  margin: 10px 0px;
  width: ${constants.width - 20};
`;

const Header = styled.View`
  padding: 10px;
`;

const TaggingContainer = styled.View`
  flex-direction: row;
`;

const TaggingWrap = styled.View`
  background-color: #f2f2f2;
  border-radius: 10px;
  padding: 5px;
  margin: 8px 0px;
`;

const HeaderTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
`;

const HeaderContent = styled.Text`
  opacity: 0.5;
  font-size: 12px;
`;

const Bottom = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-top-width: 1px;
  border-top-color: #f2f2f2;
`;

const BottomLeft = styled.View`
  flex-direction: row;
`;

const BottomRight = styled.View``;

const Touchable = styled.TouchableOpacity``;

const IconContainer = styled.View`
  margin-right: 10px;
  flex-direction: row;
  padding: 3px;
  align-items: center;
`;

const Text = styled.Text``;

const Location = styled.Text`
  margin-top: 5px;
  font-size: 12px;
`;

const FromNow = styled.Text`
  /* margin-top: 5px; */
  opacity: 0.5;
  font-size: 12px;
`;

const Timeline = ({
  id,
  user,
  location,
  avgRating,
  reviewCount,
  files = [],
  likeCount: likeCountProp,
  caption,
  comments = [],
  createdAt,
  isLiked: isLikedProp,
  navigation,
}) => {
  const [isLiked, setIsLiked] = useState(isLikedProp);
  const [lastTap, setLastTap] = useState();
  const [likeCount, setLikeCount] = useState(likeCountProp);
  const [toggleLikeMutaton] = useMutation(TOGGLE_LIKE, {
    variables: {
      postId: id,
    },
  });

  const handleLike = async () => {
    if (isLiked === true) {
      setLikeCount((l) => l - 1);
    } else {
      setLikeCount((l) => l + 1);
    }
    setIsLiked((p) => !p);
    try {
      await toggleLikeMutaton();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Container>
      <Header>
        <TaggingContainer>
          <Touchable onPress={() => {}}>
            <TaggingWrap>
              <Text>블라블라</Text>
            </TaggingWrap>
          </Touchable>
        </TaggingContainer>
        <HeaderTitle>{location}</HeaderTitle>
        <HeaderContent>{caption}</HeaderContent>
        <Location>{user.username}</Location>
      </Header>
      <Bottom>
        <BottomLeft>
          <Touchable onPress={handleLike}>
            <IconContainer>
              <Ionicons
                size={15}
                color={isLiked ? styles.redColor : styles.blackColor}
                name={
                  Platform.OS === "ios"
                    ? isLiked
                      ? "ios-heart"
                      : "ios-heart-empty"
                    : isLiked
                    ? "md-heart"
                    : "md-heart-empty"
                }
              />
              <Text style={{ marginLeft: 3 }}>좋아요</Text>
            </IconContainer>
          </Touchable>
          
          <Touchable onPress={() => navigation.navigate("PostDetail", { id })}>
            <IconContainer>
              <EvilIcons size={18} name={"comment"} />
              <Text>댓글</Text>
            </IconContainer>
          </Touchable>
        </BottomLeft>
        <BottomRight>
          <FromNow>{moment(createdAt).fromNow()}</FromNow>
        </BottomRight>
      </Bottom>
    </Container>
  );
};

Timeline.propTypes = {
  id: PropTypes.string.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    username: PropTypes.string.isRequired,
  }).isRequired,
  files: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
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
        username: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,
  caption: PropTypes.string.isRequired,
  location: PropTypes.string,
  createdAt: PropTypes.string.isRequired,
};

export default withNavigation(Timeline);
