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
import AsyncStorage from "@react-native-async-storage/async-storage";

const Width = Dimensions.get("window").width;
const Height = Dimensions.get("window").height;

const ReportShop = ({ route }) => {
  const navigation = useNavigation();
  const [customerid, setcustomerid] = useState('customer');
  const [shopname, setShopname] = useState('');
  const [shopownerid, setshopownerid] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [reportmsg, setreportmsg] = useState(null);
  const [reportindicator, setreportindicator] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await AsyncStorage.getItem("customerdata");
    
        if (data) {
          const parsedData = JSON.parse(data);
     
          setcustomerid(parsedData._id);
        }

      } catch (err) {
       
      }
    };
  
    fetchData();
  }, []); // Ensure to include necessary dependencies if any
  useEffect(() => {
  if (route.params) {
    setShopname(route.params.shopname || '');
    setshopownerid(route.params.shopownerid || '');
  }
}, [route.params]); 

  const handlereport = async () => {
    if (!reportmsg) {
      showToast("Type your reason for the report");
      return;
    }
    try {
      setreportindicator(true);
   
      const response = await axios.post(
        "https://direckt-copy1.onrender.com/auth/reportShopOwner",
        { customerId: customerid, shopOwnerId:shopownerid, reason:reportmsg}
      );
   
      if (response.status === 200) {
        setreportindicator(false);
        setModalVisible(true);
      }
      else {
        setreportindicator(false);
        showToast( response.data.error);
      }

    } catch (error) {
      setreportindicator(false);
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
            <Text style={styles.modalText}>Report Submitted Successfully</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setModalVisible(!modalVisible);
                navigation.goBack();
              }}>
              <Text style={styles.textStyle}>Login</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View style={{ alignItems: 'center', gap: 10, marginVertical: 10, }}>
        <Text style={styles.title} numberOfLines={1}>Report {shopname}</Text>
        <Text style={{ color: 'grey' }}>(Describe your reason as clearly as possible)</Text>
      </View>
      <TextInput
        style={styles.input}
        onChangeText={setreportmsg}
        value={reportmsg}
        placeholder="describe your reason"
      />
      <TouchableOpacity style={styles.verifybutton} onPress={handlereport}>
        <Text style={styles.buttonText}>Submit</Text>
        {reportindicator && <ActivityIndicator color={"white"} size={20} />}
      </TouchableOpacity>
    </View>
  )
}

export default ReportShop

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
    height: 80,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  verifybutton: {
    flexDirection: 'row',
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