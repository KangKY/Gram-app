import React from "react";
import {
  Image,
  ScrollView,
} from "react-native";
import styled from "styled-components";
import PropTypes from "prop-types";
import styles from "../styles";
import { withNavigation } from "react-navigation";
import Review from "./Review";
import moment from "moment";
import "moment/locale/ko";
import constants from "../constants";
import Rate from "./Rate";



const Container = styled.View`
  flex: 1;
  /* height:${constants.height - 80}; */
`;

const Header = styled.View`
  padding: 10px;
  flex-direction: column;
  border-bottom-width:1px;
  border-bottom-color:${styles.lightGreyColor};
`;
const HeaderRow = styled.View`
  flex-direction: row;
  align-items:center;
  justify-content:space-between;
`;
const Touchable = styled.TouchableOpacity``;

const UserName = styled.Text`
  font-weight: bold;
`;;

const CommentsContainer = styled.View`
  padding: 10px;
`;

const FromNow = styled.Text`
  margin-top: 5px;
  opacity: 0.5;
  font-size: 12px;
`;

const Caption = styled.Text`
  margin-left: 15px;
  padding-left: 15px;
`;

const TextWrap = styled.Text`
  padding-right:10px;
`;

const TotalRating = styled.Text`
  font-size:23px;
`;
const Text = styled.Text`
`;


const Reviews = ({
  id,
  user,
  caption,
  createdAt,
  avgRating = 3,
  reviewCount,
  reviews = [],
  navigation,
  onReply
}) => {
  return (
    <ScrollView>
      <Header>
        <HeaderRow>
          <Rate size={28} rating={avgRating} readOnly={true} />
          <Text><TotalRating>{reviewCount}</TotalRating>개</Text>
        </HeaderRow>

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
      </CommentsContainer>
    </ScrollView>
  );
};

Reviews.propTypes = {
  id: PropTypes.string.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    username: PropTypes.string.isRequired,
  }).isRequired,
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,
  caption: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
};

export default withNavigation(Reviews);
