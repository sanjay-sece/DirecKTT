import React, { useState, useEffect } from "react";
import {
  View,
  Text,

  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { firebase } from "../customerhomepage/Createthread/Config";
import { MaterialIcons } from "@expo/vector-icons";
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
const Imagepicker = ({ editprofile, addphoto, setprofilepic,setphotos,profilepic}) => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [downloadurl, setdownloadurl] = useState();

  const uploadMedia = async () => {
    if (!image) {
      return;
    }
    try {
      const { uri } = await FileSystem.getInfoAsync(image);
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.onload = () => resolve(xhr.response);
        xhr.onerror = (e) => reject(new Error("Network request failed"));

        xhr.responseType = "blob";
        xhr.open("get", uri, true);
        xhr.send(null);
      });

      const filename = image.substring(image.lastIndexOf("/") + 1);
      const ref = firebase.storage().ref().child(filename);
      await ref.put(blob);
      const downloadURL = await ref.getDownloadURL();

      setdownloadurl(downloadURL);
      if(setprofilepic&&downloadURL){
      setprofilepic(downloadURL);
      }
     
      if(setphotos&&downloadURL){
      setphotos((prevPhotos) => [...prevPhotos, downloadURL]);
      }
      setUploading(false);
      // Alert.alert("Photo Uploaded");
      setImage(null);
    } catch (error) {
      setUploading(false);
     
    }
  };
  useEffect(() => {
    uploadMedia();
  }, [image]);
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 0.3,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setUploading(true);
      }
    } catch (error) {
      
    }
  };
  if (editprofile) {
    return (
      <View style={styles.container}>
        {!uploading && downloadurl && (
          <View>
            <Image
              style={styles.editprofileImage}
              source={{ uri: downloadurl }}
            />
          </View>
        )}
      {!uploading && !downloadurl && (

  profilepic ? (
    <Image
      style={styles.editprofileImage}
      source={{ uri: profilepic }}
    />
  ) : (
    <Image
      style={styles.editprofileImage}
      source={require("../../assets/shop.png")}
    />
  )
)}

        {uploading && <ActivityIndicator size="medium" color="#0000ff" />}
        <TouchableOpacity onPress={pickImage}>
          <Text style={styles.editprofileImagetitle}>Edit profile Image</Text>
        </TouchableOpacity>
      </View>
    );
  }
  if (addphoto) {
    return (
      <TouchableOpacity onPress={pickImage}>
        <View style={styles.addimagecard}>
          <MaterialIcons name="add-photo-alternate" size={24} color="grey" />
          {uploading && <ActivityIndicator size="medium" color="#0000ff" />}
        </View>
      </TouchableOpacity>
    );
  }
};

export default Imagepicker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  addimagecard: {
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    width: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "dotted",
    margin: 4,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: "grey",
  },
  editprofileImage: {
    height: (height * 15) / 100,
    width: (width * 32) / 100,
    borderRadius: (width * 30) / 100,
    borderWidth: 2,
  },
  editprofileImagetitle: {
    color: "blue",
    paddingVertical: 15,
  },
});