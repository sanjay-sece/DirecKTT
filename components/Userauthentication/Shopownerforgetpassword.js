import {
  View,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,

} from "react-native";
import React, { useState,useEffect} from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { COLORS } from "../../constants/Theme";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const Width = Dimensions.get("window").width;

const ShopownerForgetpassword = ({route}) => {
  const navigation = useNavigation();
  const [email, setemail] = useState();
  const [indicator, setindicator] = useState(false);
  const [otpindicator, setotpindicator] = useState(false);
  const [isSendBtnVisible, setisSendBtnVisible] = useState(true);
  const [otp, setotp] = useState(null);
  const [seconds, setSeconds] = useState(60);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (route && route.params) {
      setemail(route.params.email || '');
     
    }
  }, [route]);
  const startCountdown = () => {
    setSeconds(60);
    setRunning(true);
  };
  const stopCountdown = () => {
    setRunning(false);
  };
  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(updateCountdown, 1000);
    }
    return () => clearInterval(interval);
  }, [running]);
  const updateCountdown = () => {
    setSeconds(prevSeconds => {
      if (prevSeconds === 0) {
        stopCountdown();
        return 0;
      }
      return prevSeconds - 1;
    });
  };
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const sendemail = async () => {
    if (!email) {
      showToast("Fill the email field");
      return;
    }
    if (!validateEmail(email)) {
      showToast('Please enter a valid email address');
      return;
    }

    try {
      setindicator(true);
      const response = await axios.post(
        "https://direckt-copy1.onrender.com/auth/Shopownerforgetpassword",
        { email: email }
      );
      showToast("otp send succesfully to the email");
      setindicator(false);
      setisSendBtnVisible(!isSendBtnVisible);
      startCountdown();
    } catch (error) {
      setindicator(false);
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
        // Non-Axios error
       
        showToast("An error occurred. Please try again.");
      }
      
    }
  };

  const sendotp = async () => {
   
    if (!otp) {
      showToast("Fill the otp field");
      return;
    }
    if (!email) {
      showToast("Fill the email field");
      return;
    }
    try {
      setotpindicator(true);
      const response = await axios.post(
        "https://direckt-copy1.onrender.com/auth/Shopownerverifyotp",
        { otp: otp, email: email }
      );
      showToast("otp verified succesfully");
      setotpindicator(false);
      
      if (response.status === 200) {
        return navigation.navigate("Shopownerchangepassword", { email: email, token: response.data.token });
      }

    } catch (error) {
      setotpindicator(false);
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
    }
  };
  const showToast = (e) => {
    ToastAndroid.show(e, ToastAndroid.SHORT);
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View style={styles.box0}>
          <Text style={{ fontSize: 30, fontWeight: "600" }}>Enter Email</Text>
          <TextInput
            style={styles.box2input}
            placeholder="xyz@gmail.com"
            value={email}
            autoCapitalize="none"
            onChangeText={(val) => {
              setemail(val);
            }}
          />
          {isSendBtnVisible ? <TouchableOpacity
            underlayColor="white"
            onPress={() => {
              sendemail();
            }}
          >
            <View style={styles.box1opacity}>
              {indicator && <ActivityIndicator color={"white"} size={20} />}
              <Text
                style={{ color: "white", fontSize: 14, fontWeight: "bold" }}
              >
                Send OTP
              </Text>
            </View>
          </TouchableOpacity> : <View>
          <Text style={{ color: 'grey' }}>Otp Sent succesfully! check your mail box</Text>
          </View>}
        </View>

        <View style={styles.box1}>
          <Text style={styles.box1text}>
            Enter{" "}Verification{"\n"}OTP Code
          </Text>
        </View>
        <View style={styles.box2}>
          <TextInput
            style={styles.box2input}
            placeholder="4 Digit otp code"
            maxLength={4}
            keyboardType="number-pad"
            onChangeText={(val) => { setotp(val) }}
          />
          {running && <Text style={{ color: 'grey',marginTop:5, }}>Otp will be Invalid in {`${Math.floor(seconds / 60)}:${seconds % 60 < 10 ? '0' : ''}${seconds % 60}`}</Text>}
        </View>
        <View style={styles.box3}>
          <TouchableOpacity underlayColor="white" onPress={() => { sendotp() }}>
            <View style={styles.box3opacity}>
            {otpindicator && <ActivityIndicator color={"white"} size={20} />}
              <Text
                style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
              >
                Verify
              </Text>
            </View>
          </TouchableOpacity>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Text style={{ fontSize: 16 }}>Could not recieved code?</Text>
            <TouchableOpacity
              style={{ paddingTop: 0 }}
              onPress={() => {
                sendemail()
              }}
            >
              <Text style={{ color: COLORS.primary, fontSize: 16 }}>
                Resend
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ShopownerForgetpassword;
const styles = StyleSheet.create({
  box0: {
    flex: 3,
    gap: 20,
    paddingLeft: (Width * 13) / 100,
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  box1: {
    flex: 1,
    paddingLeft: (Width * 13) / 100,
    justifyContent: "flex-end",
  },
  box2: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  box3: {
    flex: 2,
    gap: 30,
    alignItems: "center",
  },
  box1text: {
    fontSize: 30,
    fontWeight: "600",
    lineHeight: 40,
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
    flexDirection:'row',
    justifyContent:'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 17,
    borderRadius: 5,
    alignItems: "center",
  },
  box1opacity: {
    width: (Width * 30) / 100,
    flexDirection:'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 17,
    borderRadius: 5,
    justifyContent:'center',
    alignItems: "center",
    gap:5,
  },
  box3signin: {
    color: "white",
    fontSize: 23,
  },
});
