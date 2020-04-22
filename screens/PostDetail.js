import React, { useState, useRef } from "react";
import { useQuery, useMutation } from "react-apollo-hooks";
import { gql } from "apollo-boost";
import Loader from "../components/Loader";
import {
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  Platform,
  Image,
  View,
  RefreshControl,
  Alert,
} from "react-native";
import Comments from "../components/Comments";
import useInput from "../hooks/useInput";
import styled from "styled-components";
import styles from "../styles";
import Comment from "../components/Comment";
import moment from "moment";
import "moment/locale/ko";

import { Header, useHeaderHeight } from 'react-navigation-stack';

export const POST_DETAIL = gql`
  query seeFullPost($id: String!) {
    seeFullPost(id: $id) {
      id
      caption
      user {
        id
        avatar
        username
      }
      comments {
        id
        text
        isLiked
        likeCount
        recommentCount
        seq
        user {
          id
          avatar
          username
        }
        createdAt
        recomments {
          id
          text
          isLiked
          likeCount
          seq
          user {
            id
            avatar
            username
          }
          createdAt
        }
      }
      createdAt
    }
    me {
      id
      avatar
    }
  }
`;

const ADD_COMMENT = gql`
  mutation addComment($postId: String!, $text: String!) {
    addComment(postId: $postId, text: $text) {
      id
      text
      parent {
        id
      }
      recommentCount
      isLiked
      likeCount
      user {
        id
        avatar
        username
      }
    }
  }
`;

const ADD_REPLY = gql`
  mutation addReply($postId: String!, $text: String!, $commentId: String!) {
    addReply(postId: $postId, text: $text, commentId: $commentId) {
      id
      text
      parent {
        id
      }
      seq
      isLiked
      likeCount
      user {
        id
        avatar
        username
      }
    }
  }
`;

const Container = styled.View`
 flex:1;
`;

const Chip = styled.View`
  background-color: ${styles.blueColor};
  border-radius: 5px;
  padding: 2px 7px;
`;
const Text = styled.Text`
  color: #fff;
`;

const HeaderContainer = styled.View`
  padding: 10px;
  flex-direction: row;
  align-items: flex-start;
  border-bottom-width: 1px;
  border-bottom-color: ${styles.lightGreyColor};
`;
const HeaderRow = styled.View`
  margin-left: 10px;
  margin-right: 80px;
  flex-direction: column;
`;
const Touchable = styled.TouchableOpacity``;

const UserName = styled.Text`
  font-weight: bold;
  margin-right: 10px;
`;

const CommentsContainer = styled.View`
  padding: 10px;
`;

const FromNow = styled.Text`
  opacity: 0.5;
  font-size: 12px;
`;

const Caption = styled.Text``;

const TextWrap = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
`;

export default ({ navigation }) => {
  const textInputRef = useRef();
  const comment = useInput("");
  const [replyInfo, setReplyInfo] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const { loading, data, refetch } = useQuery(POST_DETAIL, {
    variables: { id: navigation.getParam("id") },
  });

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await refetch();
    } catch (e) {
      console.log(e);
    } finally {
      setRefreshing(false);
    }
  };

  const [addCommentMutation] = useMutation(ADD_COMMENT, {
    refetchQueries: () => [
      { query: POST_DETAIL, variables: { id: navigation.getParam("id") } },
    ],
  });

  const [addReplyMutation] = useMutation(ADD_REPLY, {
    refetchQueries: () => [
      { query: POST_DETAIL, variables: { id: navigation.getParam("id") } },
    ],
  });

  const handleSubmit = async () => {
    if (comment.value === "") {
      return;
    }

    try {
      if (replyInfo) {
        const {
          data: { addReply },
        } = await addReplyMutation({
          variables: {
            commentId: replyInfo.commentId,
            postId: navigation.getParam("id"),
            text: comment.value,
          },
        });

        if (addReply.id) {
          setReplyInfo(null);
          comment.setValue("");
        }
      } else {
        const {
          data: { addComment },
        } = await addCommentMutation({
          variables: {
            postId: navigation.getParam("id"),
            text: comment.value,
          },
        });

        if (addComment.id) {
          comment.setValue("");
        }
      }
    } catch (e) {
      console.log(e);
      Alert.alert("Internal Server Error", "Try later");
    } finally {
    }
  };

  const onReply = ({ user, id: commentId }) => () => {
    setReplyInfo({ user, commentId });
    textInputRef.current.focus();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, flexDirection: 'column',justifyContent: 'center' }}
      behavior= {(Platform.OS === 'ios')? "padding" : "height"}
      keyboardVerticalOffset={Platform.select({ios: useHeaderHeight(), android: useHeaderHeight()})}
      enabled
    >
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh}/>}
        // contentContainerStyle={{
        //   flex: 1,
        // }}
        // contentContainerStyle={{
        //   //paddingVertical: 50,
        //   flexGrow: 1,
        //   //justifyContent: "flex-end",
        //   //alignItems: "center"
        // }}
      >
        {loading ? (
          <Loader />
        ) : (
          data &&
          data.seeFullPost && (
            <>
              {/* <Comments {...data.seeFullPost} onReply={onReply} /> */}
              <HeaderContainer>
                <Touchable
                  onPress={() =>
                    navigation.navigate("UserDetail", {
                      username: data.seeFullPost.user.username,
                    })
                  }
                >
                  <Image
                    style={{ height: 40, width: 40, borderRadius: 20 }}
                    source={{ uri: data.seeFullPost.user.avatar }}
                  />
                </Touchable>
                <HeaderRow>
                  <TextWrap>
                    <UserName
                      //style={{fontWeight:'bold'}}
                      onPress={() =>
                        navigation.navigate("UserDetail", {
                          username: data.seeFullPost.user.username,
                        })
                      }
                    >
                      {data.seeFullPost.user.username}
                    </UserName>
                    <FromNow>
                      {moment(data.seeFullPost.createdAt).fromNow()}
                    </FromNow>
                  </TextWrap>

                  <Caption>{data.seeFullPost.caption}</Caption>
                </HeaderRow>
              </HeaderContainer>

              <CommentsContainer>
                {data.seeFullPost.comments &&
                  data.seeFullPost.comments.map((p) => (
                    <Comment key={p.id} {...p} onReply={onReply} />
                  ))}
              </CommentsContainer>
            </>
          )
        )}

        
      </ScrollView>
      <View
        style={{
          //flex:1,
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "rgb(230,230,230)",
          paddingHorizontal: 10,
        }}
      >
        {/* <Image
                style={{ height: 40, width: 40, borderRadius: 20 }}
                source={{ uri: data.me.avatar }}
              /> */}
        {replyInfo && (
          <Chip>
            <Text>{replyInfo.user.username}</Text>
          </Chip>
        )}

        <TextInput
          placeholder="댓글 달기"
          style={{
            flex:1,
            paddingVertical: 15,
            paddingHorizontal: 10,
            backgroundColor: "#fff",
            flexWrap: "wrap",
          }}
          ref={textInputRef}
          returnKeyType="send"
          value={comment.value}
          onChangeText={comment.onChange}
          onSubmitEditing={handleSubmit}
        />
      </View>
    </KeyboardAvoidingView>
  );
};
