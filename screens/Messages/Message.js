import React, { useState, useMemo, useEffect, useRef } from "react";

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  FlatList,
  Button,
} from "react-native";

import gql from "graphql-tag";
import { useQuery, useMutation, useSubscription } from "react-apollo-hooks";
import withSuspense from "../../withSuspense";
import useInput from "../../hooks/useInput";
import { GET_USER } from "../../SharedQueries";
import { withNavigation } from "react-navigation";
import styled from "styled-components";
import constants from "../../constants";
import moment from "moment";
import "moment/locale/ko";
import Loader from "../../components/Loader";
import { Ionicons } from "@expo/vector-icons";

const SEE_CHAT = gql`
  query seeMessages($id: String!, $skip: Int) {
    seeMessages(id: $id, skip: $skip) {
      id
      text
      from {
        id
        itsMe
        avatar
        username
      }
      to {
        id
        itsMe
        avatar
        username
      }
      createdAt
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation sendMessage($message: String!, $chatId: String, $toId: String) {
    sendMessage(message: $message, chatId: $chatId, toId: $toId) {
      id
      chat {
        id
      }
      from {
        id
        itsMe
        avatar
        username
      }
      to {
        id
        itsMe
        avatar
        username
      }
      text
      createdAt
    }
  }
`;

const NEW_MESSAGE = gql`
  subscription newMessage($chatId: String!) {
    newMessage(chatId: $chatId) {
      id
      from {
        id
        avatar
        username
      }
      to {
        id
        avatar
        username
      }
      text
      createdAt
    }
  }
`;

const MeWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin: 5px 0px;
  width: ${constants.width};
`;

const ThemWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin: 5px 0px;
  width: ${constants.width};
`;

const Circle = styled.TouchableOpacity`
  height: 44px;
  width: 44px;
  border-radius: 22px;
`;
const CircleME = styled(Circle)`
  margin-right: 12px;
  margin-left: 7px;
`;

const CircleTHEM = styled(Circle)`
  margin-left: 12px;
  margin-right: 7px;
  /* margin: 0px 15px; */
`;

const TextMeWrapper = styled.View`
  max-width: 60%;
  min-width: 100px;
  padding: 10px 15px;
  min-height: 42px;
  background: #ebebeb;
  border-radius: 15px;
  flex-direction: column;
`;

const TextThemWrapper = styled.View`
  max-width: 60%;
  min-width: 100px;
  padding: 10px 15px;
  min-height: 42px;
  background: #fff;
  border: 1px solid #999;
  border-radius: 15px;
  flex-direction: column;
`;

const DateText = styled.Text`
  font-size: 14px;
  opacity: 0.7;
  text-align: center;
  margin: 15px 0px 10px;
  background-color: #c8c8c8;
  padding: 5px 0px;
  border-radius: 5px;
  width: 200px;
`;

const TimeText = styled.Text`
  font-size: 12px;
  opacity: 0.5;
  align-self: flex-end;
`;

