import React from "react";
import styled from "styled-components";
import AuthButton from "../../components/AuthButton";
import AuthInput from "../../components/AuthInput";
import constants from "../../constants";
import useInput from "../../hooks/useInput";

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
  const usernameInput = useInput("");
  const passwordInput = useInput("");

  return (
    <View>
      <Image
        resizeMode={"contain"}
        source={require("../../assets/instagram.png")}
      ></Image>
      <AuthInput
        {...emailInput}
        value=""
        placeholder="이메일"
        keyboardType="email-address"
      />
      <AuthInput
        {...usernameInput}
        value=""
        placeholder="이름"
        secureTextEntry={true}
      />
      <AuthInput
        {...passwordInput}
        value=""
        placeholder="비밀번호"
      />
      <AuthButton text={"회원가입"} onPress={() => null} />
    </View>
  );
};
