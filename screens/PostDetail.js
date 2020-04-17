import React, { useState, useRef } from "react";
import { useQuery, useMutation } from "react-apollo-hooks";
import { gql } from "apollo-boost";
import Loader from "../components/Loader";
import {
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  Platform,
  View,
  Image,
  RefreshControl,
  Alert,
} from "react-native";
import Comments from "../components/Comments";
import useInput from "../hooks/useInput";
import styled from "styled-components";
import styles from "../styles";

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

const Chip = styled.View`
  background-color:${styles.blueColor};
  border-radius:5px;
  padding:2px 7px;
`;
const Text = styled.Text`
  color:#fff;
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
    } catch(e) {
      console.log(e);
    } finally {
      setRefreshing(false);
    }
  }

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
            commentId:replyInfo.commentId,
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

  const onReply = ({user, id:commentId})=> () => {
    setReplyInfo({user, commentId});
    textInputRef.current.focus();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      keyboardVerticalOffset={70}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh}/>}
        contentContainerStyle={{
          flex: 1,
        }}
      >
        {loading ? (
          <Loader />
        ) : (
          data &&
          data.seeFullPost && (
            <>
              <Comments {...data.seeFullPost} onReply={onReply} />
              <View
                style={{
                  flexDirection: "row",
                  flexWrap:'wrap',
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
                    flex: 1,
                    paddingVertical: 15,
                    paddingHorizontal: 10,
                    backgroundColor: "#fff",
                    flexWrap:'wrap'
                  }}
                  ref={textInputRef}
                  returnKeyType="send"
                  value={comment.value}
                  onChangeText={comment.onChange}
                  onSubmitEditing={handleSubmit}
                />
              </View>
            </>
          )
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