function Message({ navigation }) {
  const messageInput = useInput("");
  const [canMore, setCanMore] = useState(true);
  const [chatId, setChatId] = useState(navigation.getParam("id"));
  const [sendMessageMutation] = useMutation(SEND_MESSAGE, {
    refetchQueries: () => [
      { query: GET_USER, variables: { id: navigation.getParam("userId") } },
    ],
  });

  const flatList = useRef();

  const { data, loading, error, fetchMore } = useQuery(SEE_CHAT, {
    fetchPolicy: "network-only",
    skip: navigation.getParam("id") === undefined,
    variables: {
      id: navigation.getParam("id"),
    },
    // suspend: navigation.getParam("id") === undefined
  });

  // console.log(`============data===========`);
  // console.log(oldMessages);

  const { data: newData } = useSubscription(NEW_MESSAGE, {
    skip: chatId === undefined,
    variables: {
      chatId,
    },
  });
  const [messages, setMessages] = useState([]);

  const handleNewMessage = () => {
    if (newData) {
      console.log(`============newData===========`);
     
      const { newMessage } = newData;
      console.log(newMessage);
      setMessages((previous) => [newMessage, ...previous]);
    }
  };
  useEffect(() => {
    handleNewMessage();
  }, [newData]);

  useEffect(() => {
    if (data && data.seeMessages) {
      setMessages(data.seeMessages);
      //setTimeout(() => flatList.current.scrollToEnd(), 1000)
    }
  }, [data]);

  const onSubmit = async () => {
    if (messageInput.value === "") {
      return;
    }
    try {
      const options =
        chatId === undefined
          ? {
              variables: {
                message: messageInput.value,
                toId: navigation.getParam("userId"),
              },
            }
          : {
              variables: {
                message: messageInput.value,
                chatId,
              },
            };

      const {
        data: { sendMessage },
      } = await sendMessageMutation(options);

      // console.log(`============sendMessage===========`);
      // console.log(sendMessage);

      if (sendMessage.id) {
        messageInput.setValue("");
        setChatId(sendMessage.chat.id);
        //setMessages(previous => [...previous, sendMessage]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onScroll = () => {
    if (canMore) {
      console.log("EndReached!!", messages.length);
      fetchMore({
        variables: {
          skip: messages.length,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          if (fetchMoreResult.seeMessages.length === 0) {
            setCanMore(false);
          }
          setMessages([...prev.seeMessages, ...fetchMoreResult.seeMessages]);

          return Object.assign({}, prev, {
            seeMessages: [...prev.seeMessages, ...fetchMoreResult.seeMessages],
          });
        },
      });
    }
  };

  if (error) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Error</Text>
      </View>
    );
  } else {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#fff" }}
        enabled
        keyboardVerticalOffset={80}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {loading ? (
          <Loader />
        ) : (
          <FlatList
            ref={flatList}
            data={messages}
            inverted={true}
            contentContainerStyle={{
              // flex:1,
              marginBottom:50,
              flexGrow: 1,
              justifyContent: "flex-end",
            }}
            onEndReached={onScroll}
            onEndReachedThreshold={1}
            keyExtractor={(item) => {
              return item.id;
            }}
            renderItem={(message) => {
              //console.log(message.index, message.item);
              const item = message.item;
              let showDate = false;
              let curDate, nextDate;

              if (message.index < messages.length ) {
                if(messages[message.index + 1] === undefined) {
                  curDate = moment(item.createdAt).format("YYYY년 MM월 DD일 (ddd)");
                  showDate = true;
                } else {
                  curDate = moment(item.createdAt).format("YYYY년 MM월 DD일 (ddd)");
                  nextDate = moment(messages[message.index + 1].createdAt).format("YYYY년 MM월 DD일 (ddd)");
  
                  if (curDate !== nextDate) {
                    showDate = true;
                  }
                }

              } else {
              }

              let inMessage = message.index % 2 === 0;
              if (inMessage) {
                return (
                  <View style={{ flex: 1, alignItems: "center" }}>
                    {showDate && <DateText>{curDate}</DateText>}
                    <MeWrapper key={item.id} style={{ marginBottom: 10 }}>
                      <TextMeWrapper>
                        <Text>{item.text} </Text>
                        <TimeText>
                          {moment(item.createdAt).format("A hh:mm")}
                        </TimeText>
                      </TextMeWrapper>
                      <CircleME
                        onPress={() =>
                          navigation.navigate("UserDetail", {
                            username: item.from.username,
                          })
                        }
                      >
                        <Image
                          source={{ uri: item.from.avatar }}
                          style={{ width: 45, height: 45, borderRadius: 22.5 }}
                        />
                      </CircleME>
                    </MeWrapper>
                  </View>
                );
              } else {
                return (
                  <View style={{ flex: 1, alignItems: "center" }}>
                    {showDate && <DateText>{curDate}</DateText>}
                    <ThemWrapper key={item.id} style={{ marginBottom: 10 }}>
                      <CircleTHEM
                        onPress={() =>
                          navigation.navigate("UserDetail", {
                            username: item.from.username,
                          })
                        }
                      >
                        <Image
                          source={{ uri: item.from.avatar }}
                          style={{ width: 45, height: 45, borderRadius: 22.5 }}
                        />
                      </CircleTHEM>
                      <TextThemWrapper>
                        <Text>{item.text}</Text>
                        <TimeText>
                          {moment(item.createdAt).format("A hh:mm")}
                        </TimeText>
                      </TextThemWrapper>
                    </ThemWrapper>
                  </View>
                );
              }
            }}
          />
        )}
        {/* <ScrollView
          horizontal={false}
          contentContainerStyle={{
            //flex: 1,
            flexGrow: 1,
            //height:100,
            overflow: "scroll",
            justifyContent: "flex-end",
          }}
        >
          <View style={{ flexDirection: "column" }}>
            {loading ? (
              <Loader />
            ) : (
              messages &&
              messages.map((m, i) =>
                i % 2 === 0 ? (
                  <MeWrapper key={m.id} style={{ marginBottom: 10 }}>
                    <TextMeWrapper>
                      <Text>{m.text}</Text>
                      <TimeText>
                        {moment(m.createdAt).format("A hh:mm")}
                      </TimeText>
                    </TextMeWrapper>
                    <CircleME
                      onPress={() =>
                        navigation.navigate("UserDetail", {
                          username: m.from.username,
                        })
                      }
                    >
                      <Image
                        source={{ uri: m.from.avatar }}
                        style={{ width: 45, height: 45 }}
                      />
                    </CircleME>
                  </MeWrapper>
                ) : (
                  <ThemWrapper key={m.id} style={{ marginBottom: 10 }}>
                    <CircleTHEM
                      onPress={() =>
                        navigation.navigate("UserDetail", {
                          username: m.from.username,
                        })
                      }
                    >
                      <Image
                        source={{ uri: m.from.avatar }}
                        style={{ width: 45, height: 45 }}
                      />
                    </CircleTHEM>
                    <TextThemWrapper>
                      <Text>{m.text}</Text>
                      <TimeText>{moment(m.createdAt).format("hh:mm")}</TimeText>
                    </TextThemWrapper>
                  </ThemWrapper>
                )
              )
            )}
          </View>
        </ScrollView> */}
        {/* <TextInput
          placeholder="메시지를 작성해주세요."
          style={{
            marginBottom: 10,
            width: "90%",
            alignSelf: "center",
            borderRadius: 10,
            paddingVertical: 10,
            paddingHorizontal: 10,
            backgroundColor: "#f2f2f2",
          }}
          returnKeyType="send"
          value={messageInput.value}
          onChangeText={messageInput.onChange}
          onSubmitEditing={onSubmit}
        /> */}

        <View style={styles.footer}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="메시지를 작성해주세요."
              underlineColorAndroid="transparent"
              style={styles.inputs}
              returnKeyType="send"
              value={messageInput.value}
              onChangeText={messageInput.onChange}
              onSubmitEditing={onSubmit}
            />
          </View>

          <TouchableOpacity style={styles.btnSend} onPress={onSubmit}>
            <Ionicons
              name={
                Platform.OS === "ios" ? "ios-paper-plane" : "md-paper-plane"
              }
              color={"#fff"}
              size={24}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    height: 60,
    alignItems: "center",
    backgroundColor: "#eeeeee",
    paddingHorizontal: 10,
  },
  btnSend: {
    backgroundColor: "#222222",
    width: 40,
    height: 40,
    borderRadius: 360,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    borderBottomColor: "#F5FCFF",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    borderBottomWidth: 1,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  inputs: {
    height: 40,
    marginLeft: 16,
    borderBottomColor: "#FFFFFF",
    flex: 1,
  },
});

export default withNavigation(Message);
