import React, { useState } from "react";
import styled from "styled-components";
import { TouchableOpacity, Image, Text } from "react-native";
import PropTypes from "prop-types";
import { gql } from "apollo-boost";
import moment from "moment";
import "moment/locale/ko";
import { withNavigation } from "react-navigation";
import constants from "../constants";

const Container = styled.View`
  padding: 10px 15px;
  flex-direction: row;
  align-items: center;
`;

const CommentRow = styled.View`
  margin-left: 10px;
  margin-right: 80px;
  flex-direction: column;
`;
const CommentText = styled.Text`
  opacity: 0.5;
  font-size: 14px;
  margin-right: 5px;
  max-width:${constants.width - 160};
`;

const UserName = styled.Text`
  font-weight: bold;
`;

const TextWrap = styled.View`
  flex-direction: row;
  /* flex-wrap: wrap; */
  align-items:center;
  /* flex:1; */
`;

const FromNow = styled.Text`
  opacity: 0.5;
  font-size: 12px;
  margin-left: 5px;
`;

export const TOGGLE_LIKE = gql`
  mutation toggleCommentLike($commentId: String!) {
    toggleCommentLike(commentId: $commentId)
  }
`;

const Chat = ({
  id,
  oppUser,
  lastMessage,
  createdAt,
  navigation
}) => {

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Message", { id, username: oppUser.username, userId:oppUser.id })
      }
    >
      <Container>
        <Image
          style={{ height: 45, width: 45, borderRadius: 22.5 }}
          source={{ uri: oppUser.avatar }}
        />

        <CommentRow>
          <TextWrap>
            <UserName>
              {oppUser.username}
            </UserName>

          </TextWrap>
          {lastMessage && lastMessage.length > 0 && 
          <TextWrap>
            <CommentText numberOfLines={1}>{lastMessage[0].text}</CommentText>  
            <Text style={{fontWeight:"bold"}}>·</Text>
            <FromNow>{moment(lastMessage[0].createdAt).fromNow()}</FromNow>
          </TextWrap>
          } 
        </CommentRow>
      </Container>
    </TouchableOpacity>
  );
};

Chat.propTypes = {
  id: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  oppUser:PropTypes.shape({
    id: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    username: PropTypes.string.isRequired,
  }).isRequired,
  lastMessage:PropTypes.array
};

export default withNavigation(Chat);
