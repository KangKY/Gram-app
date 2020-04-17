import React from "react";
import styled from "styled-components";
import { gql } from "apollo-boost";
import { Image, TouchableOpacity } from "react-native";
import { Card } from "react-native-elements";
import { useQuery } from "react-apollo-hooks";
import { withNavigation } from "react-navigation";
import Loader from "../components/Loader";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const ListItem = styled.View`
  flex-direction:row;
  padding:10px 5px;
  border-bottom-width:1px;
  border-bottom-color:#ccc;
  align-items: center;
`;

const Text = styled.Text`
  margin-left:10px;
`;

export const GET_LIKES = gql`
  query seeLikes($postId: String, $commentId: String) {
    seeLikes(postId: $postId, commentId:$commentId) {
      id
      user {
        id
        avatar
        username
      }
    }
  }
`;

function Likes({ navigation }) {
  //console.log(navigation.getParams)
  const options =
    navigation.getParam("type") === "post"
      ? {
          variables: {
            postId: navigation.getParam("id"),
          },
        }
      : {
          variables: {
            commentId: navigation.getParam("id"),
          },
        };
  const { data, loading, error } = useQuery(GET_LIKES, options);

  console.log(data, error);

  if (error) {
    return(
      <View  style={{ flex: 1, alignItems:"center", justifyContent:"center" }} >
        <Text>Error</Text>
      </View>
    )
  } 
  else if(loading) {
    return <Loader />
  }
  else if(!loading && data && data.seeLikes) {
    return (
      <Card containerStyle={{padding: 0}}>  
        {data.seeLikes.length === 0 && (
          <Text> 좋아요 누른 사람이 없습니다. </Text>
        )}
        {data.seeLikes.map((u, i) => {
          return (
            <ListItem key={i}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("UserDetail", { username: u.user.username })
                }
              >
                <Image
                  style={{ height: 40, width: 40, borderRadius: 20 }}
                  source={{ uri: u.user.avatar }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("UserDetail", { username: u.user.username })
                }
              >
                <Text>{u.user.username}</Text>
              </TouchableOpacity>
              
            </ListItem>
          );
        })}
      </Card>
    );
  }
}

export default withNavigation(Likes);
