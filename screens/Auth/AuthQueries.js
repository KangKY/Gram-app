import { gql } from "apollo-boost";

export const LOG_IN = gql`
  mutation logIn($email:String!, $password:String!) {
    requestLogin(email:$email, password:$password)
  }
`;

export const CREATE_ACCOUNT = gql`
  mutation createAccount($email:String!, $password:String!, $username:String!) {
    createAccount(email:$email,password:$password, username:$username) 
  }
`;