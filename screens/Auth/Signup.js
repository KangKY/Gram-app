import React, { useState, useEffect } from "react";
import { Alert, TouchableWithoutFeedback, Keyboard } from "react-native";
import styled from "styled-components";
//import { Facebook } from 'expo';
import { useMutation } from "react-apollo-hooks";
import AuthButton from "../../components/AuthButton";
import AuthInput from "../../components/AuthInput";
import constants from "../../constants";
import useInput from "../../hooks/useInput";
import { CREATE_ACCOUNT } from "./AuthQueries";
import * as Facebook from 'expo-facebook';

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Image = styled.Image`
  width: ${constants.width / 2.5};
  margin-bottom: -20px;
`;

const FBContainer = styled.View`
  margin-top: 50px;
  padding-top: 25px;
  border-top-width: 1px;
  border-top-color: ${props => props.theme.lightGreyColor};
  border-style: solid;
`;

export default ({ navigation }) => {
  const emailInput = useInput(navigation.getParam("email", ""));
  const usernameInput = useInput("");
  const passwordInput = useInput("");
  const [loading, setLoading] = useState(false);
  const [createAccountMutation] = useMutation(CREATE_ACCOUNT, {
    variables: {
      email: emailInput.value,
      password: passwordInput.value,
      username: usernameInput.value
    }
  });

  const handleCreateAccount = async () => {
    const { value } = emailInput;
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (value === "") {
      return Alert.alert("이메일을 입력해주세요.");
    } else if (!emailRegex.test(value)) {
      return Alert.alert("잘못된 이메일 형식입니다.");
    } else if (usernameInput.value === "") {
      return Alert.alert("사용자 이름을 입력해주세요.");
    } else if (passwordInput.value === "") {
      return Alert.alert("비밀번호를 입력해주세요.");
    }

    try {
      setLoading(true);
      const {
        data: { createAccount }
      } = await createAccountMutation();
      if (createAccount) {
        navigation.navigate("Login", { email: value });
      }
    } catch (e) {
      //console.log(e);
      if (e.message.includes("already")) {
        Alert.alert("회원가입 실패", "이메일 또는 사용자 이름이 존재합니다.");
        navigation.navigate("Login", { email: value });
      } else {
        Alert.alert("회원가입 실패", "오류가 발생하였습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  const FBLogin = async () => {
    try {
      setLoading(true);
      
      const {
        type,
        token
      } = await Facebook.logInWithReadPermissionsAsync('191348122101549', {
        permissions: ['public_profile', 'email'],
      });
      
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        const response = await fetch(`https://graph.facebook.com/me?fields=id,email,name&access_token=${token}`);

        const { email, name } = await response.json();
        //console.log(data);

        emailInput.setValue(email);
        usernameInput.setValue(name);

        setLoading(false);
      } else {
        // type === 'cancel'
      }

    } catch ({ message }) {
      console.log(message);
      alert(`Facebook Login Error: ${message}`);
      //setLoading(true);
    }
  }

  useEffect(() => {
    Facebook.initializeAsync("191348122101549");
  },[])

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <Image
            resizeMode={"contain"}
            source={require("../../assets/instagram.png")}
          ></Image>
          <AuthInput
            {...emailInput}
            placeholder="이메일"
            keyboardType="email-address"
            onSubmitEditing={handleCreateAccount}
          />
          <AuthInput
            {...usernameInput}
            placeholder="이름"
            onSubmitEditing={handleCreateAccount}
          />
          <AuthInput
            {...passwordInput}
            placeholder="비밀번호"
            secureTextEntry={true}
            autoCorrect={false}
            onSubmitEditing={handleCreateAccount}
          />
          <AuthButton
            loading={loading}
            text={"회원가입"}
            onPress={handleCreateAccount}
          />
          <FBContainer>
            <AuthButton
              loading={false}
              onPress={FBLogin}
              bgColor={"#2D4DA7"}
              text={"페이스북으로 로그인"}
            />
          </FBContainer>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
};
