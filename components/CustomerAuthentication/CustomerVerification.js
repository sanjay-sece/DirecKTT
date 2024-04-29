import {
  View,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
  Alert,
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
const Height = Dimensions.get("window").height;

const CustomerVerification = ({ route }) => {
  const navigation = useNavigation();
  const [name, setname] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [otp, setotp] = useState(null);
  const [otpindicator, setotpindicator] = useState(false);
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(60);
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

  useEffect(() => {
    if (route.params) {
      setname(route.params.formData.name || '')
      setemail(route.params.formData.email || '');
      setpassword(route.params.formData.password || '');
    }
  }, [route.params]);
  const updateCountdown = () => {
    setSeconds(prevSeconds => {
      if (prevSeconds === 0) {
        stopCountdown();
        return 0;
      }
      return prevSeconds - 1;
    });
  };
  useEffect(() => {
    startCountdown();
  }, []);
  const handleVerification = async () => {
    if (!otp) {
      showToast("Enter Verification code");
      return;
    }
    try {
      setotpindicator(true);
      const response = await axios.post(
        "https://direckt-copy1.onrender.com/auth/verifycustomer",
        { email: email, name: name, password: password, otp: otp }
      );
      if (response.status === 200) {
        setotpindicator(false);
        setModalVisible(true);
      }
      else{
        setotpindicator(false);
        showToast("Error: "+ response.data.error);
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
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Feather name="check-circle" size={62} color="green" />
            <Text style={styles.modalText}>Account created Successfully</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setModalVisible(!modalVisible);
                navigation.navigate("Logincustomer", { email, password });
              }}>
              <Text style={styles.textStyle}>Login</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View style={{ alignItems: 'center', gap: 10, marginVertical: 10, }}>
        <Text style={styles.title}>Enter Verification Code</Text>
        <Text style={{ color: 'grey' }}>(check your email)</Text>
      </View>
      <TextInput
        style={styles.input}
        onChangeText={setotp}
        value={otp}
        placeholder="4 Digit otp code"
        maxLength={4}
        keyboardType="number-pad"
      />
      {running ? <Text style={{ color: 'grey' }}>Code will be Invalid in {`${Math.floor(seconds / 60)}:${seconds % 60 < 10 ? '0' : ''}${seconds % 60}`}</Text> : <Text style={{ color: 'grey' }}> OTP Expired! Signup again.</Text>}
      <TouchableOpacity style={styles.verifybutton} onPress={handleVerification}>
        {otpindicator && <ActivityIndicator color={"white"} size={20} />}
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  )
}

export default CustomerVerification

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  verifybutton: {
    flexDirection:'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
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
    justifyContent: 'space-evenly',
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
    paddingHorizontal: 20,
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
    paddingVertical: 15,
    textAlign: 'center',
  },
})