import React, { useState } from "react";
import styled from "styled-components";
import { gql } from "apollo-boost";
import { useQuery } from "react-apollo-hooks";
import Loader from "../../components/Loader";
import { RefreshControl, ScrollView } from "react-native";
import Chat from "../../components/Chat";
import useInput from "../../hooks/useInput";
import SearchBar from "../../components/SearchBar";
import constants from "../../constants";

const CHATS = gql`
  query seeChats {
    seeChats {
      id
      participants {
        id
        itsMe
        avatar
        username
      }
      oppUser {
        id
        itsMe
        avatar
        username
      }
      lastMessage {
        id
        text
        createdAt
      }
      createdAt
    }
  }
`;

const View = styled.View`
  /* align-items: center; */
  justify-content: center;

`;
const InputView = styled.View`
  margin-bottom: 10px;
  align-items: center;
  justify-content:center;
  width: ${constants.width};
`;
const Text = styled.Text``;

export default () => {
  const { loading, data, refetch } = useQuery(CHATS);
  const [refreshing, setRefreshing] = useState(false);
  const searchInput = useInput("");

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await refetch();
    } catch (e) {
      console.log(e);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSearch = async () => {

  }

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        paddingTop: 10,
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {loading ? (
        <Loader />
      ) : (
        <View>
          <InputView>
            <SearchBar  
              value={searchInput.value}
              onChange={searchInput.onChange}
              onSubmit={handleSearch} 
            />
          </InputView>

          {data &&
            data.seeChats &&
            data.seeChats.map((chat) => <Chat key={chat.id} {...chat} />)}
        </View>
      )}
    </ScrollView>
  );
};
