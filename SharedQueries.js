import { gql } from "apollo-boost";
import { USER_FRAGMENT } from "./fragments";

export const GET_USER = gql`
  query seeUser($username: String, $id: String) {
    seeUser(username: $username, id:$id) {
      ...UserInfoParts
    }
  }
  ${USER_FRAGMENT}
`;
