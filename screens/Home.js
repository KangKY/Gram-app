import React, { useState } from "react";
import styled from "styled-components";
import Loader from "../components/Loader";
import { gql } from "apollo-boost";
import { useQuery } from "react-apollo-hooks";
import { POST_FRAGMENT } from "../fragments";
import { ScrollView, RefreshControl } from 'react-native'; // 성능이 필요한 경우 FlatList 사용
import Post from "../components/Post";

import { Button, Segment, Text } from 'native-base';
import constants from "../constants";
import BoxPost from "../components/BoxPost";
import Timeline from "../components/Timeline";

export const FEED_QUERY = gql`
  {
    seeFeed {
      ...PostParts
    }
  }
  ${POST_FRAGMENT}
`;

const View = styled.View``;

const TopSegment = styled(Segment)`
  padding-top:10px;
  background-color:#f2f2f2;
  width:${constants.width};
`;

const TopButton = styled(Button)`
  border-color:#2b2b2b;
  background-color:${props => props.active ? '#fff':'transparent'};
`;

const TopText = styled(Text)`
  text-align:center;
  width:${constants.width / 3 - 10};
  color:#2b2b2b;
`
const TimelineContainer = styled.View`
  align-items:center;
`;

const SquareContainer = styled.View`
  margin-top:15px;
  flex-direction: row;
  flex-wrap: wrap;
`;

export default () => {
  const { loading, data, refetch } = useQuery(FEED_QUERY);
  const [refreshing, setRefreshing] = useState(false);
  const [active, setActive] = useState("second");

  const handleSegment = category => {
    setActive(category);
  }

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
  <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}>
    {loading ? 
      <Loader /> : (
        <View>
          <TopSegment>
            <TopButton first active={active === "first"} underlayColor={'red'} onPress={() => handleSegment('first')}>
              <TopText>게시물</TopText>
            </TopButton>
            <TopButton active={active === "second"} underlayColor={'red'} onPress={() => handleSegment('second')}>
              <TopText>타임라인</TopText>
            </TopButton>
            <TopButton last active={active === "third"} onPress={() => handleSegment('third')}>
              <TopText>갤러리</TopText>
            </TopButton>
          </TopSegment>
          {active === 'first' && data && data.seeFeed && data.seeFeed.map(post => <Post key={post.id} {...post} />)}
          {active === 'second' && 
            <TimelineContainer>
              {data && data.seeFeed && data.seeFeed.map(post => <Timeline key={post.id} {...post} />)}
            </TimelineContainer>
          }
          {active === 'third' && 
            <SquareContainer>
            {data && data.seeFeed && data.seeFeed.map(post => <BoxPost key={post.id} {...post} />)}
            </SquareContainer>
          }
          {/* {data && data.seeFeed && data.seeFeed.map(post => <Post key={post.id} {...post} />)} */}
        </View>
      )
      
    }
  </ScrollView>);
};
