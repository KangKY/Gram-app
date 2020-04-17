import React, { useState } from "react";
import styled from "styled-components";
import { TouchableOpacity, Image, Text, Platform } from "react-native";
import { useMutation } from "react-apollo-hooks";
import PropTypes from "prop-types";
import { gql } from "apollo-boost";
import moment from "moment";
import "moment/locale/ko";
import { withNavigation } from "react-navigation";
import Rate from "./Rate";
import { Ionicons, Feather } from "@expo/vector-icons";
import constants from "../constants";

const Container = styled.View`
  padding: 10px 0px;
  justify-content:space-between;
`;

const Left = styled.View`
  flex-direction: row;
  align-items:center;
`;

const Right = styled.View`
  width:50px;
  align-items:center;
  justify-content:center;
`;

const RatingContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items:center;
`;

const CommentRow = styled.View`
  margin-left: 10px;
  /* margin-right: 80px; */
`;
const CommentText = styled.Text`
  margin:10px 0px;
  padding-horizontal:10px;
`;

const UserName = styled.Text`
  font-weight: bold;
  margin-right: 10px;
`;

const TextWrap = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items:center;
  /* flex:1; */
`;

const BottomContainer = styled.View`
  flex-direction: row;
`;

const BoldOpacity = styled.Text`
  /* margin-left: 15px; */
  margin-top: 5px;
  opacity: 0.5;
  font-size: 12px;
  font-weight: bold;
`;

const LikeTouchable = styled.TouchableOpacity`
  flex-direction:row;
  width:${constants.width / 2 - 20};
  border:1px;
  padding:10px;
  justify-content:center;
  align-items:center;
`;

const LikeText = styled.Text`
  margin-left:10px;
`;

const FromNow = styled.Text`
  margin-left: 5px;
  opacity: 0.5;
  font-size: 12px;
`;

const FeedBack = styled.View`
  flex-direction:row;
  justify-content:space-between;
`;

export const TOGGLE_LIKE = gql`
  mutation toggleCommentLike($commentId: String!) {
    toggleCommentLike(commentId: $commentId)
  }
`;

const Review = ({
  id,
  text,
  user,
  rating,
  likeCount: likeCountProp,
  isLiked: isLikedProp,
  createdAt,
  navigation,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likeCountProp);
  const [toggleLikeMutaton] = useMutation(TOGGLE_LIKE, {
    variables: {
      commentId: id,
    },
  });

  const handleLike = async () => {
    // if (isLiked === true) {
    //   setLikeCount((l) => l - 1);
    // } else {
    //   setLikeCount((l) => l + 1);
    // }
    setIsLiked((p) => !p);
    // try {
    //   await toggleLikeMutaton();
    // } catch (e) {
    //   console.log(e);
    // }
  };

  return (
    <Container>
      <Left>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("UserDetail", { username: user.username })
          }
        >
          <Image
            style={{ height: 40, width: 40, borderRadius: 20 }}
            source={{ uri: user.avatar }}
          />
        </TouchableOpacity>
        <CommentRow>
          <TextWrap>
            <UserName
              onPress={() =>
                navigation.navigate("UserDetail", { username: user.username })
              }
            >
              {user.username}
            </UserName>
            <Text style={{ fontWeight: "bold" }}>·</Text>
            <FromNow>{moment(createdAt).format('YYYY.MM.DD')}</FromNow>
          </TextWrap>
          <RatingContainer>
            <Rate size={13} readOnly={true} rating={rating} />
          </RatingContainer>

          <BottomContainer>
            {likeCount > 0 && <BoldOpacity>좋아요 {likeCount} 개</BoldOpacity>}
          </BottomContainer>
        </CommentRow>
      </Left>

      <CommentText>{text}</CommentText>

      <FeedBack>
        <LikeTouchable onPress={handleLike}>
          <Feather name={"thumbs-up"} size={18} />
          <LikeText>좋아요</LikeText>
        </LikeTouchable>

        <LikeTouchable onPress={handleLike}>
          <Feather
            name={"thumbs-down"}
            size={18}
          />
          <LikeText>싫어요</LikeText>
        </LikeTouchable>
      </FeedBack>
    </Container>
  );
};

Review.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    username: PropTypes.string.isRequired,
  }).isRequired,
  // likeCount: PropTypes.number.isRequired,
  // isLiked: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
};

export default withNavigation(Review);
