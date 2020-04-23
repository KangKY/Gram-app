import { gql } from "apollo-boost";

export const POST_FRAGMENT = gql`
  fragment PostParts on Post {
    id
    location
    caption
    user {
      id
      avatar
      username
    }
    files {
      id
      url
    }
    avgRating
    commentCount
    reviewCount
    likeCount
    isLiked
    comments {
      id
      text
      user {
        id
        avatar
        username
      }
    }
    tags {
      id
      text
    }
    createdAt
  }
`;

export const USER_FRAGMENT = gql`
  fragment UserInfoParts on User {
    id
    avatar
    username
    fullName
    isFollowing
    itsMe
    bio
    followingCount
    followersCount
    postsCount
    ourChat {
      id
      oppUser {
        id
        username
        avatar
      }
    }
    posts {
      ...PostParts
    }
  }
  ${POST_FRAGMENT}
`;