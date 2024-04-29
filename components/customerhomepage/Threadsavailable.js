import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Image,
  Pressable,
  Linking,
  Alert,
  RefreshControl,
  ActivityIndicator,
  ToastAndroid,
  Modal,
  BackHandler,
  useColorScheme,
} from "react-native";
import {
  Feather,
  AntDesign,
  Entypo,
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
  FontAwesome5,
} from "@expo/vector-icons";
import { FlatList, PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
  clamp,
} from "react-native-reanimated";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import ImagePopup from "../ShopownerHomepage/Imagepopup";
import moment from "moment";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useSelector } from "react-redux";
import { COLORS } from "../../constants/Theme";

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

// Now you can use these variables and components without any conflicts

const showToast = (e) => {
  ToastAndroid.show(e, ToastAndroid.SHORT);
};
UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);
const InsideAccorditon = ({ data }) => {
  const [showPopup, setShowPopup] = useState(false);
  const navigation = useNavigation();
 
  return (
    <View style={styles.resultcard}>
    <View style={styles.resultcardtop}>
      <View style={styles.storeprofileImage}>
        <TouchableOpacity
          style={{ height: "100%", width: "80%", borderRadius: 5 }}
          onPress={() => setShowPopup(true)}
        >
          {data.shopowner_id.profilepic ? (
            <Image
              source={{
                uri: data.shopowner_id.profilepic,
              }}
              style={{ height: "100%", width: "100%", borderRadius: 5 }}
            />
          ) : (
            <Image
              source={require('../../assets/shop.png')}
              style={{ height: "100%", width: "100%", borderRadius: 5 }}
            />
          )}
        </TouchableOpacity>
      </View>

      {showPopup && (
        data.profilepic ? (
          <ImagePopup
            imageUrl={data.shopowner_id.profilepic}
            onClose={() => setShowPopup(false)}
          />
        ) : null
      )}

      <View style={styles.resultcardtopdetails}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text
            style={[styles.storename]}
            numberOfLines={1}
          >
            {data.shopowner_id.businessname}
          </Text>
          {data.deliverystatus ? (
            <Text style={{ fontSize: 12 }}>
              Delivery:<Text style={{ color: "green" }}> Yes</Text>
            </Text>
          ) : (
            <Text style={{ fontSize: 12 }}>
              Delivery:<Text style={{ color: "red" }}> NO</Text>
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          onPress={() => {
            navigation.navigate("storeprofile", { _id: data.shopowner_id._id });
          }}
        >
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderWidth: 2,
              borderColor: "#5271FF",
              color: "#5271FF",
              borderRadius: 5,

            }}
          >
            <Text style={{ color: "#5271FF", fontSize: 12 }}>
              View Profile{" "}
            </Text>
            <Feather name="send" size={14} color="#5271FF" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
    <View style={styles.resultcardmiddle}>
      <Text style={{ color: COLORS.primary, marginTop: 3, fontSize: 13 }}>
        Reply message:
      </Text>
      <Text
        style={{ color: "grey", fontSize: 13, marginVertical: 5 }}
        numberOfLines={2}
      >
        {data.replymessage}
      </Text>
    </View>
    <View style={styles.resultcardctc}>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          paddingHorizontal: 26,
          paddingVertical: 7,
          borderWidth: 2,
          borderColor: "#5271FF",
          color: "white",
          borderRadius: 5,
          backgroundColor: "#5271FF",
        }}
        onPress={() => { Linking.openURL(`tel:${data.shopowner_id.phonenumber}`) }}
      >
        <Text style={{ color: "white" }}>Call Now </Text>
        <MaterialIcons name="phone-in-talk" size={13} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          paddingHorizontal: 26,
          paddingVertical: 7,
          borderWidth: 2,
          borderColor: "#5271FF",
          color: "white",
          borderRadius: 5,
          backgroundColor: "#5271FF",
        }}
        onPress={() => {
          data.gmaplink ? Linking.openURL(data.shopowner_id.gmaplink) : showToast()
        }}
      >
        <Text style={{ color: "white" }}>Direction </Text>
        <FontAwesome5 name="directions" size={13} color="white" />
      </TouchableOpacity>
    </View>
  </View>
  )
};
const AccordionItem = ({ data, token, onRefresh }) => {
  const [expanded, setExpanded] = useState(false);
  const [jobreply, setjobreply] = useState([]);
  const [jobIdToDelete, setjobIdToDelete] = useState(data._id);
  const [showPopup, setShowPopup] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteindicator, setdeleteindicator] = useState(false);
  const [deactivateindicator, setdeactivateindicator] = useState(false);
