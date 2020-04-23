import React, { useState } from "react";
import styled from "styled-components";
import { Ionicons, AntDesign, EvilIcons } from "@expo/vector-icons";
import { TouchableOpacity, Image } from "react-native";
import PropTypes from "prop-types";
import constants from "../constants";
import { useMutation } from "react-apollo-hooks";
import { withNavigation } from "react-navigation";
import { gql } from "apollo-boost";
import styles from "../styles";

const TOGGLE_LIKE = gql`
  mutation toggelLike($postId: String!) {
    toggleLike(postId: $postId)
  }
`;

const Container = styled.View`
  margin-bottom: 20px;
  padding: 5px;
  /* background-color:#fff; */
`;

const Location = styled.Text`
  opacity: 0.5;
  margin-top: 7px;
  margin-bottom: 14px;
`;

const ContentText = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;

const UserName = styled.Text`
  margin-top: 10px;
`;

const Bottom = styled.View`
  margin: 15px 0px;
  flex-direction: row;
  justify-content: space-between;
`;

const Touchable = styled.TouchableOpacity``;

const IconContainer = styled.View`
  margin-right: 10px;
  flex-direction: row;
  padding: 3px;
  align-items: center;
`;

const Text = styled.Text``;

const BoxPost = ({
  navigation,
  files = [],
  id,
  location,
  user,
  caption,
  avgRating,
  createdAt,
  isLiked: isLikedProp,
  likeCount: likeCountProp,
}) => {
  const [isLiked, setIsLiked] = useState(isLikedProp);
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
      <TouchableOpacity onPress={() => navigation.navigate("Detail", { id })}>
        <Image
          source={{ uri: files[0].url }}
          style={{
            width: constants.width / 2 - 20,
            height: constants.height / 4,
          }}
        />
      </TouchableOpacity>
      <Location>{location}</Location>
      <ContentText>{caption}</ContentText>
      <UserName>{user.username}</UserName>

      <Bottom>
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
            <Text style={{ marginLeft: 3 }}>{likeCount}</Text>
          </IconContainer>
        </Touchable>

        <Touchable onPress={() => navigation.navigate("PostDetail", { id })}>
          <IconContainer>
            <EvilIcons size={18} name={"comment"} />
            <Text>댓글</Text>
          </IconContainer>
        </Touchable>

        <Touchable onPress={() => navigation.navigate("ReviewDetail", { id })}>
          <IconContainer>
            <AntDesign size={18} color={styles.yellowColor} name={"star"} />
            <Text style={{ marginLeft: 3 }}>{avgRating}</Text>
          </IconContainer>
        </Touchable>
      </Bottom>
    </Container>
  );
};

BoxPost.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ).isRequired,
  id: PropTypes.string.isRequired,
};

export default withNavigation(BoxPost);
