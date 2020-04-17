import React, { useState } from "react";
import { Image, View } from "react-native";
import styled from "styled-components";
import { Ionicons } from "@expo/vector-icons";
import PropTypes from "prop-types";
import styles from "../styles";
import { Platform } from "@unimodules/core";
import constants from "../constants";
import SquarePhoto from "./SquarePhoto";
import Post from "./Post";
import AuthButton from "./AuthButton";
import FollowButton from "./FollowButton";
import { withNavigation } from "react-navigation";

const ProfileHeader = styled.View`
  padding: 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const HeaderColumn = styled.View``;

const ProfileStats = styled.View`
  flex-direction: row;
`;

const ProfileButtons = styled.View`
  flex-direction: row;
  flex:1;
  margin-top:15px;
`;

const TouchableOpacity = styled.TouchableOpacity`
  flex:1;
`;

const ProfileButton = styled.View`
  background-color: ${props =>
  props.bgColor ? props.bgColor : props.theme.blueColor};
 
  border-width:1px;
  border-color: ${props =>
  props.borderColor ? props.borderColor : props.theme.blueColor};
  padding: 5px 10px;
  border-radius: 4px;
  flex:1;
  margin: 0px 10px;
`;

const ButtonText = styled.Text`
  color: ${props => props.textColor ? props.bgColor : props.theme.blackColor};
  text-align: center;
  font-weight: 600;
`;

const Stat = styled.View`
  align-items: center;
  margin-left: 40px;
`;

const Bold = styled.Text`
  font-weight: bold;
`;

const StatName = styled.Text`
  margin-top: 5px;
  font-size: 12px;
  color: ${styles.darkGreyColor};
`;

const ProfileMeta = styled.View`
  margin-top: 10px;
  padding-horizontal: 20px;
`;

const Bio = styled.Text``;

const ButtonContainer = styled.View`
  padding-vertical: 5px;
  border: 1px solid ${styles.lightGreyColor};
  flex-direction: row;
  margin-top: 25px;
`;

const Button = styled.View`
  width: ${constants.width / 2};
  align-items: center;
`;

const SquareContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;


const UserProfile = ({
  id,
  itsMe,
  isFollowing,
  avatar,
  postsCount,
  followersCount,
  followingCount,
  bio,
  username,
  posts,
  ourChat,
  logOut,
  navigation
}) => {
  const [isGrid, setIsGrid] = useState(true);
  const toggleGrid = () => setIsGrid(i => !i);

  //console.log(ourChat)

  return (
    <View>
      <ProfileHeader>
        <Image
          style={{ height: 80, width: 80, borderRadius: 40 }}
          source={{ uri: avatar }}
        />
        <HeaderColumn>
          <ProfileStats>
            <Stat>
              <Bold>{postsCount}</Bold>
              <StatName>게시물</StatName>
            </Stat>
            <Stat>
              <Bold>{followersCount}</Bold>
              <StatName>팔로워</StatName>
            </Stat>
            <Stat>
              <Bold>{followingCount}</Bold>
              <StatName>팔로잉</StatName>
            </Stat>
          </ProfileStats>
        </HeaderColumn>
      </ProfileHeader>
      <ProfileMeta>
        <Bold>{username}</Bold>
        <Bio>{bio}</Bio>
      </ProfileMeta>
      <ProfileButtons>
        {itsMe ? (
          <>
            <TouchableOpacity>
              <ProfileButton bgColor={"#fff"} borderColor={styles.darkGreyColor}>
                <ButtonText>프로필 수정</ButtonText>
              </ProfileButton>
            </TouchableOpacity>
            <TouchableOpacity onPress={logOut}>
              <ProfileButton bgColor={"#fff"} borderColor={styles.darkGreyColor}>
                <ButtonText>로그아웃</ButtonText>
              </ProfileButton>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity>
              <FollowButton id={id} isFollowing={isFollowing}>
                <ButtonText textColor={"#fff"} >팔로잉</ButtonText>
              </FollowButton>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => 
              ourChat.length > 0 ? navigation.navigate('Message', {
                id:ourChat[0].id,
                userId:id,
                username
              }):(
                navigation.navigate('Message',{
                  userId:id,
                  username
                })
              )
            }>
              <ProfileButton bgColor={"#fff"} borderColor={styles.darkGreyColor}>
                <ButtonText>메시지</ButtonText>
              </ProfileButton>
            </TouchableOpacity>
          </>
        )}
      </ProfileButtons>
      <ButtonContainer>
        <TouchableOpacity onPress={toggleGrid}>
          <Button>
            <Ionicons
              color={isGrid ? styles.black : styles.darkGreyColor}
              size={32}
              name={Platform.OS === "ios" ? "ios-grid" : "md-grid"}
            />
          </Button>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleGrid}>
          <Button>
            <Ionicons
              color={!isGrid ? styles.black : styles.darkGreyColor}
              size={32}
              name={Platform.OS === "ios" ? "ios-list" : "md-list"}
            />
          </Button>
        </TouchableOpacity>
      </ButtonContainer>
      <SquareContainer>
        {posts &&
          posts.map((p) => (isGrid ? <SquarePhoto key={p.id} {...p} /> : null))}
      </SquareContainer>
      {posts && posts.map((p) => (isGrid ? null : <Post key={p.id} {...p} />))}
    </View>
  );
};

// TypeScript 사용하면 아래 내용 필요 X
UserProfile.propTypes = {
  id: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
  isFollowing: PropTypes.bool.isRequired,
  itsMe: PropTypes.bool.isRequired,
  bio: PropTypes.string.isRequired,
  followingCount: PropTypes.number.isRequired,
  followersCount: PropTypes.number.isRequired,
  postsCount: PropTypes.number.isRequired,
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        avatar: PropTypes.string,
        username: PropTypes.string.isRequired
      }).isRequired,
      files: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          url: PropTypes.string.isRequired
        })
      ).isRequired,
      likeCount: PropTypes.number.isRequired,
      isLiked: PropTypes.bool.isRequired,
      comments: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          text: PropTypes.string.isRequired,
          user: PropTypes.shape({
            id: PropTypes.string.isRequired,
            username: PropTypes.string.isRequired
          }).isRequired
        })
      ).isRequired,
      caption: PropTypes.string.isRequired,
      location: PropTypes.string,
      createdAt: PropTypes.string.isRequired
    })
  )
};
export default withNavigation(UserProfile);