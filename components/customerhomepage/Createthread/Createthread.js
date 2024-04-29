import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,

  Platform,

  Image,
  ActivityIndicator,
  ToastAndroid,
  Modal,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as SecureStore from "expo-secure-store";
import { SelectList } from "react-native-dropdown-select-list";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign, Feather } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import Imagepick from "./Imagepick";
import { COLORS } from "../../../constants/Theme";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uploadMedia from "./UploadImage";
import { useSelector } from "react-redux";

const Width = Dimensions.get("window").width;

const Createthread = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [jobtitle, setjobtitle] = useState(null);
  const [jobdescription, setjobdescription] = useState(null);
  const [location, setjoblocation] = useState(null);
  const [category, setjobcategory] = useState(null);
  const [email, setemail] = useState(null);
 

  const [indicator, setindicator] = useState(false);
  const [token, settoken] = useState(null);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const customertoken = useSelector(
    (state) => state.customerAuth.customertoken
  );
  const showToast = (e) => {
    ToastAndroid.show(e, ToastAndroid.SHORT);
  }; 
  const handleSubmit = async (firebaseImageUrl) => {
    if (!jobtitle) {
      setindicator(false);
      showToast("Enter Job Title");
      return;
    }
    if(jobtitle.length<8){
      setindicator(false);
      showToast("Job title should be atleast 8 characters...");
      return;
    }
    if (!jobdescription) {
      setindicator(false);
      showToast("Enter Job Description");
      return;
    }
    if(jobdescription.length<8){
      setindicator(false);
      showToast("Job description should be atleast 8 characters...");
      return;
    }
    if (!location) {
      setindicator(false);
      showToast("Select Location");
      return;
    }
    if (!category) {
      setindicator(false);
      showToast("Select Category");
      return;
    }
    if (!email) {
      setindicator(false);
      showToast('Something Went Wrong! refresh the app');
      return;
    }
  
    try {
      setindicator(true);
      const data = {
        location: location,
        email: email,
        jobtitle: jobtitle,
        jobdescription: jobdescription,
        category: category,
        image_url: firebaseImageUrl,
      };
  
      const response = await axios.post(
        "https://direckt-copy1.onrender.com/Customerdata/createjob",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  

  
      setjobtitle("");
      setjobdescription("");
      setSelectedImage(null);
      setindicator(false);
      setModalVisible(!modalVisible);
    } catch (error) {
      setindicator(false);
  
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
  
  
  const handlesubmitimage = async () => {

    if (!jobtitle) {
      setindicator(false);
      showToast("Enter Job Title")
      return;
    }
    if(jobtitle.length<8){
      setindicator(false);
      showToast("Job title should be atleast 8 characters...");
      return;
    }
    if (!jobdescription) {
      setindicator(false);
      showToast("Enter Job Description");
      return;
    }
    if(jobdescription.length<8){
      setindicator(false);
      showToast("Job description should be atleast 8 characters...");
      return;
    }
    if (!location) {
      setindicator(false);
      showToast("Select Location")
      return;
    }
    if (!category) {
      setindicator(false);
      showToast("Select Category")
      return;
    }
    if (!email) {
      setindicator(false);
      showToast('Something Went Wrong! refresh the app')
      return;
    }

    try {
      setindicator(true)
      if (selectedImage) {


        // Use await to wait for uploadMedia promise to resolve
        const firebaseImageUrl = await uploadMedia(selectedImage);

        if (firebaseImageUrl) {
          await handleSubmit(firebaseImageUrl);
        }
      }

    } catch (error) {
    
    }
  };
 
  useEffect(() => {
    const fetchData = async () => {
      try {
       
        SecureStore.getItemAsync("customertoken")
          .then((value) => {
        
            settoken(value);
          })
          .catch((error) => {});
        const data = await AsyncStorage.getItem("customerdata");
        const parsedData = JSON.parse(data);
        setemail(parsedData.email);
      
      } catch (err) {
        
      }
    };

    fetchData();
  }, [customertoken]);
  
  const [choosedata, setChooseData] = useState([{key:'1', value:'loading...', disabled:true}]);
  useEffect(() => {
    fetchData(); // Fetch choosedata when the component mounts
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://direckt-copy1.onrender.com/direckt/getcategory");
      const dataFromBackend = response.data;
     
      if (Array.isArray(dataFromBackend) && dataFromBackend.length > 0) {
        // Map over the data to convert it into the required format
        const formattedData = dataFromBackend[0]?.categories.map(category => ({
          key: category.key,
          value: category.value
        })) || [];
        // Update the state with the formatted data
        setChooseData(formattedData);
      } else {
        return ;
      }
    } catch (error) {
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
    }
  };

  const [chooselocation, setchooselocation] = useState([{key:'1', value:'loading...', disabled:true}]);
  useEffect(() => {
    fetchDatalocation(); // Fetch choosedata when the component mounts
  }, []);

  const fetchDatalocation = async () => {
    try {
      const response = await axios.get("https://direckt-copy1.onrender.com/direckt/getlocations");
      const dataFromBackend = response.data;
     
      if (Array.isArray(dataFromBackend) && dataFromBackend.length > 0) {
        // Map over the data to convert it into the required format
        const formattedData = dataFromBackend[0]?.locations.map(location => ({
          key: location.key,
          value: location.value
        })) || [];
        // Update the state with the formatted data
        setchooselocation(formattedData);
      } else {
       return
      }
    } catch (error) {
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
    }
  };
  
  
  
 
  const string = 'success';
  return (
    <KeyboardAwareScrollView
      extraScrollHeight={Platform.OS === "ios" ? 50 : 0}
      enableOnAndroid={true}
      contentContainerStyle={styles.scrollContainer}
    >
      <SafeAreaView style={styles.box}>
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
              <Text style={styles.modalText}>Job created Successfully</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  navigation.navigate("homeCustomer", { string });
                }}>
                <Text style={styles.textStyle}>Okay</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <View style={styles.box1}>
          <Text style={styles.box1text}>Job Title</Text>
          <TextInput
            style={styles.box1input}
            onChangeText={(text) => setjobtitle(text)}
            placeholder="Give a title."
            value={jobtitle}
            maxLength={75}
          />
          <Text style={styles.box2text}>Job Descripton</Text>
          <TextInput
            style={styles.box2input}
            multiline={true}
            numberOfLines={6}
            textAlignVertical="top"
            placeholder="Describe your problem clearly."
            onChangeText={(text) => setjobdescription(text)}
            value={jobdescription}
            maxLength={300}
          />
          <Text style={styles.box1text}>Choose Category</Text>
          <SelectList
            setSelected={(val) => setjobcategory(val)}
            data={choosedata}
            save="value"
            boxStyles={{ borderColor: COLORS.primary }}
            inputStyles={{ width: "80%" }}
            dropdownStyles={{
              width: (Width * 80) / 100,
              borderStyle: "solid",
              borderColor: "white",
            }}
            dropdownItemStyles={{ width: "80%" }}
            closeicon={<AntDesign name="close" size={30} color={COLORS.gray} />}
          />
          <Text style={styles.box1text}>Choose Location</Text>
          <SelectList
            setSelected={(val) => setjoblocation(val)}
            data={chooselocation}
            save="value"
            boxStyles={{ borderColor: COLORS.primary }}
            inputStyles={{ width: "80%" }}
            dropdownStyles={{
              width: (Width * 85) / 100,
              borderStyle: "solid",
              borderColor: "white",
            }}
            dropdownItemStyles={{ width: "80%" }}
            closeicon={<AntDesign name="close" size={30} color={COLORS.gray} />}
          />

          <View style={styles.box1send}>
            <View>
              <Imagepick setSelectedImage={setSelectedImage} />
              {selectedImage ? (
                <View style={{alignItems:'center'}}>
                  <Image
                  source={{ uri: selectedImage }}
                  style={{ width: 80, height: 80, borderRadius: 50 }}
                />
                <TouchableOpacity onPress={()=>setSelectedImage(null)}>
                <Text>remove Image</Text>
                </TouchableOpacity>
                  </View>
              ) : null}
            </View>
            {indicator ? (<View>
              <ActivityIndicator color={COLORS.primary} size={40} />
            </View>) : <>
              {!selectedImage ? (
                <TouchableOpacity
                  underlayColor="white"
                  onPress={() => {
                    handleSubmit();
                  }}
                >
                  <View style={styles.box3opacity}>
                    <Text
                      style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
                    >
                      Post Job
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  underlayColor="white"
                  onPress={() => {
                    handlesubmitimage();
                  }}
                >
                  <View style={styles.box3opacity}>
                    <Text
                      style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
                    >
                      Post Job
                    </Text>
                  </View>
                </TouchableOpacity>
              )}</>}
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    width: Width,
  },
  box: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",

    width: Width,
  },
  box1: {
    width: "100%",
    width: Width,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 20,
  },
  box1text: {
    fontSize: 18,
    width: "85%",
  },
  box1input: {
    borderStyle: "solid",
    borderWidth: 1,
    width: "85%",
    height: 40,
    fontSize: 16,
    borderColor: COLORS.primary,
    marginBottom: 10,
    borderRadius: 8,
    padding: 10,
  },

  box2text: {
    fontSize: 18,
    width: "85%",
  },
  box2input: {
    borderStyle: "solid",
    borderWidth: 1,
    width: "85%",
    borderColor: COLORS.primary,
    fontSize: 15,
    borderRadius: 8,
    marginBottom: 10,
    padding: 10,
  },
  box1send: {
    flex: 0.5,
    flexDirection: "row",

    width: "85%",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  sendinput: {
    width: "40%",
    borderStyle: "solid",
    borderWidth: 2,
  },
  box3opacity: {
    width: (Width * 30) / 100,
    backgroundColor: COLORS.primary,
    paddingVertical: 17,
    borderRadius: 5,
    alignItems: "center",
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
});

export default Createthread;
