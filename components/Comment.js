import React, { useState } from "react";
import styled from "styled-components";
import { TouchableOpacity, Image } from "react-native";
import { useMutation } from "react-apollo-hooks";
import PropTypes from "prop-types";
import { gql } from "apollo-boost";
import moment from "moment";
import "moment/locale/ko";
import { withNavigation } from "react-navigation";

const Container = styled.View`
  padding: 10px 0px;
  flex-direction: row;
  align-items: flex-start;
`;

const ReContainer = styled.View`
  padding: 10px 0px;
  flex-direction: row;
  align-items: flex-start;
  margin-left: 40px;
`;

const CommentRow = styled.View`
  margin-left: 10px;
  margin-right: 80px;
  flex-direction: column;
`;
const CommentText = styled.Text``;

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

const RecommentText = styled.Text`
  margin-top: 5px;
  opacity: 0.5;
  font-size: 12px;
  margin-right: 15px;
`;

const FromNow = styled.Text`
  /* margin-top: 5px; */
  opacity: 0.5;
  font-size: 12px;
`;

export const TOGGLE_LIKE = gql`
  mutation toggleCommentLike($commentId: String!) {
    toggleCommentLike(commentId: $commentId)
  }
`;

const Comment = ({
  id,
  recommentCount,
  text,
  user,
  recomments,
  likeCount: likeCountProp,
  isLiked: isLikedProp,
  createdAt,
  navigation,
  onReply,
}) => {
  const [isLiked, setIsLiked] = useState(isLikedProp);
  const [likeCount, setLikeCount] = useState(likeCountProp);
  const [showRecomment, setShowRecomment] = useState(false);
  const [toggleLikeMutaton] = useMutation(TOGGLE_LIKE, {
    variables: {
      commentId: id,
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

  const handleShowRecomment = () => {
    setShowRecomment((p) => !p);
  };

  return (
    <>
      <Container>
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
            <FromNow>{moment(createdAt).fromNow()}</FromNow>
           
          </TextWrap>
          <CommentText>{text}</CommentText>
          <BottomContainer>
            {/* <FromNow>{moment(createdAt).fromNow()}</FromNow> */}

            {recommentCount > 0 && (showRecomment ? (
              <TouchableOpacity onPress={handleShowRecomment}>
                <RecommentText>댓글 숨기기</RecommentText>
              </TouchableOpacity>
            ) : (
               <TouchableOpacity onPress={handleShowRecomment}>
                <RecommentText>댓글 {recommentCount}개</RecommentText>
              </TouchableOpacity>
            ))}

            {likeCount > 0 && <BoldOpacity>좋아요 {likeCount} 개</BoldOpacity>}
            <BoldOpacity onPress={onReply({ user, id })}>답글 달기</BoldOpacity>
          </BottomContainer>

          {/* {recommentCount > 0 && <BottomContainer>
            {showRecomment ? (
              <TouchableOpacity onPress={handleShowRecomment}>
                <RecommentText>댓글 숨기기</RecommentText>
              </TouchableOpacity>
            ) : (
               <TouchableOpacity onPress={handleShowRecomment}>
                <RecommentText>댓글 {recommentCount}개</RecommentText>
              </TouchableOpacity>
            )}
          </BottomContainer>} */}
        </CommentRow>
      </Container>
      {showRecomment &&
        recomments &&
        recomments.length > 0 &&
        recomments.map((p) => (
          <ReContainer key={p.id}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("UserDetail", { username: p.user.username })
              }
            >
              <Image
                style={{ height: 40, width: 40, borderRadius: 20 }}
                source={{ uri: p.user.avatar }}
              />
            </TouchableOpacity>

            <CommentRow>
              <TextWrap>
                <UserName
                  onPress={() =>
                    navigation.navigate("UserDetail", {
                      username: p.user.username,
                    })
                  }
                >
                  {p.user.username}
                </UserName>
                <FromNow>{moment(p.createdAt).fromNow()}</FromNow> 
              </TextWrap>
              <CommentText>{p.text}</CommentText>
              <BottomContainer>
                {/* <FromNow>{moment(p.createdAt).fromNow()}</FromNow> */}
                {p.likeCount > 0 && (
                  <BoldOpacity>좋아요 {p.likeCount} 개</BoldOpacity>
                )}
                {/* <BoldOpacity onPress={onReply({ user, id })}>
                  답글 달기
                </BoldOpacity> */}
              </BottomContainer>
            </CommentRow>
          </ReContainer>
        ))}
    </>
  );
};

Comment.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    username: PropTypes.string.isRequired,
  }).isRequired,
  recomments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,
  likeCount: PropTypes.number.isRequired,
  recommentCount: PropTypes.number.isRequired,
  isLiked: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
};

export default withNavigation(Comment);
