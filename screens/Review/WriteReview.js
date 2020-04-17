import React, { useState, useRef } from "react";
import { useQuery, useMutation } from "react-apollo-hooks";
import gql from "graphql-tag";
import {
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  Platform,
  View,
  Alert,
} from "react-native";
import useInput from "../../hooks/useInput";
import styled from "styled-components";
import Rate from "../../components/Rate";
import { POST_REVIEWS } from "./ReviewDetail";

const ADD_REVIEW = gql`
  mutation addReview($postId: String!, $text: String!, $rating: Float!) {
    addReview(postId: $postId, text: $text, rating: $rating) {
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

const RatingWrapper = styled.View`
  height:100px;
  align-items:center;
  justify-content:center;
`;

const Touchable = styled.TouchableOpacity`
  flex: 1;
`;
const Button = styled.View`
  background-color: ${(props) => props.theme.blueColor};
  border-width: 1px;
  border-color: ${(props) => props.theme.blueColor};
  padding: 10px 10px;
  border-radius: 4px;
  margin: 10px;
`;
const Text = styled.Text`
  color: #fff;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
`;

export default ({ navigation }) => {
  const textInputRef = useRef();
  const review = useInput("");
  const rating = useInput(3);
  
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

  const [addReviewMutation] = useMutation(ADD_REVIEW, {
    refetchQueries: () => [
      { query: POST_REVIEWS, variables: { id: navigation.getParam("id") } },
    ],
  });

  const handleSubmit = async () => {
    if (review.value === "") {
      return;
    }

    try {
      const {
        data: { addReview },
      } = await addReviewMutation({
        variables: {
          postId: navigation.getParam("id"),
          text: review.value,
          rating: rating.value,
        },
      });

      console.log(addReview);
      if (addReview.id) {
        navigation.navigate("ReviewDetail",{id:navigation.getParam("id")});
      }
    } catch (e) {
      console.log(e);
      Alert.alert("Internal Server Error", "Try later");
    } finally {
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      enabled
      keyboardVerticalOffset={50}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh}/>}
        contentContainerStyle={{
          flex: 1,
        }}
      >
        <RatingWrapper>
          <Rate rating={rating.value} onChange={rating.setValue} size={35} />
        </RatingWrapper>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 15,
           
          }}
        >
          <TextInput
            placeholder="후기를 남겨주세요."
            style={{
              flex: 1,
              height:150,
              justifyContent:"flex-start",
              alignItems:"flex-start",
              paddingVertical: 15,
              paddingHorizontal: 10,
              backgroundColor: "#fff",
              flexWrap: "wrap",
            }}
            multiline={true}
            ref={textInputRef}
            returnKeyType="send"
            value={review.value}
            onChangeText={review.onChange}
            // onSubmitEditing={handleSubmit}
          />
      
        </View>
        <Touchable onPress={handleSubmit}>
          <Button>
            <Text>등록하기</Text>
          </Button>
        </Touchable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
