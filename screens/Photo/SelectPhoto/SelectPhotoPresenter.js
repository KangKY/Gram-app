import React, { useState, useEffect } from "react";
import * as MediaLibrary from "expo-media-library";
import * as Permissions from "expo-permissions";
import styled from "styled-components";
import Loader from "../../../components/Loader";
import styles from "../../../styles";
import constants from "../../../constants";
import { Image, ScrollView, TouchableOpacity } from "react-native";

const View = styled.View`
  flex: 1;
`;

const Button = styled.TouchableOpacity`
  width: 100px;
  height: 30px;
  position: absolute;
  right: 5px;
  top: 15px;
  background-color: ${styles.blueColor};
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`;

const Text = styled.Text`
  color: white;
  font-weight: 600;
`;


// 추후 앱 요청하는 화면을 따로 만들던가, 시작할 때 요청
export default ({ selected, handleSelected,  }) => {
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  //const [selected, setSelected] = useState();
  const [allPhotos, setAllPhotos] = useState();

  const changeSelected = photo => {
    //setSelected(photo);
    handleSelected(photo);
  };

  const getPhotos = async () => {
    try {
      const { assets } = await MediaLibrary.getAssetsAsync({
        sortBy: [[MediaLibrary.SortBy.creationTime, false]]
      });
      const [firstPhoto] = assets;
      //setSelected(firstPhoto);

      handleSelected(firstPhoto);

      setAllPhotos(assets);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const askPermission = async () => {
    try {
      const permission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (permission.status === "granted") {
        setHasPermission(true);
        getPhotos();
      }
    } catch (e) {
      console.log(e);
      setHasPermission(false);
    }
  };

  useEffect(() => {
    askPermission();
  }, []);


  return (
    <View>
      {loading ? (
        <Loader />
      ) : (
        <View>
          {hasPermission ? (
            <>
            {selected && (
              <Image
                source={{ uri: selected.uri }}
                style={{ width: constants.width, height: constants.height / 2 }}
              />
            )}

              <ScrollView 
                contentContainerStyle={{
                  flexDirection:"row",
                  flexWrap: "wrap"
                }}>
                {allPhotos.map(photo => (
                  <TouchableOpacity
                    key={photo.id}
                    onPress={() => changeSelected(photo)}
                  >
                    <Image
                      source={{ uri: photo.uri }}
                      style={{
                        width: constants.width / 3,
                        height: constants.height / 6,
                        opacity: photo.id === selected.id? 0.5: 1
                      }}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          ) : null}
        </View>
      )}
    </View>
  );
};
