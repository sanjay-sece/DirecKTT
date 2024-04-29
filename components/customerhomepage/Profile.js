import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  SafeAreaView,
  Alert,
  useColorScheme,
  TextInput,

  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons, Entypo, FontAwesome5 } from "@expo/vector-icons";
import {  AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { React, useEffect, useState } from "react";
import { Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { useDispatch, useSelector } from "react-redux";
import { COLORS } from "../../constants/Theme";
import axios from "axios";
import { clearCustomerToken } from "../../redux/customerAuthActions";
const height = Dimensions.get("window").height;


const Profile = () => {
  const [token, settoken] = useState(null);
  const [indicator, setindicator] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const customertoken = useSelector(
    (state) => state.customerAuth.customertoken
  );

  const [customerdata, setCustomerData] = useState(null);
  const data = [
    {
      id: 1,
      title: "What is Direckt?",
      content:
        "Direckt is an app that connects customers with nearby sellers and service providers.",
    },
    {
      id: 2,
      title: "Do I need to pay any money?",
      content:
        "No, you don't need to pay any money, and don't pay in the name of Direckt.",
    },
    {
      id: 3,
      title: "What happens when you create a job?",
      content:
        "When you create a job, it will be sent to sellers matching the category and location you specify. Your name and email are not sent to them.",
    },
    {
      id: 4,
      title: "What is deactivate and delete?",
      content:
        "Deactivating means you no longer receive responses to your job, but you can still see the job. Deleting means everything related to the job will be removed.",
    },
    {
      id: 5,
      title: "Is Direckt responsible for the products or services?",
      content:
        "No, Direckt is not responsible for the products or services offered by sellers; it simply connects you with them.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackTextIndicator, setFeedbackTextindicator] = useState(false);
  const handleFeedbackSubmit = async () => {
    if (feedbackText.length === 0) {
      showToast('feedback is empty')
      return;
    }
    try {
      setFeedbackTextindicator(true)
      const response = await axios.post('https://direckt-copy1.onrender.com/direckt/customerfeedback', { feedback: feedbackText });
      showToast('Thanks for your feedback!');
      setFeedbackText('')
      setFeedbackTextindicator(false)

    } catch (error) {
    
      setFeedbackTextindicator(false)
      if (axios.isAxiosError(error)) {
        // Axios-related error
        if (error.response) {
          // Response received with an error status code
          showToast("Feedback failed");
        } else {
          // Network error (no response received)
          showToast("Network error. Please check your internet connection.");
        }
      } else {
       
        showToast("An error occurred. Please try again. logout and resign in");
      }

    }
  };

  const showToast = (e) => {
    ToastAndroid.show(e, ToastAndroid.SHORT);
  };
  const toggleItem = (index) => {
    if (currentIndex === index) {
      setCurrentIndex(null);
    } else {
      setCurrentIndex(index);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await AsyncStorage.getItem("customerdata");

        if (data) {
          const parsedData = JSON.parse(data);
          setCustomerData(parsedData);
        }
        SecureStore.getItemAsync("customertoken")
          .then((value) => {
            
            settoken(value);
          })
          .catch((error) => {});
      
      } catch (err) {
      
      }
    };

    fetchData();
  }, [customertoken]);
  const removeData = async () => {
    const formdata = {
      email: customerdata.email
    }
    try {
      setindicator(true);
      const response = await axios.post(
        "https://direckt-copy1.onrender.com/auth/customerlogout",
        formdata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      dispatch(clearCustomerToken());
      await SecureStore.deleteItemAsync("customertoken");
     
      await AsyncStorage.removeItem("customerdata");
      setindicator(false);
      navigation.navigate("Home");
      
    } catch (error) {
      setindicator(false);
      if (axios.isAxiosError(error)) {
        // Axios-related error
        if (error.response) {
          // Response received with an error status code
          
          await SecureStore.deleteItemAsync("customertoken");
        
          await AsyncStorage.removeItem("customerdata");
          navigation.navigate("Home");
        } else {
          // Network error (no response received)
          showToast("Network error. Please check your internet connection.");
        }
      } else {
        // Non-Axios error
        await SecureStore.deleteItemAsync("customertoken");
        
        await AsyncStorage.removeItem("customerdata");
        navigation.navigate("Home");
        
      }
    }
  };
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => {
            removeData();

         
          },
        },
      ],
      { cancelable: false }
    );
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.bodycontainer}>
          <View
            style={{
              width: "100%",
              height: 60,
              paddingRight: 10,
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            {indicator?(<View>
              <ActivityIndicator color={"red"} size={40} />
            </View>):<TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={handleLogout}
            >
              <Text style={styles.logout}>Log out </Text>
              <MaterialIcons name="logout" size={24} color="red" />
            </TouchableOpacity>}
          </View>
          <View style={styles.userdetails}>
            <View>
              <Text style={styles.bodyusername}>
                {customerdata ? "@ " + customerdata.name : null}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <MaterialIcons name="email" size={25} color="black" />
              <Text style={styles.bodyemail}>
                {customerdata ? customerdata.email : null}
              </Text>
            </View>
          </View>
          <View style={styles.faq}>
            <Text style={styles.faqtitle}>Frequently Asked Questions</Text>
            <ScrollView style={styles.faqcontainer}>
              {data.map((item, index) => (
                <AccordionItem
                  key={item.id}
                  index={index}
                  title={item.title}
                  content={item.content}
                  currentIndex={currentIndex}
                  toggleItem={toggleItem}
                />
              ))}
            </ScrollView>
          </View>
          <View style={styles.bodyfooter}>
           

            <View style={styles.aboutlist}>
              <View>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      "https://mageshkrishna.github.io/DirecktAbout/index"
                    )
                  }
                  style={styles.aboutdetails}
                >
                  <AntDesign
                    name="exclamationcircleo"
                    size={24}
                    color="black"
                  />
                  <Text style={styles.aboutdireckt}>About Direckt</Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      "https://elamparithi07.github.io/Direcktterms/index1.html"
                    )
                  }
                  style={styles.aboutdetails}
                >
                  <MaterialIcons name="privacy-tip" size={24} color="black" />
                  <Text style={styles.pp}>Privacy Policy</Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      "https://elamparithi07.github.io/Direcktterms/index.html"
                    )
                  }
                  style={styles.aboutdetails}
                >
                  <MaterialCommunityIcons
                    name="file-document-multiple-outline"
                    size={24}
                    color="black"
                  />
                  <Text style={styles.tc}>Terms & Conditions</Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() =>{
                      Alert.alert(
                      "Delete Account",
                      "Are you sure you want to delete this account? (Account cannot be recovered once deleted)",
                      [
                        {
                          text: "Cancel",
                          style: "cancel",
                        },
                        {
                          text: "delete",
                          onPress: () => {
                            navigation.navigate("CustomerAccountDelete",{email:customerdata.email});
                          },
                        },
                      ],
                      { cancelable: false }
                    );
                  }
                  }
                  style={styles.aboutdetailslast}
                >
                  <AntDesign name="delete" size={24} color="red" />
                  <Text style={styles.deletaccount}>Delete account</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
          <View
            style={{ height: 200, width: "100%", flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', gap: 10, paddingLeft: 15 }}
          >
            <Text>Your Feedback Matters: Suggestions, Bug Reports Welcome!</Text>
            <TextInput
              style={{
                flex: 1,
                textAlignVertical: "top",
                borderWidth: 1,
                borderColor: "gray",
                padding: 10,
                width: '100%',
                borderRadius: 5
              }}
              multiline
              numberOfLines={4}
              placeholder="Type your feedback here..."
              value={feedbackText}
              onChangeText={setFeedbackText}
            />
            <TouchableOpacity style={{ backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4, flexDirection: 'row', alignItems: 'center' }} onPress={handleFeedbackSubmit}><Text style={{ fontSize: 18, color: '#fff' }}>Submit</Text>{feedbackTextIndicator && <ActivityIndicator size={18} color={'#fff'} />}</TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const AccordionItem = ({ title, content, index, currentIndex, toggleItem }) => {
  const colorScheme = useColorScheme();
  const isExpanded = index === currentIndex;

  return (
    <View>
      <TouchableOpacity onPress={() => toggleItem(index)}>
        <View style={styles.faqQuestion}>
          <Text style={{ color: "grey" }}>{title}</Text>
        </View>
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.faqAnswer}>
          <Text style={{ color: "black" }}>
            {content}
          </Text>
        </View>
      )}
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headercontainer: {
    justifyContent: "space-between",
    height: (height * 30) / 100,
    padding: 30,
    justifyContent: "flex-end",
  },
  headername: {
    color: "black",
    fontWeight: "medium",
    fontSize: 40,
  },
  bodycontainer: {
    flex: 1,
    elevation: 8,
    shadowOffset: {
      height: 2,
      width: 2,
    },
    shadowColor: "black",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: "white",
    padding: 30,
    marginTop: -10,
  },
  userdetails: {
    height: (height * 20) / 100,
    justifyContent: "space-evenly",
  },
  bodyusername: {
    fontSize: 25,
  },
  bodyemail: {
    fontSize: 18,
    paddingLeft: 5,
  },
  faq: {
    flex: 1,
    paddingVertical: 15,
  },
  faqcontainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  faqQuestion: {
    paddingHorizontal: "3%",
    paddingVertical: "9%",
  },
  faqAnswer: {
    paddingHorizontal: "4%",
    paddingVertical: "1%",
  },
  bodyfooter: {
    height: (height * 30) / 100,
    marginBottom:20
  },
  footertitle: {
    fontSize: 18,
  },
  sociallinks: {
    paddingVertical: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  aboutlist: {
    height: (height * 30) / 100,
    justifyContent: "space-evenly",
  },
  aboutdetails: {
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "grey",
  },
  aboutdetailslast: {
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
  },
  aboutdireckt: {
    paddingHorizontal: 20,
  },
  pp: {
    paddingHorizontal: 20,
  },
  tc: {
    paddingHorizontal: 20,
  },
  logout: {
    color: "red",
    fontSize: 18,
  },
  deletaccount:{
    color: "red",
    paddingHorizontal: 20,
  }
});
