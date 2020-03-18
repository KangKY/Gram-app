import React, { useState } from "react";
import styled from "styled-components";
import Loader from "../components/Loader";
import { gql } from "apollo-boost";
import { useQuery } from "react-apollo-hooks";
import { POST_FRAGMENT } from "../fragments";
import { ScrollView, RefreshControl } from 'react-native'; // 성능이 필요한 경우 FlatList 사용
import Post from "../components/Post";


export const FEED_QUERY = gql`
  {
    seeFeed {
      ...PostParts
    }
  }
  ${POST_FRAGMENT}
`;

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;

export default () => {
  const { loading, data, refetch } = useQuery(FEED_QUERY);
  const [refreshing, setRefreshing] = useState(false);

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
  console.log(data);

  return (
  <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}>
    {loading ? 
      <Loader /> : 
      data && data.seeFeed && data.seeFeed.map(post => <Post key={post.id} {...post} />)
    }
  </ScrollView>);
};
