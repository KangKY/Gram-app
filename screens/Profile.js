import React, { useState } from "react";
import { ScrollView, RefreshControl } from "react-native";
import { gql } from "apollo-boost";
import { USER_FRAGMENT } from "../fragments";
import Loader from "../components/Loader";
import { useQuery } from "react-apollo-hooks";
import UserProfile from "../components/UserProfile";
import { useLogOut } from "../AuthContext";

export const ME = gql`
  {
    me {
      ...UserInfoParts
    }
  }
  ${USER_FRAGMENT}
`;

export default ({ navigation }) => {
  const { loading, data, refetch } = useQuery(ME);
  const [refreshing, setRefreshing] = useState(false);
  const logOut = useLogOut();

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
  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh}/>}>
      {loading ? <Loader /> : data && data.me && <UserProfile logOut={logOut} {...data.me} />}
    </ScrollView>
  );
};