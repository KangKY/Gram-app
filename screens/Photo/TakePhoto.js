import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Text, TouchableOpacity, Platform } from "react-native";
import * as Permissions from "expo-permissions";
import { Camera } from "expo-camera";
import constants from "../../constants";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../styles";
import Loader from "../../components/Loader";
import * as MediaLibrary from "expo-media-library";

const View = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Icon = styled.View``;

const Button = styled.View`
  width: 80;
  height: 80;
  border-radius: 40px;
  border: 10px solid ${styles.lightGreyColor};
`;

export default ({ navigation }) => {
  const cameraRef = useRef();
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState();
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [canTakePhoto, setCanTakePhoto] = useState(true);

  const takePhoto = async () => {
    if (!canTakePhoto) {
      return;
    }
    try {
      setCanTakePhoto(false);
      const { uri } = await cameraRef.current.takePictureAsync({
        quality: 1
      });
      console.log(uri);
      const asset = await MediaLibrary.createAssetAsync(uri);
      setCanTakePhoto(true);
      navigation.navigate("Upload", { photo: asset });
    } catch (e) {
      console.log(e);
      setCanTakePhoto(true);
    }
  };
  
  const askPermission = async () => {
    try {
      const permission = await Permissions.askAsync(Permissions.CAMERA);
      if (permission.status === "granted") {
        setHasPermission(true);
      } else {
        setHasPermission(false);
      }
    } catch (e) {
      console.log(e);
      setHasPermission(false);
    } finally {
      setLoading(false);
    }
  };

  const changeType = () => {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  useEffect(() => {
    askPermission();
  }, []);

  if (hasPermission === null) {
    return <View> <Loader /></View>;
  } else {
    return (
      <View>
        {loading?(
          <Loader />
        ) : (
          hasPermission === true ? (
            <>
            <Camera
              ref={cameraRef}
              style={{
                alignItems:"flex-end",
                justifyContent: "flex-end",
                padding: 15,
                width: constants.width,
                height: constants.height / 2
              }}
              ratio={"1:1"}
              type={type}
            >

                {/* <TouchableOpacity
                  style={{
                    flex: 0.1,
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                  }}
                  onPress={changeType}>
                  <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Flip </Text>
                </TouchableOpacity> */}
                <TouchableOpacity onPress={changeType}>
                  <Icon>
                    <Ionicons
                      name={
                        Platform.OS === "ios"
                          ? "ios-reverse-camera"
                          : "md-reverse-camera"
                      }
                      size={32}
                      color={"white"}
                    />
                  </Icon>
                </TouchableOpacity>
            </Camera>
            <View>
              <TouchableOpacity onPress={takePhoto} disabled={!canTakePhoto}>
                <Button />
              </TouchableOpacity>
            </View>
            </>
          ) : (
            <Text>No access to camera</Text>
          )
        )}
        
      </View>
    );
  }
};
