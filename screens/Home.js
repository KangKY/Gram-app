import React, { useState } from "react";
import styled from "styled-components";
import Loader from "../components/Loader";
import { gql } from "apollo-boost";
import { useQuery } from "react-apollo-hooks";
import { POST_FRAGMENT } from "../fragments";
import { ScrollView, RefreshControl, Platform, SafeAreaView } from 'react-native'; // 성능이 필요한 경우 FlatList 사용
import Post from "../components/Post";

import { Button, Segment, Text } from 'native-base';
import constants from "../constants";
import BoxPost from "../components/BoxPost";
import Timeline from "../components/Timeline";
import ModalDropdown from 'react-native-modal-dropdown';
import { Ionicons } from "@expo/vector-icons";
import PopupMenu from "../components/PopupMenu";

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
  background-color:#f2f2f2;
  width:${constants.width};
  height:55;
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
  padding:5px;
  justify-content:center;
`;

const Square = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const MenuWrap = styled.View`
  
  justify-content:center;
  align-items:center;
  padding-top:10px;
`;
const Menu = styled.View`
  flex-direction:row;
  align-items:center;
  justify-content:center;
  border:1px solid #000;
  padding:5px;
  border-radius:10px;
`;

export default () => {
  const { loading, data, refetch } = useQuery(FEED_QUERY);
  const [refreshing, setRefreshing] = useState(false);
  const [active, setActive] = useState("third");
  const [filter, setFilter] = useState("최신순");

  const handleSegment = category => {
    setActive(category);
  }

  const handleFilter = filter => {
    setFilter(filter);
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
    // <ScrollView
    //   refreshControl={
    //     <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
    //   }
    // >
    <>
      {loading ? (
        <Loader />
      ) : (
        <View>
          <TopSegment>
            <TopButton
              first
              active={active === "first"}
              underlayColor={"red"}
              onPress={() => handleSegment("first")}
            >
              <TopText>게시물</TopText>
            </TopButton>
            <TopButton
              active={active === "second"}
              underlayColor={"red"}
              onPress={() => handleSegment("second")}
            >
              <TopText>타임라인</TopText>
            </TopButton>
            <TopButton
              last
              active={active === "third"}
              onPress={() => handleSegment("third")}
            >
              <TopText>갤러리</TopText>
            </TopButton>
          </TopSegment>

          {active === "third" && (
              <MenuWrap>
                {/* <ModalDropdown 
                  defaultIndex={0}
                  defaultValue={filter} 
                  options={["최신순", "인기순"]}
                  style={{flexDirection:'row'}}
                  textStyle={{fontSize:14}}
                  dropdownStyle={{padding:10, height:'auto'}}
                  dropdownTextStyle={{fontSize:15}}
                  onSelect={(i, v) => handleFilter(v)}
                >
                  <Menu>
                    <Text>{filter}</Text>
                    <Ionicons 
                      name={Platform.OS === 'ios'? "ios-arrow-dropdown":"md-arrow-dropdown"}
                      size={14}
                      style={{marginLeft:5}}
                    />
                  </Menu>
                </ModalDropdown> */}
                <PopupMenu text={filter} items={["최신순", "인기순"]} onPress={() => {}}/>
              </MenuWrap>
            )}

          <ScrollView
            style={{marginBottom:55}}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
          >
          {active === "first" &&
            data &&
            data.seeFeed &&
            data.seeFeed.map((post) => <Post key={post.id} {...post} />
          )}
          {active === "second" && (
            <TimelineContainer>
              {data &&
                data.seeFeed &&
                data.seeFeed.map((post) => (
                  <Timeline key={post.id} {...post} />
                ))}
            </TimelineContainer>
          )}
          {active === "third" && (
              <SquareContainer>
                <Square>
                {data &&
                  data.seeFeed &&
                  data.seeFeed.map((post) => (
                    <BoxPost key={post.id} {...post} />
                  ))}
                </Square>
              </SquareContainer>
          )}
          </ScrollView>
          {/* {data && data.seeFeed && data.seeFeed.map(post => <Post key={post.id} {...post} />)} */}
        </View>
      )}
    </>
  );
};
