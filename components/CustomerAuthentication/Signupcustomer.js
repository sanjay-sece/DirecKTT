import {
  View,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  Modal,
  Pressable
} from "react-native";
import React, { useState,useEffect } from "react";
import { SafeAreaView, StyleSheet, Alert } from "react-native";
import { COLORS } from "../../constants/Theme";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
const Width = Dimensions.get("window").width;

const Signupcustomer = ({route}) => {

  const navigation = useNavigation();
  const [name, setname] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (route.params) {
      setemail(route.params.email || '');
      setpassword(route.params.password || '');
    }
  }, [route.params]);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((e) => !e);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Password should be greater than or equal to 8 characters long
    return password.length >= 8;
};


  const handleRegister = async () => {
    if (!name || !email || !password) {
      showToast('Please fill in all fields');
      return;
    }
    if (!validateEmail(email)) {
      showToast('Please enter a valid email address');
      return;
    }

    if (!validatePassword(password)) {
      showToast(' Password should be between 8 and 15 characters long');
      return;
    }

    try {
      setLoading(true); // Set loading to true when the request starts

      const formData = {
        name,
        email,
        password,
      };

      const response = await axios.post('https://direckt-copy1.onrender.com/auth/registercus', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { success } = response.data;

      if (success) {
        // Alert.alert('Success', 'Account created successfully');
        showToast("Verification code sent successfully!");
        setLoading(false);
        navigation.navigate("CustomerVerification",{formData});
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
      setLoading(false); // Set loading to false when the request completes (success or error)
    }
  };
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
          <TextInput style={styles.box2input} placeholder="Name" value={name}  autoCapitalize="none"
            onChangeText={(text) => setname(text)} />
          <TextInput style={styles.box2input} placeholder="Email" value={email}
            onChangeText={(text) => setemail(text)} />
          <TextInput style={styles.box2input} placeholder="Password" maxLength={15} value={password} secureTextEntry={!isPasswordVisible}  autoCapitalize="none"
            onChangeText={(text) => setpassword(text)} />
          <TouchableOpacity onPress={togglePasswordVisibility} >
            <Text style={{ color: "grey" }} >{isPasswordVisible ? <FontAwesome name="eye-slash" size={13} color="grey" /> : <FontAwesome name="eye" size={13} color="grey" />} {isPasswordVisible ? 'Hide Password' : 'Show Password'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.box3}>
          <TouchableOpacity underlayColor="white" onPress={handleRegister}>
            {loading && (
              <View style={styles.activityIndicatorContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
              </View>
            )}
            <View style={styles.box3opacity}>
              <Text
                style={{ color: "white", fontSize: 18, fontWeight: "medium" }}
              >
              Verify Email
              </Text>
            </View>
          </TouchableOpacity>
          <View style={{ flexDirection: "row", gap: 10, alignItems: 'center' }}>
            <Text style={{ fontSize: 16 }}>Already have an account? </Text>
            <TouchableOpacity
              style={{ padding: 2 }}
              onPress={(e) => {
                navigation.navigate("Logincustomer",{email,password});
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

export default Signupcustomer;
const styles = StyleSheet.create({
  box1: {
    flex: 3,
    paddingLeft: (Width * 13) / 100,
    justifyContent: "flex-end",
  },
  box2: {
    flex: 3,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  box3: {
    flex: 3,
    gap: 30,
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
  box3signin: {
    color: "white",
    fontSize: 23,
  },
});
