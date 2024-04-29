import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Image, Linking, Alert, Pressable, ToastAndroid, ActivityIndicator } from 'react-native'
import { FontAwesome5, AntDesign, MaterialCommunityIcons, MaterialIcons, Feather, Entypo } from '@expo/vector-icons';
import { React, useEffect, useState } from 'react'
import { useIsFocused, useNavigation } from '@react-navigation/native';
import axios from "axios";
import { useDispatch } from 'react-redux';
import { clearShopOwnerToken } from '../../redux/shopOwnerAuthActions';

import AsyncStorage from '@react-native-async-storage/async-storage';
const height = Dimensions.get("window").height
const width = Dimensions.get("window").width
import * as SecureStore from "expo-secure-store";
import { TextInput } from 'react-native-gesture-handler';
import { COLORS } from '../../constants/Theme';
import ImagePopup from './Imagepopup';
const Shopownerprofile = () => {
  const dispatch = useDispatch();

  const navigation = useNavigation();
  const [email, setemail] = useState('');
  const [businessname, setbusinessname] = useState();
  const [businessabout, setbusinessabout] = useState("Vallioor");
  const [phonenumber, setphonenumber] = useState("");
  const [profilepic, setprofilepic] = useState("");
  const [photos, setphotos] = useState([]);
  const [gmaplink, setgmaplink] = useState(
    "https://www.google.com/maps/place/Sri+Eshwar+College+of+Engineering,+Coimbatore/@10.827908,77.0579419,17z/data=!3m1!4b1!4m6!3m5!1s0x3ba84ee37569ae7f:0x3c5b1824b6e79192!8m2!3d10.827908!4d77.0605168!16s%2Fg%2F1tdyp6pq?entry=ttu"
  );
  const [address, setaddress] = useState(
    "Store description will be written here for the betterment of the design"
  );
  const [deliverylocation, setdeliverylocation] = useState();
  const [location, setlocation] = useState("");
  const [category, setcategory] = useState([]);
  const [availabilitystatus, setavailabilitystatus] = useState(Boolean);
  const [deliverystatus, setdeliverystatus] = useState(Boolean)
  const [shopownerId, setshopownerId] = useState(null);
  const [token, settoken] = useState(null)
  const [shopindicator, setshopindicator] = useState(false)
  const [deliveryindicator, setdeliveryindicator] = useState(false)
  const [logoutindicator,setLogoutindicator] =useState(false);
  const isFocused = useIsFocused();
  const updatedeliveryStatusInAsyncStorage = async (deliverystatus) => {
    try {
      // Retrieve the existing data from AsyncStorage
      const existingData = await AsyncStorage.getItem('shopownerdata');

      // Parse the existing data or use an initial object if it doesn't exist
      const parsedData = existingData ? JSON.parse(existingData) : {};

      // Update the availability status in the parsed data
      parsedData.deliverystatus = deliverystatus;

      // Save the updated data back to AsyncStorage
      await AsyncStorage.setItem('shopownerdata', JSON.stringify(parsedData));


    } catch (error) {
      showToast(error);
    }
  };
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackTextIndicator, setFeedbackTextindicator] = useState(false);
  const handleFeedbackSubmit = async () => {
    if (feedbackText.length === 0) {
      showToast('feedback is empty');
      return;
    }
    try {
      setFeedbackTextindicator(true);
      const response = await axios.post('https://direckt-copy1.onrender.com/direckt/shopownerfeedback', { feedback: feedbackText });
      showToast('Thankyou for your valuable feedback!')
      setFeedbackText('')
      setFeedbackTextindicator(false)

    } catch (error) {
      setFeedbackTextindicator(false)
      showToast('feedback failed')

    }
  };

  const removeData = async () => {

    const formdata = {
      email: email
    }
    try {
      setLogoutindicator(true);
      const response = await axios.post(
        "https://direckt-copy1.onrender.com/auth/shopownerlogout",
        formdata,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      dispatch(clearShopOwnerToken());
      await SecureStore.deleteItemAsync('shopownertoken');

      await AsyncStorage.removeItem("shopownerdata");
      navigation.reset({
        index: 0,
        routes: [{ name: 'Shopownerhomepage' }],
      });
      setLogoutindicator(false);
      navigation.navigate("Home");

    } catch (error) {
      if (axios.isAxiosError(error)) {

        if (error.response) {


          await SecureStore.deleteItemAsync('shopownertoken');

          await AsyncStorage.removeItem("shopownerdata");
          navigation.reset({
            index: 0,
            routes: [{ name: 'Shopownerhomepage' }],
          });
          navigation.navigate("Home");
        } else {

          showToast("Network error. Please check your internet connection.");
        }
      } else {


        await SecureStore.deleteItemAsync('shopownertoken');

        await AsyncStorage.removeItem("shopownerdata");
        navigation.reset({
          index: 0,
          routes: [{ name: 'Shopownerhomepage' }],
        });
        navigation.navigate("Home");
      }
    }
  };
  const delivery = async () => {
    // Show a confirmation alert
    Alert.alert(
      'Confirmation',
      'Do you want to change the delivery status?',
      [
        {
          text: 'No',
          onPress: () => { }, // Do nothing if 'No' is pressed
          style: 'cancel'
        },
        {
          text: 'Yes',
          onPress: async () => {
            setdeliveryindicator(true)




            const formdata = {
              shopownerId: shopownerId,
              deliverystatus: !deliverystatus,
              email: email,
            };


            try {
              // Assuming the API request is uncommented
              const response = await axios.put("https://direckt-copy1.onrender.com/shopowner/deliverystatus", formdata,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                }
              );
              if (response) {
                updatedeliveryStatusInAsyncStorage(!deliverystatus)
                setdeliverystatus(!deliverystatus)
              }
              setdeliveryindicator(false)
            } catch (error) {
              setdeliveryindicator(false)
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
          }
        }
      ],
      { cancelable: false }
    );
  };
  const updateavailabilityStatusInAsyncStorage = async (availabilitystatus) => {
    try {
      // Retrieve the existing data from AsyncStorage
      const existingData = await AsyncStorage.getItem('shopownerdata');

      // Parse the existing data or use an initial object if it doesn't exist
      const parsedData = existingData ? JSON.parse(existingData) : {};

      // Update the availability status in the parsed data
      parsedData.availabilitystatus = availabilitystatus;

      // Save the updated data back to AsyncStorage
      await AsyncStorage.setItem('shopownerdata', JSON.stringify(parsedData));


    } catch (error) {
      showToast(error);
    }
  };
  const availability = async () => {
    // Show a confirmation alert
    Alert.alert(
      'Confirmation',
      'Do you want to change the availability status?',
      [
        {
          text: 'No',
          onPress: () => { }, // Do nothing if 'No' is pressed
          style: 'cancel'
        },
        {
          text: 'Yes',
          onPress: async () => {
            setshopindicator(true)


            const formdata = {
              shopownerId: shopownerId,
              availabilitystatus: !availabilitystatus,
              email: email,
            };

            try {
              // Assuming the API request is uncommented
              const response = await axios.put("https://direckt-copy1.onrender.com/shopowner/availabilitystatus", formdata,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                }
              );
              updateavailabilityStatusInAsyncStorage(!availabilitystatus)
              setavailabilitystatus(!availabilitystatus)
              setshopindicator(false)
            } catch (error) {
              setshopindicator(false)
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
          }
        }
      ],
      { cancelable: false }
    );
  };

  const showToast = (e) => {
    ToastAndroid.show(e, ToastAndroid.SHORT);
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        SecureStore.getItemAsync("shopownertoken")
          .then((value) => {
            settoken(value);
          })
          .catch((error) => { });
        const data = await AsyncStorage.getItem("shopownerdata");

        if (data) {
          const parsedData = JSON.parse(data);
          setshopownerId(parsedData._id)
          setbusinessname(parsedData.businessname);
          setphonenumber(parsedData.phonenumber.toString());
          setemail(parsedData.email);
          setbusinessabout(parsedData.businessabout);
          setprofilepic(parsedData.profilepic);
          setphotos(parsedData.photos);
          setlocation(parsedData.location);
          setcategory(parsedData.category);
          setgmaplink(parsedData.gmaplink);
          setaddress(parsedData.address);
          setdeliverylocation(parsedData.deliverylocation);
          setshopownerId(parsedData._id)
          setavailabilitystatus(parsedData.availabilitystatus)
          setdeliverystatus(parsedData.deliverystatus)
        }
      } catch (err) {

      }
    };

    fetchData();
  }, [isFocused]);
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const handleImagePress = (index) => {
    setActiveImageIndex(index);
  };
  const handleClosePopup = () => {
    setActiveImageIndex(null);
  };

  return (
    <ScrollView style={styles.container}>
      <View

        style={styles.headercontainer}>
        <View style={styles.profilecontainer}>
          <TouchableOpacity
            onPress={() => setShowPopup(true)}>
            {profilepic ? <Image
              source={{
                uri: profilepic,
              }}
              style={styles.headerprofileImage}
            /> : <Image
              source={
                { uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3u_DGIWouUwuaqQE88-nun_n2h-Pb2yRQXQ&usqp=CAU', }
              }
              style={styles.headerprofileImage}
            />
            }
          </TouchableOpacity>
          {showPopup && (
            <ImagePopup
              imageUrl={profilepic}
              onClose={() => setShowPopup(false)}
            />
          )}
        </View>
      </View>
      <View style={styles.bodycontainer}>
        <View >
          <Text style={styles.bodyshopname}>{businessname}</Text>
        </View>
        <View>
          <Text style={styles.bodyshopdescription}>{businessabout ? businessabout : "There is no description available for this shop"}</Text>
        </View>
        <View>
          <TouchableOpacity style={styles.editprofile} onPress={() => { navigation.navigate('EditOwnerProfile') }}>
            <Feather name="edit" size={20} color="black" />
            <Text> Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.ctccontainer}>
        <View style={styles.ctccard}>
          <View style={styles.ctcsection}>
            {shopindicator ? <ActivityIndicator size={40} color="green" /> :
              <Pressable
                style={availabilitystatus ? [styles.storestatus, styles.ctcicon] : [styles.storestatusoff, styles.ctcicon]}
                onPress={() => { availability() }}
              >
                {availabilitystatus ? <MaterialCommunityIcons name="store-check" size={42} color="white" /> : <MaterialCommunityIcons name="store-remove" size={42} color="white" />}
              </Pressable>
            }
            {availabilitystatus ? <Text style={{ fontSize: 10 }}>Store: Open</Text> : <Text style={{ fontSize: 10 }}>Store: Closed</Text>}
          </View>
          <View style={styles.ctcsection}>
            {deliveryindicator ? <ActivityIndicator size={40} color="green" /> :
              <Pressable
                onPress={() => { delivery() }}
                style={deliverystatus ? [styles.ctcdeliverystatus, styles.ctcicon] : [styles.ctcdeliverystatusoff, styles.ctcicon]}
              >
                <MaterialIcons name="delivery-dining" size={42} color="white" />
              </Pressable>
            }
            {deliverystatus ? <Text style={{ fontSize: 10 }}>Delivery: Available</Text> : <Text style={{ fontSize: 10 }}>Delivery: Not</Text>}
          </View>
          <View style={styles.ctcsection}>
            <Pressable
              onPress={() => {
                Alert.alert(
                  'Confirmation',
                  'Are you sure you want to google maps?',
                  [
                    {
                      text: 'Cancel',
                      onPress: () => { },
                      style: 'cancel',
                    },
                    { text: 'open', onPress: () => gmaplink ? Linking.openURL(gmaplink) : showToast('Google map is not linked') },
                  ],
                  { cancelable: false }
                )
              }}
              style={[styles.ctcicon, styles.ctcdirection]}
            >
              <FontAwesome5 name="directions" size={42} color="#5271FF" />
            </Pressable>
            <Text style={{ fontSize: 10 }}>google maps</Text>
          </View>
        </View>
      </View>
      <View style={styles.otherdetails}>
        <View style={styles.detailitem}>
          <Text style={styles.shopdetailstitle}>Location</Text>
          <View style={styles.shopdetailsbox}>
            <Text style={styles.shopdetailsvalue} numberOfLines={1}>{location ? location : "- location not added -"}</Text>
          </View>
        </View>
        <View style={styles.detailitem}>
          <Text style={styles.shopdetailstitle}>Address</Text>
          <View style={styles.shopdetailsbox}>
            <Text style={styles.shopdetailsvalue} numberOfLines={2}>{address ? address : '- address not added -'}</Text>
          </View>
        </View>
        <View style={styles.detailitem}>
          <Text style={styles.deliverylocationtitle}>category</Text>
          <View style={styles.deliverylocationContainer}>
            {category.map((item, index) => (
              <View key={index} style={styles.locations}>
                <Text>{item}</Text>
              </View>
            ))}
            {category == 0 && <View style={styles.locations}><Text>no category added</Text></View>}
          </View>
        </View>
        <View style={styles.detailitem}>
          <Text style={styles.shopdetailstitle}>Delivery or Servicable locations</Text>
          <View style={styles.shopdetailsbox}>
            <Text style={styles.shopdetailsvalue}>{deliverylocation ? deliverylocation : '- locations not added -'}</Text>
          </View>
        </View>
        <View style={styles.detailitem}>
          <Text style={styles.shopdetailstitle}>Mobile number</Text>
          <View style={styles.shopdetailsbox}>
            <Text style={styles.shopdetailsvalue}>{phonenumber}</Text>
          </View>
        </View>
      </View>
      <View style={styles.shopImages}>
        <Text style={styles.heading}>Photos</Text>
        <ScrollView style={styles.imagecontainer} horizontal={true}>
          {
            photos.map((item, index) => {
              return (
                <View key={index}>
                  <TouchableOpacity
                    onPress={() => handleImagePress(index)}
                  >
                    <Image
                      style={styles.card}
                      source={{ uri: item }}
                    />
                  </TouchableOpacity>
                </View>
              )
            })
          }
          {photos.length == 0 ? <View style={styles.addimagecard}><Text style={{ textAlign: 'center', fontSize: 10, color: 'grey' }}>No Image Added</Text></View> : <></>}
          {activeImageIndex !== null && (
            <ImagePopup
              imageUrl={photos[activeImageIndex]}
              onClose={handleClosePopup}
            />
          )}
        </ScrollView>
      </View>
      <View style={styles.bodyfooter}>
        <View>
          <Text style={styles.footertitle}>How to use DirecKT</Text>
        </View>
        <View style={styles.sociallinks}>
          <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com/direcktapp?igsh=Nmk1Z2s0dHNnYWo2')}
          >
            <Entypo name="instagram" size={38} color="red" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://chat.whatsapp.com/Gglkq3l7ymG9A670a8IN2B')}
          >
            <FontAwesome5 name="whatsapp" size={40} color="green" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://youtube.com/@DirecKT-?si=GuY4KIUIX5rOw3EE')}
          >
            <Entypo name="youtube" size={38} color="red" />
          </TouchableOpacity>
        </View>
        <View style={styles.aboutlist}>
          <View>
            <TouchableOpacity
              onPress={() => Linking.openURL('https://mageshkrishna.github.io/DirecktAbout/index')}
              style={styles.aboutdetails}
            >
              <AntDesign name="exclamationcircleo" size={24} color="black" />
              <Text style={styles.aboutdireckt}>About Direckt</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => Linking.openURL('https://elamparithi07.github.io/Direcktterms/index1.html')}
              style={styles.aboutdetails}
            >
              <MaterialIcons name="privacy-tip" size={24} color="black" />
              <Text style={styles.pp}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => Linking.openURL('https://elamparithi07.github.io/Direcktterms/index.html')}
              style={styles.aboutdetails}
            >
              <MaterialCommunityIcons name="file-document-multiple-outline" size={24} color="black" />
              <Text style={styles.tc}>Terms & Conditions</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              style={styles.aboutdetails}
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
                      navigation.navigate("ShopOwnerAccountDelete",{email:email});
                    },
                  },
                ],
                { cancelable: false }
              );
            }
            }
            >
              <AntDesign name="delete" size={24} color="red" />
              <Text style={[{ color: 'red' }, styles.tc]}>Delete account</Text>

            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              style={styles.aboutdetailslast}
              onPress={() => {
                Alert.alert(
                  'Confirmation',
                  'Are you sure you want to Logout?',
                  [
                    {
                      text: 'Cancel',
                      onPress: () => { },
                      style: 'cancel',
                    },
                    { text: 'Logout', onPress: () => removeData() },
                  ],
                  { cancelable: false }
                )
              }}
            >
              {logoutindicator?<ActivityIndicator color={"red"} size={30} />:<MaterialIcons name="logout" size={27} color="red" />}

              <Text style={[{ color: 'red' }, styles.tc]}>Log out</Text>

            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{ height: 200, width: "100%", flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', gap: 10, paddingLeft: 15, marginTop: 20 }}
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
  )
}