const navigation = useNavigation();
  const timestamp = data.expiryAt;
  const localDateTime = moment(timestamp)
    .utcOffset("+00:00")
    .format("DD-MM-YYYY h:mm A");

  const deactivatejob = async () => {
    try {
      setdeactivateindicator(true);
      const response = await axios.post(
        "https://direckt-copy1.onrender.com/Customerdata/changeactivestate",
        { _id: jobIdToDelete },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setdeactivateindicator(false);
      ToastAndroid.show("Job Deactivated", ToastAndroid.SHORT);
    } catch (error) {
      setdeactivateindicator(false);
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
  const deactivatedToast = () =>{
    
    showToast("you can't edit deactivated jobs")
 
  }
  const handleDeleteJob = async () => {
    try {
      setdeleteindicator(true);
      const response = await axios.delete(
        "https://direckt-copy1.onrender.com/Customerdata/deletejob",
        {
          params: { _id: jobIdToDelete },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setModalVisible(!modalVisible);
      }
      setdeleteindicator(false);
    } catch (error) {
      setdeleteindicator(false);

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

  useEffect(() => {
    setjobreply(data.jobreply);
  }, [data]);
  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
   
    setExpanded(!expanded);
  };
  const translationX = useSharedValue(0);
  const [isImage, setIsImage] = useState(true);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translationX.value }],
    };
  });

  const handleDragBtnPress = () => {
    // Slide the card to the right
    translationX.value = withSpring(150);
  };

  const handleBackIconPress = () => {
    // Reset the card's position
    translationX.value = withSpring(0);
  };
  return (
    <View>
      <Pressable onPress={toggleExpand}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Feather name="check-circle" size={62} color="green" />
              <Text style={styles.modalText}>Job Deleted Successfully</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  onRefresh();
                }}
              >
                <Text style={styles.textStyle}>Okay</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <View style={styles.thread}>
          <Animated.View style={styles.backLayer}>
            <View style={styles.backLayercontainer}>
              <View style={{ height: "20%", alignItems: "flex-start" }}>
                <TouchableOpacity onPress={handleBackIconPress}>
                  <Entypo
                    name="chevron-with-circle-left"
                    size={30}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  height: "80%",
                  alignItems: "flex-start",
                  justifyContent: "space-evenly",
                }}
              >
                {deleteindicator ? (
                  <View style={{ marginLeft: 40 }}>
                    <ActivityIndicator color={"white"} size={22} />
                    </View>
                ) : (
                  <View style={{ marginLeft: 40 }}>
                    <TouchableOpacity
                      style={{ alignItems: "center", gap: 5 }}
                      onPress={() =>
                        Alert.alert(
                          "Confirm Deletion",
                          "Do you want to delete?",
                          [
                            {
                              text: "Cancel",
                              style: "cancel",
                            },
                            {
                              text: "delete",
                              onPress: () => {
                                handleDeleteJob();
                              },
                            },
                          ],
                          { cancelable: true }
                        )
                      }
                    >
                      <AntDesign name="delete" size={17} color="white" />
                      <Text style={{ color: "white",fontSize:13 }}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {data.status && (
                  <View style={{ marginLeft: 30 }}>
                    {deactivateindicator ? (
                      <View style={{ marginLeft: 30 }}>
                        <ActivityIndicator color={"white"} size={22} />
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={{ alignItems: "center", gap: 5 }}
                        onPress={() =>
                          Alert.alert(
                            "Confirm Deactivation",
                            "You can Deactivate the Job only once. Do you want to deactivate?",
                            [
                              {
                                text: "Cancel",
                                style: "cancel",
                              },
                              {
                                text: "Deactivate", // Corrected from "deactivated" to "Deactivate"
                                onPress: async () => {
                                  await deactivatejob();
                                  onRefresh();
                                },
                              },
                            ],
                            { cancelable: true }
                          )
                        }
                      >
                        <MaterialCommunityIcons
                          name="file-cancel-outline"
                          size={20}
                          color="white"
                        />
                        <Text style={{ color: "white",fontSize:13 }}>Deactivate</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            </View>
            <Animated.View style={[styles.jobCard, animatedStyle]}>
              <View style={{ width: "98%" }}>
                <View style={styles.jobCardTop}>
                  <View
                    style={[styles.jobDetails, data.image_url ? { width: "65%" } : {}]}
                  >
                    <Text style={styles.jobTitle} numberOfLines={1}>
                      {data.jobtitle}
                    </Text>
                    <Text style={styles.jobDescription} numberOfLines={2}>
                      {data.jobdescription}
                    </Text>
                    {data.status ? (
                      <Text style={styles.expireTime}>
                        <Feather name="calendar" size={11} color="#444444" />{" "}
                        expire on {localDateTime}
                      </Text>
                    ) : (
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text style={{ fontSize: 12, color: "red" }}>
                          Deactivated
                        </Text>
                      </View>
                    )}
                  </View>
                  {data.image_url &&
                    <TouchableOpacity style={[styles.jobImage]}
                    onPress={() => setShowPopup(true)}
                    >
                      <Image
                        style={styles.image}
                        source={{
                          uri: data.image_url,
                        }}
                      />
                    </TouchableOpacity>
                  }
                  {showPopup && data.image_url ? (
                    <ImagePopup
                      imageUrl={data.image_url}
                      onClose={() => setShowPopup(false)}
                    />
                  ) : (
                    <></>
                  )}
                </View>
                <View style={styles.jobCardBottom}>
                  {data.status ? 
                  <TouchableOpacity style={styles.editJob} onPress={()=>{navigation.navigate('Editjob',{token:token,job_id:data._id})}}>
                    <Text style={{ color: "white" }}>
                      <AntDesign name="edit" size={12} color="white" /> Edit Job
                    </Text>
                  </TouchableOpacity>
                  :
                  <TouchableOpacity style={styles.editJob} onPress={()=>{deactivatedToast()}}>
                  <Text style={{ color: "white" }}>
                    <AntDesign name="edit" size={12} color="white" /> Edit Job
                  </Text>
                </TouchableOpacity>
}
                  <View style={styles.viewResponse}>
                  {jobreply.length > 0 ? (
                    <>
                      <Text style={{ color: COLORS.primary }}>
                        {jobreply.length} response
                      </Text>
                    </>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        ToastAndroid.show("No responses come back after some minutes", ToastAndroid.SHORT);
                      }}
                    >
                      <Text style={{color:COLORS.primary}}>no response</Text>
                    </TouchableOpacity>
                  )}
                </View>
          
                </View>
              </View>
              <View style={{ width: 27, justifyContent: "center" ,position:'absolute',right:-10,marginVertical:50}}>
                <TouchableOpacity
                  style={styles.dragBtn}
                  onPress={handleDragBtnPress}
                >
                  <AntDesign name="delete" size={22} color="black" />
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.View>

          {/* {data.status ? (
            <View style={styles.expirationtitle}>
              <Text style={styles.expireText}>
                Job expire at {localDateTime}
              </Text>
            </View>
          ) : (
            <></>
          )}
          <View style={styles.threadcardsection}>
            <TouchableOpacity
              style={styles.threadImage}
              onPress={() => setShowPopup(true)}
            >
              {data.image_url ? (
                <Image
                  source={{
                    uri: data.image_url,
                  }}
                  style={{
                    height: "100%",
                    width: "100%",
                    backgroundColor: "white",
                  }}
                />
              ) : (
                <Image
                  source={{
                    uri: "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg",
                  }}
                  style={{
                    height: "100%",
                    width: "100%",
                    backgroundColor: "white",
                  }}
                />
              )}
              {showPopup && data.image_url ? (
                <ImagePopup
                  imageUrl={data.image_url}
                  onClose={() => setShowPopup(false)}
                />
              ) : (
                <></>
              )}
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialIcons name="category" size={17} color="black" />
                <Text style={styles.threadcategory} numberOfLines={1}>
                  {data.category}
                </Text>
              </View>
            </TouchableOpacity>
            <Pressable style={styles.threaddetails} onPress={toggleExpand}>
              {data.status ? (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                    onPress={() =>
                      Alert.alert(
                        "Confirm Deactivation",
                        "You can Deactivate the Job only once. Do you want to deactivate?",
                        [
                          {
                            text: "Cancel",
                            style: "cancel",
                          },
                          {
                            text: "Deactivate", // Corrected from "deactivated" to "Deactivate"
                            onPress: async () => {
                              await deactivatejob();
                              onRefresh();
                            },
                          },
                        ],
                        { cancelable: true }
                      )
                    }
                  >
                    {deactivateindicator && (
                      <ActivityIndicator size={18} color={COLORS.primary}/>
                    )}
                    <Text style={styles.deactivate}>Deactivate</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <Text style={styles.deactivated}>Not active</Text>
                </View>
              )}
              <Text style={styles.threadtitle} numberOfLines={2}>
                {data.jobtitle}
              </Text>
              <Text style={styles.threaddes} numberOfLines={3}>
                {data.jobdescription}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 3,
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                  }}
                  onPress={() =>
                    Alert.alert(
                      "Confirm Deletion",
                      "Do you want to delete?",
                      [
                        {
                          text: "Cancel",
                          style: "cancel",
                        },
                        {
                          text: "delete",
                          onPress: () => {
                            handleDeleteJob();
                          },
                        },
                      ],
                      { cancelable: true }
                    )
                  }
                >
                  {deleteindicator ? (
                    <ActivityIndicator size={18} color="red" />
                  ) : (
                    <AntDesign name="delete" size={12} color="red" />
                  )}

                  <Text style={styles.threadowner}> Delete</Text>
                </TouchableOpacity>
                <View style={styles.viewdetails}>
                  {jobreply.length > 0 ? (
                    <>
                      <Text style={{ color: "green" }}>
                        {jobreply.length} response
                      </Text>
                    </>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        ToastAndroid.show(
                          "No responses come back after some minutes",
                          ToastAndroid.SHORT
                        );
                      }}
                    >
                      <Text>no response</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </Pressable>
          </View> */}
        </View>
      </Pressable>
      {expanded && jobreply && jobreply.length > 0 && (
        <View style={styles.responsecontainer}>
          <Text
            style={{ textAlign: "center", paddingVertical: 10, fontSize: 18 }}
          >
            Job Responses
          </Text>
          {jobreply.map((item, index) => (
            <InsideAccorditon key={index} data={item} />
          ))}
        </View>
      )}
    </View>
  );
};

const Threadsavailable = ({ route }) => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [data, setdata] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [email, setemail] = useState();
  const [indicator, setindicator] = useState(false);
  const [token, settoken] = useState(null);
  const router = useRoute();
  const v = false;
  useFocusEffect(
    React.useCallback(() => {
      const handleBackPress = () => {
        if (router.name === "homeCustomer") {
          BackHandler.exitApp();
          return true; // Prevent going back to the previous page
        }
        return false; // Allow the default back action on other screens
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackPress
      );

      return () => {
        backHandler.remove();
      };
    }, [router.name])
  );
  useEffect(() => {
    if (route.params) {
      onRefresh();
    }
  }, [route.params]);
  const custoken = useSelector((state) => state.customerAuth.customertoken);

  useEffect(() => {
    setindicator(true);
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
        setindicator(false);
      } catch (err) {
        setindicator(false);
      }
    };

    fetchData();
  }, [custoken]);

  useEffect(() => {
    if (refreshing) {
      return;
    }
    const fetchjob = async () => {
      if (!email || !token) {
        return;
      }

      try {
        setindicator(true);
        const response = await axios.get(
          `https://direckt-copy1.onrender.com/Customerdata/getreplydata?email=${email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setdata(response.data.result);
        setindicator(false);
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
          showToast("An error occurred. Please try again.");
        }
      }
    };

    fetchjob();
  }, [email, refreshing, token]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true); // Set refreshing to true before fetching data

    setTimeout(() => {
      setRefreshing(false); // Set refreshing back to false after data is fetched
    }, 2000);
  }, []);

  if (indicator) {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size={80} color={COLORS.primary} />
        <Text>Loading...</Text>
      </View>
    );
  }
  if (data.length == 0) {
    return (
      <ScrollView
        style={{
          flex: 1,
          flexDirection: "column",
          backgroundColor: "#E0E5FF",
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: 690,
            padding: 15,
            backgroundColor: "#E0E5FF",
          }}
        >
          <Image
            source={require("../../assets/final3.png")}
            style={{ height: "100%", width: "100%", margin: 0 }}
          />
        </View>
        <View
          style={{
            alignItems: "çenter",
            marginTop: -160,
            backgroundColor: "#E0E5FF",
            marginHorizontal: "35%",
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("Createthread")}
            style={{
              padding: 10,
              width: 120,
              paddingHorizontal: 20,
              backgroundColor: COLORS.primary,
              borderRadius: 5,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MaterialIcons name="add" size={14} color="white" />
            <Text style={{ color: "white" }}> Create Job</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
  return (
   <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <ScrollView
        style={styles.threadcontainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={{ textAlign: "center", marginTop: 10 }}>
          You can only create 5 job at same time.
        </Text>
        <View>
          {data.map((item, index) => (
            <AccordionItem
              key={index}
              data={item}
              token={token}
              onRefresh={onRefresh}
            />
          ))}
        </View>
       
      </ScrollView>
     
    </View>
  );
};

export default Threadsavailable;

const styles = StyleSheet.create({
  titlecontainer: {
    flex: 1,
    flexDirection: "row",
    height: (height * 5) / 100,
    alignItems: "center",
    justifyContent: "center",
  },
  expirationtitle: {
    alignItems: "center",
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderColor: "#f4f5fb",
    justifyContent: "center",
  },
  expireText: {
    color: "grey",
    fontSize: 14,
    color: COLORS.gray,
  },
  threadcontainer: {
    flex: 1,
    height: (height * 85) / 100,
    paddingHorizontal: 10,
    backgroundColor: "#E0E5FF",
  },
  thread: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",

    marginVertical: "3%",
    marginHorizontal: "5%",
    borderRadius: 5,
  },
  threadcardsection: {
    flexDirection: "row",
    alignItems: "center",
  },
  threadImage: {
    width: (width * 35) / 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  threadcategory: {
    paddingVertical: 5,
  },
  threaddetails: {
    flex: 1,
    height: "100%",
    justifyContent: "space-evenly",
    width: (width * 65) / 100,
    padding: 7,
  },
  threadsection: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "flex-start",
    marginRight: 5,
    height: "100%",
    width: "40%",
  },
  threadtitle: {
    fontSize: 16,
    fontWeight: "medium",
    color: COLORS.primary,
  },
  threaddes: {
    fontSize: 12,
    color: "grey",
  },
  threadowner: {
    color: "red",
  },
  viewdetails: {
    padding: 4,
    backgroundColor: "#f4f5fb",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  deactivate: {
    padding: 2,
    backgroundColor: "#f4f5fb",
    borderRadius: 5,
    marginHorizontal: 5,
    fontSize: 12,
  },
  deactivated: {
    padding: 3,
    backgroundColor: "#f4f5fb",
    borderRadius: 5,
    marginHorizontal: 5,
    fontSize: 12,
    color: "red",
  },
  responsecontainer: {
    backgroundColor: "white",
    borderRadius: 5,
  
    marginHorizontal: "5%",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 15,
    justifyContent: "space-evenly",
    padding: 40,
    alignItems: "center",
    shadowColor: "#000",
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
    color: "white",
    fontWeight: "medium",
    textAlign: "center",
  },
  modalText: {
    paddingVertical: 15,
    textAlign: "center",
  },
  backLayer: {
    flexDirection: "row",
    height: 165,
    width: "100%",
    borderRadius: 8, // Ensure child view doesn't overflow
  },
  backLayercontainer: {
    width: "60%",
    height: "100%",
    padding: 10,
    backgroundColor: "red",
    borderRadius: 8,
  },
  jobCard: {
    flex: 1,
    flexDirection: "row",
    height: "100%",
    width: "100%",
    backgroundColor: "white",
    borderWidth: 0.5,
    borderColor: "#D0D0D0",
    borderRadius: 8,
    position: "absolute",
  },
  jobCardTop: {
    flexDirection: "row",
    height: "65%",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  jobDetails: {
    justifyContent: "space-evenly",
  },
  jobTitle: {
    fontSize: 20,
    color: "#8C52FF",
  },
  jobDescription: {
    fontSize: 14,
  },
  expireTime: {
    color: "#444444",
    fontSize: 11,
  },
  jobImage: {
    width: "35%",
    padding: 5,
  },
  image: {
    height: "100%",
    width: "100%",
    borderRadius: 3,
  },
  jobCardBottom: {
    flexDirection: "row",
    height: "35%",
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "space-evenly",
  },
  editJob: {
    backgroundColor: "#8C52FF",
    padding: 8,
    width: "40%",
    borderRadius: 5,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#8C52FF",
  },
  viewResponse: {
    backgroundColor: "white",
    padding: 8,
    width: "40%",
    borderWidth: 2,
    borderColor: "#8C52FF",
    borderRadius: 5,
    alignItems: "center",
  },
  dragBtn: {
    borderWidth: 0.5,
    borderColor: "#D0D0D0",
    borderRadius: 8,
    padding: 2,
    marginBottom: 15,
    backgroundColor: "white",
  },resultcardtop: {
    flexDirection: "row",
    height: 65,
  },
  resultcard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 5,
    elevation: 3,
    margin:10,
  },
  storeprofileImage: {
    padding: 5,
    width: "25%",
    alignItems: "center",
  },
  resultcardtopdetails: {
    flexDirection: "row",
    padding: 5,
    width: "70%",
  },
  resultcardmiddle: {
    paddingHorizontal: 20,
    paddingVertical: 3,
    justifyContent: "space-evenly",
    height: 60,
    borderBottomWidth: 0.19,
    borderColor: "gray",
  },
  resultcardctc: {
    flexDirection: "row",
    marginVertical: 10,
    justifyContent: "space-evenly",
  },
  storename: {
    fontSize: 21,
    fontWeight: "medium",
  },
  storeavailable: {
    padding: 4,
    borderRadius: 5,
    fontSize: 12,
    color: "#00BF63",
  },
  storenotavailable: {
    padding: 4,
    borderRadius: 5,
    fontSize: 12,
    color: "red",
  },
  dropdownItemStyles: {
    color: "red",
  },
});
