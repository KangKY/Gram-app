import React from "react";
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import styled from "styled-components";
import AuthButton from "../../components/AuthButton";
import AuthInput from "../../components/AuthInput";
import constants from "../../constants";
import useInput from "../../hooks/useInput";
import { Alert } from "react-native";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Image = styled.Image`
  width: ${constants.width / 2.5};
  margin-bottom: -20px;
`;

export default () => {
  const emailInput = useInput("");
  const passwordInput = useInput("");

  const handleLogin = () => {
    const { value } = emailInput;
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(value === "") {
      return Alert.alert("이메일을 입력해주세요.");
    } else if(!emailRegex.test(value)) {
      return Alert.alert("잘못된 이메일 형식입니다.");
    } else if(value === "") {
      return Alert.alert("이메일을 입력해주세요.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        <Image
          resizeMode={"contain"}
          source={require("../../assets/instagram.png")}
        ></Image>
        <AuthInput
          value=""
          {...emailInput}
          placeholder="이메일"
          keyboardType="email-address"
          returnKeyType="send"
          autoCorrect={false}
          onEndEditing={handleLogin}
        />
        <AuthInput
          value=""
          {...passwordInput}
          placeholder="비밀번호"
          secureTextEntry={true}
          returnKeyType="send"
          onEndEditing={handleLogin}
        />
        <AuthButton text="로그인" onPress={handleLogin} />
      </View>
    </TouchableWithoutFeedback>
    
  );
};
