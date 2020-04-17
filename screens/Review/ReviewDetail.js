import React, { useState, useRef } from "react";
import { useQuery, useMutation } from "react-apollo-hooks";
import { gql } from "apollo-boost";
import Loader from "../../components/Loader";
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
import Comments from "../../components/Comments";
import useInput from "../../hooks/useInput";
import styled from "styled-components";
import styles from "../../styles";
import Rate from "../../components/Rate";
import Reviews from "../../components/Reviews";
import { Overlay } from 'react-native-elements';

export const POST_REVIEWS = gql`
  query seeFullPost($id: String!) {
    seeFullPost(id: $id) {
      id
      caption
      avgRating
      reviewCount
      user {
        id
        avatar
        username
      }
      reviews {
        id
        text
        rating
        isLiked
        likeCount
        user {
          id
          avatar
          username
        }
        createdAt
      }
      createdAt
    }
    me {
      id
      avatar
    }
  }
`;

const ADD_REVIEW = gql`
  mutation addReview($postId: String!, $text: String!, $rating:Float!) {
    addReview(postId: $postId, text: $text, rating:$rating) {
      id
      text
      rating
      user {
        id
        avatar
        username
      }
    }
  }
`;

const Touchable = styled.TouchableOpacity`
  flex:1;
`;
const Button = styled.View`
  background-color: ${props => props.theme.blueColor};
  border-width:1px;
  border-color: ${props => props.theme.blueColor};
  padding: 10px 10px;
  border-radius: 4px;
  margin: 0px 10px;
`;
const Text = styled.Text`
  color: #fff;
  text-align: center;
  font-size:16px;
  font-weight: bold;
`;


export default ({ navigation }) => {

  const textInputRef = useRef();
  const comment = useInput("");
  const rating = useInput(3);
  const [refreshing, setRefreshing] = useState(false);


  const { loading, data, refetch } = useQuery(POST_REVIEWS, {
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

  const [addReviewMutation] = useMutation(ADD_REVIEW, {
    refetchQueries: () => [
      { query: POST_DETAIL, variables: { id: navigation.getParam("id") } },
    ],
  });

  const handleSubmit = async () => {
    if (comment.value === "") {
      return;
    }

    
    try {
      const {
        data: { addReview },
      } = await addReviewMutation({
        variables: {
          postId: navigation.getParam("id"),
          text: comment.value,
          rating: rating.value
        },
      });

      if (addReview.id) {
        comment.setValue("");
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
      keyboardVerticalOffset={80}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh}/>}
        contentContainerStyle={{
          flex: 1,
          //flexGrow:1
        }}
      >
        {loading ? (
          <Loader />
        ) : (
          data &&
          data.seeFullPost && (
            <>
              <Reviews {...data.seeFullPost} onReply={onReply} />

              {/* <Header>
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
                <HeaderRow>
                  <TextWrap>
                    <UserName
                      //style={{fontWeight:'bold'}}
                      onPress={() =>
                        navigation.navigate("UserDetail", { username: user.username })
                      }
                    >
                      {user.username}
                    </UserName>
                    <Caption>
                      {caption}
                    </Caption>
                  </TextWrap>

                  <FromNow>{moment(createdAt).fromNow()}</FromNow>
                </HeaderRow>
              </Header>

              <CommentsContainer>
                {reviews && reviews.map((p) => <Review key={p.id} {...p} onReply={onReply} />)}
              </CommentsContainer> */}


              
              <View
                style={{
                  flexDirection: "row",
                  flexWrap:'wrap',
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 5,
                  marginVertical:10,
                }}
              >
                <Touchable onPress={() => navigation.navigate(`WriteReview`, { id:navigation.getParam("id") })}>
                  <Button>
                    <Text>후기 남기기</Text>
                  </Button>
                </Touchable>
              </View>
            </>
          )
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
