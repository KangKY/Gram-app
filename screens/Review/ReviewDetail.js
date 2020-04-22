import React, { useState } from "react";
import { useQuery } from "react-apollo-hooks";
import { gql } from "apollo-boost";
import Loader from "../../components/Loader";
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
  RefreshControl,
} from "react-native";
import styled from "styled-components";
import styles from "../../styles";
import moment from "moment";
import "moment/locale/ko";
import Rate from "../../components/Rate";
import Review from "../../components/Review";

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

const Touchable = styled.TouchableOpacity`
  flex: 1;
`;
const Button = styled.View`
  background-color: ${(props) => props.theme.blueColor};
  border-width: 1px;
  border-color: ${(props) => props.theme.blueColor};
  padding: 10px 10px;
  border-radius: 4px;
  margin: 0px 10px;
`;
const ReviewText = styled.Text`
  color: #fff;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
`;

const Container = styled.View`
  flex: 1;
`;

const Header = styled.View`
  padding: 10px;
  flex-direction: column;
  border-bottom-width: 1px;
  border-bottom-color: ${styles.lightGreyColor};
`;
const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  /* background-color:#fff; */
`;

const CommentsContainer = styled.View`
  padding: 10px;
`;

const FromNow = styled.Text`
  margin-top: 5px;
  opacity: 0.5;
  font-size: 12px;
`;

const TextWrap = styled.Text`
  padding-right: 10px;
`;

const TotalRating = styled.Text`
  font-size: 23px;
`;

const AvgRating = styled.Text`
  text-align:center;
`;
const Text = styled.Text``;

export default ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);

  const { loading, data, refetch } = useQuery(POST_REVIEWS, {
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


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      keyboardVerticalOffset={80}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {loading ? (
          <Loader />
        ) : (
          data &&
          data.seeFullPost && (
            <Container>
              {/* <Reviews {...data.seeFullPost} onReply={onReply} /> */}
              <Header>
                <HeaderRow>
                  <View>
                    <Rate
                      isFractions={true}
                      size={35}
                      rating={data.seeFullPost.avgRating}
                      readOnly={true}
                    />
                    <AvgRating>({data.seeFullPost.avgRating})</AvgRating>
                  </View>
                  
                  <Text>
                    <TotalRating>{data.seeFullPost.reviewCount}</TotalRating>개
                  </Text>
                </HeaderRow>

                <HeaderRow>
                  <TextWrap></TextWrap>

                  <FromNow>
                    {moment(data.seeFullPost.createdAt).format("YYYY.MM.DD")}
                  </FromNow>
                </HeaderRow>
              </Header>

              <CommentsContainer>
                {data.seeFullPost.reviews &&
                  data.seeFullPost.reviews.map((p) => (
                    <Review key={p.id} {...p} />
                  ))}
              </CommentsContainer>
            </Container>
          )
        )}
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 5,
          marginVertical: 10,
        }}
      >
        <Touchable
          onPress={() =>
            navigation.navigate(`WriteReview`, {
              id: navigation.getParam("id"),
            })
          }
        >
          <Button>
            <ReviewText>후기 남기기</ReviewText>
          </Button>
        </Touchable>
      </View>
    </KeyboardAvoidingView>
  );
};
