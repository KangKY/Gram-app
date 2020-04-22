import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { Image, ActivityIndicator, Alert, Modal, TouchableOpacity, TextInput } from "react-native";
import { gql } from "apollo-boost";
import useInput from "../../hooks/useInput";
import styles from "../../styles";
import { useMutation } from "react-apollo-hooks";
import { FEED_QUERY } from "../Home";
import constants from "../../constants";
import { ME } from "../Profile";

const UPLOAD = gql`
  mutation upload($caption: String!, $files: [String!]!, $location: String, $tags:[String!]) {
    upload(caption: $caption, files: $files, location: $location, tags: $tags) {
      id
      caption
      location
    }
  }
`;

const View = styled.View`
  /* flex: 1; */
`;

const Container = styled.View`
  padding: 20px;

`;

const Form = styled.View`
  justify-content: flex-start;
`;

const EditorWrapper = styled.View`
  flex-direction: row;
  margin-bottom:10px;
  align-items:flex-start;
`;

const CaptionInput = styled.TextInput`
  margin-bottom: 10px;
  border: 0px solid ${styles.lightGreyColor};
  border-bottom-width: 1px;
  padding-bottom: 10px;
  flex:1;
  min-height:80px;
`;

const STextInput = styled.TextInput`
  margin-bottom: 10px;
  border: 0px solid ${styles.lightGreyColor};
  border-bottom-width: 1px;
  padding-bottom: 10px;
  /* width: ${constants.width - 20}; */
`;

const Button = styled.TouchableOpacity`
  background-color: ${props => props.theme.blueColor};
  padding: 10px;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
`;

const Text = styled.Text`
  font-weight: 600;
`;

const TagList = styled.View`
  background-color:#fff;
  /* position:absolute; */
  width:200px;
  align-items:center;
  justify-content:center;
  height:400px;
`;

const Tags = styled.View`
  flex-direction:row;
  flex-wrap:wrap;
  margin-top:20px;
  margin-bottom:10px;
`;

const Tag = styled.TouchableOpacity`
  border-radius:16px;
  height:30px;
  margin:4px;
  padding:5px 10px;
  background-color:${props => props.theme.blueColor};
  border:1px solid ${props => props.theme.blueColor};
`;

const TagLabel = styled.Text`
 color:#fff;
`;

export default ({ navigation }) => {
  const [loading, setIsLoading] = useState(false);
  const photo = navigation.getParam("photo");
  const captionInput = useInput("");
  const locationInput = useInput("");

  const [isHashed, setIsHashed] = useState(false);

  const test = ["sdflklasfjksf",'ㄱㄱㄱㄱㄱ', 'ㄱㄱㄱㄱㄱㄱㄱㄱㄱㄱ']
  const [tagText, setTagText] = useState("");
  const [tags, setTags] = useState(test);
  
  
  const [uploadMutation] = useMutation(UPLOAD, {
    refetchQueries: () => [ { query: FEED_QUERY }, { query: ME } ]
  });

  const onChangeTextForTAG = (text) => {
    if(text.includes("#")) {
      setIsHashed(true);
    } else {
      setIsHashed(false);
    }
    
    if(isHashed && text.length === 0) {
      setTags(tags.slice(0, -1));
      setTagText(tags.slice(-1)[0] || "");
    } 
    else if(
      isHashed && 
      text.length > 1 &&
      text !== "\n" &&
      [',','.'," "].includes(text.slice(-1)) &&
      !(tags.indexOf(tagText.slice(0, -1).trim()) > -1)
    ) {
      handleAddTag(text.slice(0, -1));
    }
    else {
      setTagText(text);
    }
    // const regex = /#[A-Za-z0-9ㄱ-ㅎ가-힣\-\.\_]+/g;
    
    // if(regex.test(text)) {
    //   setIsHashed(true);
    // }
  }

  const handleAddTag = text => {
    setTags(p => [...p, text.trim()]);
    setTagText("");
  }

  const handleSubmitForTAG = () => {
    handleAddTag(tagText);
  };

  const handleDeteleForTag = index => {
    const _data = [...tags];
    _data.splice(index, 1);
    setTags(_data);
  }




  const handleSubmit = async () => {
    if (captionInput.value === "") {
      Alert.alert("게시물 내용을 입력해주세요.");
      return;
    }

    const formData = new FormData();
    const name = photo.filename;
    const [, type] = name.split(".");
    formData.append("post", {
      name,
      type:"image/jpeg",
      uri: photo.uri
    });

    console.log(formData);
    try {
      setIsLoading(true);
      const {
        data: { location }
      } = await axios.post("http://192.168.0.143:4000/api/post/upload", formData, {
        headers: {
          "content-type": "multipart/form-data"
        }
      });

      console.log(location);

      const {
        data: { upload }
      } = await uploadMutation({
        variables: {
          files: [location],
          caption: captionInput.value,
          location: locationInput.value,
          tags
        }
      });

      console.log(upload);

      if (upload.id) {
        navigation.navigate("TabNavigation");
      }
    } catch(e) {
      console.log(e);
      Alert.alert("Cant upload", "Try later");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View>
      <Container>
        <EditorWrapper>
          <Image
            source={{ uri: photo.uri }}
            style={{ height: 80, width: 80, marginRight: 30 }}
          />
           <CaptionInput
            onChangeText={captionInput.onChange}
            value={captionInput.value}
            placeholder="게시물 내용"
            multiline={true}
            placeholderTextColor={styles.darkGreyColor}
          />
        </EditorWrapper>
        
        <Form>
         
          <STextInput
            onChangeText={locationInput.onChange}
            value={locationInput.value}
            placeholder="위치"
            multiline={true}
            placeholderTextColor={styles.darkGreyColor}
          />
          <Tags>
            {tags.length > 0 && tags.map((tag, i) => (
              <Tag key={`${tag}${i}`} onPress={() => handleDeteleForTag(i)}>
               <TagLabel>{tag}</TagLabel>
             </Tag>
            ))}
          </Tags>
          <STextInput
            onChangeText={onChangeTextForTAG}
            value={tagText}
            placeholder="태그"
            multiline={false}
            onSubmitEditing={handleSubmitForTAG}
            placeholderTextColor={styles.darkGreyColor}
          />
          
          
          <Button onPress={handleSubmit}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{color:"#fff"}}>업로드</Text>
            )}
          </Button>
        </Form>
      </Container>

        {/* {isHashed &&     
          <TagList
            animationType="slide"
            transparent={false}
            visible={isHashed}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
          <View style={{ marginTop: 22 }}>
            <View>
              <Text>Hello World!</Text>

              <TouchableOpacity
                onPress={() => {
                  setIsHashed(!isHashed);
                }}>
                <Text>Hide Modal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TagList>
        } */}
    </View>
  );
}