import React, { useState } from "react";
import styled from "styled-components";
import AuthButton from "../../components/AuthButton";
import AuthInput from "../../components/AuthInput";
import constants from "../../constants";
import useInput from "../../hooks/useInput";
import { CREATE_ACCOUNT } from "./AuthQueries";
import { useMutation } from "react-apollo-hooks";
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

export default ({navigation}) => {
  const emailInput = useInput(navigation.getParam("email",""));
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
        navigation.navigate("Login", {email:value});
      }
    } catch (e) {
      //console.log(e);
      if(e.message.includes("already")) {
        Alert.alert("회원가입 실패","이메일 또는 사용자 이름이 존재합니다.");
        navigation.navigate("Login", {email:value});
      } else {
        Alert.alert("회원가입 실패","오류가 발생하였습니다.");
      }
      
    } finally {
      setLoading(false);
    }
  };

  return (
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
    </View>
  );
};
