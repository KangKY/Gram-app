import React, { useState } from "react";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import styled from "styled-components";
import AuthButton from "../../components/AuthButton";
import AuthInput from "../../components/AuthInput";
import constants from "../../constants";
import useInput from "../../hooks/useInput";
import { Alert } from "react-native";
import { LOG_IN } from "./AuthQueries";
import { useMutation } from "react-apollo-hooks";
import { useLogIn } from "../../AuthContext";
import { ME } from "../Profile";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Image = styled.Image`
  width: ${constants.width / 2.5};
  margin-bottom: -20px;
`;

export default ({ navigation }) => {
  const emailInput = useInput(navigation.getParam("email",""));
  const passwordInput = useInput("");
  const logIn = useLogIn();
  const [loading, setLoading] = useState(false);
  const [requestLoginMutation] = useMutation(LOG_IN, {
    variables: {
      email: emailInput.value,
      password: passwordInput.value,
    }
  });

  const handleLogin = async () => {
    const { value } = emailInput;
    
    
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (value === "") {
      return Alert.alert("이메일을 입력해주세요.");
    } else if (!emailRegex.test(value)) {
      return Alert.alert("잘못된 이메일 형식입니다.");
    } else if (value === "") {
      return Alert.alert("이메일을 입력해주세요.");
    }  else if (passwordInput.value === "") {
      return Alert.alert("비밀번호를 입력해주세요.");
    }

    try {
      setLoading(true);
      const { data : { requestLogin } } =  await requestLoginMutation();
      if(requestLogin) {
        logIn(requestLogin)
        //navigation.navigate("Home", { email:value });
      }
      else {
        Alert.alert("해당 계정이 존재하지 않습니다.");
        navigation.navigate("Signup");
      }
    } catch (e) {
      console.log(e);
      if(e.message.indexOf("wrong") !== -1) {
        Alert.alert("비밀번호가 틀렸습니다.");
      }
      else if(e.message.indexOf("exist") !== -1) {
        Alert.alert("해당 계정이 존재하지 않습니다.");
        navigation.navigate("Signup");
      } else {
        Alert.alert("로그인에 실패하였습니다.");
      }
    
    } finally {
      setLoading(false);
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
          onSubmitEditing={handleLogin}
        />
        <AuthInput
          value=""
          {...passwordInput}
          placeholder="비밀번호"
          secureTextEntry={true}
          returnKeyType="send"
          onSubmitEditing={handleLogin}
        />
        <AuthButton loading={loading} text="로그인" onPress={handleLogin} />
      </View>
    </TouchableWithoutFeedback>
  );
};