export default Shopownerprofile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  headercontainer: {
    flex: 1,
    justifyContent: "flex-end",
    height: (height * 24) / 100,
    padding: 10,
    backgroundColor: '#fff'
  },
  profilecontainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: (height * 30) / 100,
  },
  headerprofileImage: {
    height: 120,
    width: 120,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: '#f2f3f5',
  },
  bodycontainer: {
    flex: 1,
    shadowOffset: {
      height: 2,
      width: 2
    },
    justifyContent: 'space-evenly',
    shadowColor: "black",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: "white",
    height: (height * 25) / 100,
    paddingHorizontal: 25,
    marginTop: -5,
  },
  bodyshopname: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },
  bodyshopdescription: {
    textAlign: 'center',
    color: 'grey',
  },
  imagecontainer: {
    flex: 1,
    flexDirection: 'row',
  },
  editprofile: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: (width * 3) / 100,
    padding: 10,
  },
  ctccontainer: {
    flex: 1,
    height: (height * 16) / 100,
    paddingHorizontal: '4%',
    backgroundColor: "white",
    marginVertical: 3,
  },
  ctccard: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: (height * 20) / 100,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 30,
    elevation: 3,
    paddingHorizontal: 18,
  },
  ctcsection: {
    width: '33%',
    height: '65%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ctcicon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 65,
    marginBottom: 3,
    borderRadius: 40,
  },
  storestatus: {
    borderColor: '#00BF63',
    backgroundColor: '#06A659',
    borderWidth: 1,
  },
  storestatusoff: {
    borderColor: 'red',
    backgroundColor: 'red',
    borderWidth: 1,
  },
  ctcdeliverystatus: {
    borderColor: '#06A659',
    backgroundColor: '#06A659',
    borderWidth: 2,
  },
  ctcdeliverystatusoff: {
    borderColor: 'red',
    backgroundColor: 'red',
    borderWidth: 2,
  },
  ctcdirection: {
    borderColor: '#5271FF',
    borderWidth: 2,
  },
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: "center",
    height: 100,
    width: 100,
    borderRadius: 10,
    margin: 4,

    shadowOffset: {
      width: 1,
      height: 1
    },
    shadowColor: "grey",
    backgroundColor: "black",
  },
  addimagecard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: "center",
    height: 100,
    width: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dotted',
    margin: 4,
    shadowOffset: {
      width: 1,
      height: 1
    },
    shadowColor: "grey",
  },
  shopImages: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 20,
    backgroundColor: "white",
  },
  heading: {
    padding: 10,
    fontWeight: 'medium',
  },
  otherdetails: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 10,
    backgroundColor: "white",
  },
  detailitem: {
    paddingVertical: 5,
  },
  deliverylocationtitle: {
    padding: 10,
    fontWeight: 'medium',
  },
  deliverylocationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 5,
  },
  locations: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  shopdetailstitle: {
    padding: 10,
    fontWeight: 'medium',
  },
  shopdetailsbox: {
    flex: 1,
    padding: 10,
    borderBottomWidth: 0.5,
    borderColor: 'gray',
  },
  shopdetailsvalue: {
    fontSize: 15,
  },
  bodyfooter: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  footertitle: {
    fontSize: 18,
  },
  sociallinks: {
    paddingVertical: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-evenly",
  },
  aboutlist: {
    height: (height * 36) / 100,
    justifyContent: 'space-evenly',
  },
  aboutdetails: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: 'gray',
  },
  aboutdetailslast: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  aboutdireckt: {
    paddingHorizontal: 20,
  },
  pp: {
    paddingHorizontal: 20,
  },
  tc: {
    paddingHorizontal: 20,
  }

})