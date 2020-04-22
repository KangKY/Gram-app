import React from "react";
import {
  Image,
  ScrollView,
} from "react-native";
import styled from "styled-components";
import PropTypes from "prop-types";
import styles from "../styles";
import { withNavigation } from "react-navigation";
import Comment from "./Comment";
import moment from "moment";
import "moment/locale/ko";



const Container = styled.View`
  flex: 1;
`;

const Header = styled.View`
  padding: 10px;
  flex-direction: row;
  align-items: flex-start;
  border-bottom-width:1px;
  border-bottom-color:${styles.lightGreyColor};
`;
const HeaderRow = styled.View`
  margin-left: 10px;
  margin-right:80px;
  flex-direction: column;
`;
const Touchable = styled.TouchableOpacity``;

const UserName = styled.Text`
  font-weight: bold;
  margin-right: 10px;
`;;

const CommentsContainer = styled.View`
  padding: 10px;
`;

const FromNow = styled.Text`
  opacity: 0.5;
  font-size: 12px;
`;

const Caption = styled.Text`
`;

const TextWrap = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items:center;
`;


const Comments = ({
  id,
  user,
  caption,
  createdAt,
  comments = [],
  navigation,
  onReply
}) => {
  return (
    <ScrollView style={{flex:1}}>
      <Header>
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
            <FromNow>{moment(createdAt).fromNow()}</FromNow>
           
          </TextWrap>

          <Caption>
              {caption}
            </Caption>
        </HeaderRow>
      </Header>

      <CommentsContainer>
        {comments && comments.map((p) => <Comment key={p.id} {...p} onReply={onReply} />)}
      </CommentsContainer>
    </ScrollView>
  );
};

Comments.propTypes = {
  id: PropTypes.string.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    username: PropTypes.string.isRequired,
  }).isRequired,
  comments: PropTypes.arrayOf(
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

export default withNavigation(Comments);
