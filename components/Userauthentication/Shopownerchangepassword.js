import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ToastAndroid, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { COLORS } from '../../constants/Theme';
import { TextInput } from 'react-native-gesture-handler';
const Width = Dimensions.get("window").width;

const Shopownerpassword = ({route}) => {
    const email = route.params?.email;
    const token = route.params?.token;
    const navigation = useNavigation();
    const [indicator, setindicator] = useState(false);
  const [newPassword, setnewPassword] = useState();
  const validatePassword = (password) => {
    // Password should be greater than or equal to 8 characters long
    return password.length >= 8;
};

  const sendnewPassword =async()=>{
  
    if (!validatePassword(newPassword)) {
      showToast('Password should be between 8 and 15 characters');
      return;
    } 
   else{
    try{
      setindicator(true)
      const response = await axios.post('https://direckt-copy1.onrender.com/auth/Shopownerupdatepassword'
      ,{email:email,newPassword:newPassword,token:token} 
      )
      setindicator(false)
      if(response.status===200){
        showToast('password changed successfully')
      }
      const password = newPassword;
      return navigation.navigate('Userlogin',{email,password})
    }
    catch(error){
      setindicator(false)
      if (axios.isAxiosError(error)) {
        // Axios-related error
        if (error.response) {
          // Response received with an error status code
          showToast(`Error: ${error.response.data.error}`);
        } else {
          // Network error (no response received)
          showToast("Network error. Please check your internet connection.");
        }
      } else {
       
        showToast("An error occurred. Please try again.");
      }
      navigation.goBack()
      return;
    }
   }
  }
   const showToast = (e) => {
    ToastAndroid.show(e, ToastAndroid.SHORT);
  };
  return (
  
     <View style={styles.box0}>
          <Text style={{ fontSize: 30, fontWeight: "600" }}>Enter New password</Text>
          <TextInput
          maxLength={15}
            style={styles.box2input}
            placeholder="password"
            value={newPassword}
            onChangeText={(val) => {
              setnewPassword(val);
            }}
            autoCapitalize="none"
          />
          <TouchableOpacity
            underlayColor="white"
            onPress={() => {
              sendnewPassword()
            }}
          >
            <View style={styles.box1opacity}>
            {indicator && <ActivityIndicator color={"white"} size={20} />}
              <Text
                style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
              >
               Submit
              </Text>
            </View>
          </TouchableOpacity>
          <View style={{paddingRight:20}}>
            <Text style={{color:'grey',fontSize:15}}>Don't go back from this page. Enter the password and submit.This page only available for 5 minutes</Text>
          </View>
        </View>
    
  )
}

export default Shopownerpassword
const styles = StyleSheet.create({
    box0: {
      flex: 1,
      gap: 20,
      paddingLeft: (Width * 13) / 100,
      justifyContent: "center",
      marginBottom: 20,
    },
  
    box2input: {
      borderColor: "grey",
      borderWidth: 1,
      width: (Width * 75) / 100,
      height: 50,
      borderRadius: 5,
      paddingLeft: 10,
      fontSize: 18,
    },

    box1opacity: {
      flexDirection:'row',
      width: (Width * 25) / 100,
      backgroundColor: COLORS.primary,
      paddingVertical: 17,
      borderRadius: 5,
      alignItems: "center",
      justifyContent:'center',
      gap:5,
    },
   
  });
  