import React, { useState } from "react";
import { useQuery } from "react-apollo-hooks";
import { GET_USER } from "../SharedQueries";
import Loader from "../components/Loader";
import { ScrollView, RefreshControl } from "react-native";
import UserProfile from "../components/UserProfile";



export default ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const { loading, data, refetch } = useQuery(GET_USER, {
    variables: { username: navigation.getParam("username") }
  });

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
      {loading ? (
        <Loader />
      ) : (
        data && data.seeUser && <UserProfile {...data.seeUser} />
      )}
    </ScrollView>
  );
};