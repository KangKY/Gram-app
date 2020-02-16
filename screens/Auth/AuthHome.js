import React from "react";
import styled from "styled-components";
import constants from "../../constants";
import AuthButton from "../../components/AuthButton";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Image = styled.Image`
  width:${constants.width / 2.5};
  margin-bottom:-20px;
`;

export default ({navigation}) => (
  <View>

    <Image resizeMode={"contain"} source={require("../../assets/instagram.png")}></Image>
    <AuthButton text={"로그인"} onPress={()=>navigation.navigate("Login")} />
    <AuthButton text={"회원가입"} onPress={()=>navigation.navigate("Signup")} />

  </View>
);
