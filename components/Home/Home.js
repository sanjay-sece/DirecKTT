
import {
  SafeAreaView,
  StyleSheet,
  Text,

  View,

  Image,

  TouchableOpacity,
  Dimensions,
  BackHandler,
  ImageBackground
} from "react-native";

import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
const Width = Dimensions.get("window").width;

export default function Home() {

  const navigation = useNavigation();
  const route = useRoute();



  useFocusEffect(
    React.useCallback(() => {
      const handleBackPress = () => {
        if (route.name === "Home") {
          BackHandler.exitApp();
          return true; // Prevent going back to the previous page
        }
        return false; // Allow the default back action on other screens
      };

      const backHandler = BackHandler.addEventListener("hardwareBackPress", handleBackPress);

      return () => {
        backHandler.remove();
      };
    }, [route.name])
  );
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground style={styles.container}
         source={require('../../components/Home/man-stands-front-store.jpeg')}
      >
        <View style={styles.box1}>

          <View style={{ flex: 10, justifyContent: "flex-start", }}>
            <ImageBackground
              style={{ height: "100%", resizeMode: 'cover', width: Width, opacity: 1 }}
              blurRadius={1}
            >
              <Image
                source={require('../../components/Home/1-removebg-preview.png')}
                style={{height:150,width:150,padding:90}}
              />
            </ImageBackground>
          </View>
        </View>

        <View style={styles.box4}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <Text style={{ fontSize: 30, color: "white", fontWeight: "bold",textShadowColor: 'rgba(0, 0, 0, 0.75)',textShadowOffset: {width: -1, height: 1},textShadowRadius: 10,shadowOpacity:  0.17 }}>
              Get Started
            </Text>
            <Text style={{ color: "white",textShadowColor: 'rgba(0, 0, 0, 0.75)',textShadowOffset: {width: -1, height: 1},textShadowRadius: 10,shadowOpacity:  0.17  }}>Choose one?</Text>
          </View>
          <View style={{ flex: 2 }}>
            <TouchableOpacity
              underlayColor="white"
              onPress={(e) => {
                navigation.navigate("Logincustomer");
              }}
            >
              <View style={styles.cusbutton}>
                <Text style={styles.cusbuttonText}>I am a Customer</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              underlayColor="white"
              onPress={(e) => {
                navigation.navigate("Userlogin");
              }}
            >
              <View style={styles.ownbutton}>
                <Text style={styles.ownbuttonText}>I am a Shop Owner</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%", resizeMode: 'cover', width: Width, opacity: 0.9,
    backgroundColor:'black',
    elevation:2,
  },
  box1: {
    flex: 5,
    alignItems: "center",
  },
  box4: {
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginTop: -10,
    opacity:0.9
  },
  cusbutton: {
    marginBottom: 30,
    width: 260,
    alignItems: "center",
    backgroundColor: "#8A57E4",
    borderRadius: 20,
  },
  ownbutton: {
    marginBottom: 30,
    width: 260,
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#8A57E4",
  },
  cusbuttonText: {
    textAlign: "center",
    padding: 20,
    color: "white",
  },
  ownbuttonText: {
    textAlign: "center",
    padding: 20,
    color: "white",
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10 
  },
  box1text: {
    fontSize: 45,
    fontWeight: "bold",
    color: "#8A57E4",
  },
  box1imag: {
    height: "50%",
    width: "80%",
  },
});
