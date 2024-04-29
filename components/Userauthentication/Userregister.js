import {
  View,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ToastAndroid,
  Modal,
  Pressable
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { COLORS } from "../../constants/Theme";
import { useNavigation } from "@react-navigation/native";

import { FontAwesome, Feather } from '@expo/vector-icons';
import axios from "axios";
const Width = Dimensions.get("window").width;

const Userregister = ({route}) => {
  const navigation = useNavigation();
  const [businessname, setbuinessname] = useState('');
  const [phonenumber, setphonenumber] = useState(null);
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('')
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);


  useEffect(() => {
    if (route && route.params) {
      setemail(route.params.email || '');
      setpassword(route.params.password || '');
    }
  }, [route]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Password should be greater than or equal to 8 characters long
    return password.length >= 8;
};



  const validatePhone = (phone) => {
    const phoneNumberRegex = /^\d{10}$/;
    return phoneNumberRegex.test(phone);
  }

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((e) => !e);
  };

  const handleRegister = async () => {
    if (!businessname || !email || !password || !phonenumber) {
      showToast('Please fill in all fields');
      return;
    }
    if (!businessname) {
      showToast('Please enter your business name !');
      return;
    }
    if (!phonenumber) {
      showToast('Please enter your phone number!')
      return;
    }
    if (!validatePhone(phonenumber)) {
      showToast('Please enter a valid phone number');
      return;
    }
    if (!email) {
      showToast('Please enter your email!');
      return;
    }

    if (!validateEmail(email)) {
      showToast('Please enter a valid email address');
      return;
    }
    if (!password) {
      showToast('Please enter your password!');
      return;
    }
    if (!validatePassword(password)) {
      showToast(' Password should be between 8 to 15 characters long');
      return;
    }

    try {
      setLoading(true); // Set loading to true when the request starts

      const formdata = {
        businessname: businessname,
        phonenumber: phonenumber,
        email: email,
        password: password
      }
      const response = await axios.post('https://direckt-copy1.onrender.com/auth/register', formdata, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { success } = response.data;

      if (success) {
        showToast("Verification code sent successfully!");
        setLoading(true);
        setbuinessname(null)
        setemail(null)
        setphonenumber(null)
        setpassword(null)
        navigation.navigate("UserVerification",{formdata});
      } else {
        showToast('Error', 'Email is already used. Try again');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Axios-related error
        if (error.response) {
       
          showToast(`Error: ${error.response.data.error}`);
        } else {
          // Network error (no response received)
          showToast("Network error. Please check your internet connection.");
        }
      } else {
   
        showToast("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }


  }
  const showToast = (e) => {
    ToastAndroid.show(e, ToastAndroid.SHORT);
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View style={styles.box1}>
          <Text style={styles.box1text}>Create Your{"\n"}Account</Text>
        </View>
        <View style={styles.box2}>

          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <TextInput style={styles.box2input} placeholder="BusinessName" value={businessname} onChangeText={(val) => setbuinessname(val)}   autoCapitalize="none" />
            <TextInput style={styles.box2input} placeholder="Phonenumber" value={phonenumber} maxLength={10} onChangeText={(val) => setphonenumber(val)} keyboardType="numeric" />
            <TextInput style={styles.box2input} placeholder="Email" value={email} onChangeText={(val) => setemail(val)}  autoCapitalize="none" />
            <TextInput style={styles.box2input} placeholder="password" maxLength={15} value={password} onChangeText={(val) => setpassword(val)}  autoCapitalize="none" secureTextEntry={!isPasswordVisible}/>
            <TouchableOpacity onPress={togglePasswordVisibility} >
              <Text style={{ color: "grey" }} >{isPasswordVisible ? <FontAwesome name="eye-slash" size={13} color="grey" /> : <FontAwesome name="eye" size={13} color="grey" />} {isPasswordVisible ? 'Hide Password' : 'Show Password'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              underlayColor="white"
              onPress={handleRegister}
            >
              {loading && (
                <View style={styles.activityIndicatorContainer}>
                  <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
              )}
              <View style={styles.box3opacity}>
                <Text
                  style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
                >
                  Verify Email
                </Text>
              </View>
            </TouchableOpacity>
          </View>

        </View>
        <View style={styles.box3}>

          <View style={{ flexDirection: "row", gap: 10, alignItems:'center' }}>
            <Text style={{ fontSize: 16 }}>Already have an account? </Text>
            <TouchableOpacity
              style={{ paddingTop: 0 }}
              onPress={(e) => {
                navigation.navigate("Userlogin",{email,password});
              }}
            >
              <Text style={{ color: COLORS.primary, fontSize: 16 }}>Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Userregister;
const styles = StyleSheet.create({
  box1: {
    flex: 2,
    paddingLeft: (Width * 13) / 100,
    justifyContent: "flex-end",
  },
  box2: {
    flex: 4,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  box3: {
    flex: 1,
    gap: 10,
    alignItems: "center",
  },
  box1text: {
    fontSize: 50,
    fontWeight: "600",
    lineHeight: 50,
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
  box3opacity: {
    width: (Width * 75) / 100,
    backgroundColor: COLORS.primary,
    paddingVertical: 17,
    borderRadius: 5,
    alignItems: "center",
  },
  box3opacity2: {
    width: (Width * 30) / 100,
    backgroundColor: COLORS.primary,
    paddingVertical: 17,
    borderRadius: 5,
    alignItems: "center",
  },
  box3signin: {
    color: "white",
    fontSize: 23,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    justifyContent:'space-evenly',
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 5,
    padding: 10,
    paddingHorizontal:20,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: COLORS.primary,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'medium',
    textAlign: 'center',
  },
  modalText: {
    paddingVertical:15,
    textAlign: 'center',
  },
});
