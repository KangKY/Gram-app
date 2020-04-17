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

export const TOGGLE_LIKE = gql`
  mutation toggelLike($postId: String!) {
    toggleLike(postId: $postId)
  }
`;

const Container = styled.View``;

const Header = styled.View`
  padding: 10px;
  flex-direction: row;
  align-items: center;
`;
const HeaderUserContainer = styled.View`
  margin-left: 10px;
`;
const Touchable = styled.TouchableOpacity``;
const TouchableWithoutFeedback = styled.TouchableWithoutFeedback``;

const Bold = styled.Text`
  font-weight: bold;
`;

const Location = styled.Text`
  margin-top:5px;
  font-size: 12px;
`;

const IconsContainer = styled.View`
  flex-direction: row;
  justify-content:space-between;
  margin-bottom: 5px;
`;
const IconContainer = styled.View`
  margin-right: 10px;
`;

const InfoContainer = styled.View`
  padding: 10px;
`;

const CaptionContainer = styled.View`
  flex-direction: row;
`;

const Caption = styled.Text`
  margin-left: 5px;
`;

const CommentCount = styled.Text`
  margin-top: 5px;
  opacity: 0.5;
  font-size: 12px;
`;

const Rating = styled.Text`
`;

const Post = ({
  id,
  user,
  location,
  avgRating,
  reviewCount,
  files = [],
  likeCount: likeCountProp,
  caption,
  comments = [],
  isLiked: isLikedProp,
  navigation
}) => {
  const [isLiked, setIsLiked] = useState(isLikedProp);
  const [lastTap, setLastTap] = useState();
  const [likeCount, setLikeCount] = useState(likeCountProp);
  const [toggleLikeMutaton] = useMutation(TOGGLE_LIKE, {
    variables: {
      postId: id
    }
  });

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (lastTap && (now - lastTap) < DOUBLE_PRESS_DELAY) {
      handleLike();
    } else {
      setLastTap(now);
    }
  }

  const handleLike = async () => {
    if (isLiked === true) {
      setLikeCount(l => l - 1);
    } else {
      setLikeCount(l => l + 1);
    }
    setIsLiked(p => !p);
    try {
      await toggleLikeMutaton();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Container>
      <Header>
        <Touchable
          onPress={() =>
            navigation.navigate("UserDetail", { username: user.username })
          }
        >
          <Image
            style={{ height: 40, width: 40, borderRadius: 20 }}
            source={{ uri: user.avatar }}
          />
        </Touchable>
        <Touchable
          onPress={() =>
            navigation.navigate("UserDetail", { username: user.username })
          }
        >
          <HeaderUserContainer>
            <Bold>{user.username}</Bold>
            <Location>{location}</Location>
          </HeaderUserContainer>
        </Touchable>
      </Header>
      <Swiper
        dot={
          <View
            style={{
              marginTop: 10,
              backgroundColor: "rgba(255,255,255,.3)",
              width: 9,
              height: 9,
              borderRadius: 7,
              marginLeft: 7,
              marginRight: 7
            }}
          />
        }
        activeDot={
          <View
            style={{
              marginTop: 10,
              backgroundColor: "#fff",
              width: 9,
              height: 9,
              borderRadius: 7,
              marginLeft: 7,
              marginRight: 7
            }}
          />
        }
        style={{ height: constants.height / 2.5 }}
      >
        {files &&
          files.map(file => (
            <TouchableWithoutFeedback key={file.id} onPress={handleDoubleTap}>
              <Image
                style={{ width: constants.width, height: constants.height / 2.5 }}
                source={{ uri: file.url }}
              />
            </TouchableWithoutFeedback>
          ))}
      </Swiper>
      <InfoContainer>
        <IconsContainer>
          <View style={{ flexDirection:'row' }} >
            <Touchable onPress={handleLike}>
              <IconContainer>
                <Ionicons
                  size={28}
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
              </IconContainer>
            </Touchable>

            <Touchable onPress={() => navigation.navigate("PostDetail", { id }) } >
              <IconContainer>
                <EvilIcons
                  size={32}
                  name={Platform.OS === "ios" ? "comment" : "comment"}
                />
              </IconContainer>
            </Touchable>
          </View>
          <View>
            <Touchable 
              onPress={() => navigation.navigate("ReviewDetail", { id }) }
              style={{ flexDirection:'row', alignItems:'center' }} 
            >
              <IconContainer>
                <AntDesign
                  size={22}
                  color={styles.yellowColor}
                  name={Platform.OS === "ios" ? "star" : "star"}
                />
              </IconContainer>
                <Rating>{avgRating} ({reviewCount})</Rating>
            </Touchable>
          </View>
          
        </IconsContainer>
        <Touchable onPress={() =>
              navigation.navigate("Likes", { type: 'post', id })
            }>
          <Bold>{`좋아요 ${likeCount}개`}</Bold>
        </Touchable>
        <CaptionContainer>
          <Touchable
            onPress={() =>
              navigation.navigate("UserDetail", { username: user.username })
            }
          >
            <Bold>{user.username}</Bold>
          </Touchable>
          <Caption>{caption}</Caption>
        </CaptionContainer>

        <Touchable onPress={() => navigation.navigate("PostDetail", { id }) }>
          <CommentCount>{`${comments.length}개 댓글 모두 보기`}</CommentCount>
        </Touchable>
      </InfoContainer>
    </Container>
  );
};

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
