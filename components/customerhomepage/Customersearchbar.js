import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,

  TouchableOpacity,
  Linking,
  useColorScheme,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign, FontAwesome5} from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native";
import { TextInput } from "react-native";
import { Feather,Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { SelectList } from "react-native-dropdown-select-list";
import Checkbox from "expo-checkbox";
import axios from "axios";
import { LinearProgress } from "@rneui/base";
import { COLORS } from "../../constants/Theme";
import ImagePopup from "../ShopownerHomepage/Imagepopup";
import * as SecureStore from "expo-secure-store";
import { FlatList } from "react-native-gesture-handler";
const height = Dimensions.get("window").height;

const Shopcard = ({ data, index }) => {
  const colorScheme = useColorScheme();
  const [showPopup, setShowPopup] = useState(false);
  const navigation = useNavigation();
  const showToast = () => {
    ToastAndroid.show('Google map is not linked', ToastAndroid.SHORT);
  };

  return (
    <View style={styles.resultcard} key={index}>
      <View style={styles.resultcardtop}>
        <View style={styles.storeprofileImage}>
          <TouchableOpacity
            style={{ height: "100%", width: "80%", borderRadius: 5 }}
            onPress={() => setShowPopup(true)}
          >
            {data.profilepic ? <Image
              source={{
                uri: data.profilepic,
              }}
              style={{ height: "100%", width: "100%", borderRadius: 5 }}
            /> : <Image
              source={require('../../assets/shop.png')}
              style={{ height: "100%", width: "100%", borderRadius: 5 }}
            />
            }
          </TouchableOpacity>
        </View>

        {showPopup && (
          data.profilepic ? <ImagePopup
            imageUrl={data.profilepic}
            onClose={() => setShowPopup(false)}
          /> : <></>
        )}

        <View style={styles.resultcardtopdetails}>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text
              style={[
                styles.storename,

              ]}
              numberOfLines={1}
            >
              {data.businessname}
            </Text>
            {data.availabilitystatus ? (
              <Text style={styles.storeavailable}>Store is Open</Text>
            ) : (
              <Text style={styles.storenotavailable}>Store Closed</Text>
            )}
          </View>
          <TouchableOpacity
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
            onPress={() => {
              navigation.navigate("storeprofile", { _id: data._id});
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
        <Text
          style={{ color: "grey", fontSize: 13, marginVertical: 5 }}
          numberOfLines={2}
        >
          {data.businessabout ? data.businessabout : "There is no description available for this shop"}
        </Text>
        <ScrollView
          style={{ flexDirection: "row", marginVertical: 6 }}
          horizontal={true}
        >
          {data.category.map((item, index) => {
            return (
              <View key={index}>
                <Text
                  style={{
                    padding: 4,
                    backgroundColor:
                      colorScheme === "dark" ? "grey" : "#FAF9F9",
                    color: colorScheme === "dark" ? "black" : "black",
                    borderRadius: 5,
                    fontSize: 13,
                    marginHorizontal: 2,
                  }}
                >
                  {item}
                </Text>
              </View>
            );
          })}
        </ScrollView>
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
          onPress={() => { Linking.openURL(`tel:${data.phonenumber}`) }}
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
            data.gmaplink ? Linking.openURL(data.gmaplink) : showToast()
          }}
        >
          <Text style={{ color: "white" }}>Direction </Text>
          <FontAwesome5 name="directions" size={13} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const CustomerSearchBar = () => {
  const navigation = useNavigation();

  const colorScheme = useColorScheme();
  const [businessname, setbusinessname] = useState("");
  const [category, setcategory] = useState(null);
  const [availabilitystatus, setavailabilitystatus] = useState(false);
  const [shopowner, setshopowner] = useState([]);
  const [progress, setProgress] = useState(0);
  const [linearProgress, setlinearProgress] = useState(false);
  const [resultmessage, setresultmessage] = useState("Find shop and service")
  const [token, settoken] = useState(null);
  const [choosedata, setChooseData] = useState([{key:'1', value:'loading...', disabled:true}]);
  const[jobselection,setjoblocation] = useState(null)
 
  useEffect(() => {
    fetchDatacategory(); // Fetch choosedata when the component mounts
  }, []);

  const fetchDatacategory= async () => {
    try {
      const response = await axios.get("https://direckt-copy1.onrender.com/direckt/getcategory");
      const dataFromBackend = response.data;
   
      if (Array.isArray(dataFromBackend) && dataFromBackend.length > 0) {
      
        const formattedData = dataFromBackend[0]?.categories.map(category => ({
          key: category.key,
          value: category.value
        })) || [];
       
        setChooseData(formattedData);
      } else {
        
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
        // Non-Axios error
       
        showToast("An error occurred. Please try again.");
      }
    }
  };
  
  

  const showToast = (e) => {
    ToastAndroid.show(e, ToastAndroid.SHORT);
};
  useEffect(()=>{
    SecureStore.getItemAsync("customertoken")
      .then((value) => {
        settoken(value);
      })
      .catch((error) => {});
  }, [])

  const fetchData = async () => {
    if(!jobselection){
      showToast('Select Location ');
      return;
    }
    if ((!businessname && !category) || !jobselection) {
      showToast("Businessname or Category is required");
      return;
    }
    if(businessname){
      setbusinessname(businessname.trim())
    }
    try {
      setlinearProgress(true);

      setProgress(0.15);
      let formdata = {
        businessname: businessname.trim(),
        location:jobselection
      };

      if (category) {

        formdata.category = category;
      }

      if (availabilitystatus) {
        formdata.availabilitystatus = availabilitystatus;
      }
 
      const response = await axios.get(
        "https://direckt-copy1.onrender.com/shopowner/getshops",
        {
          params: formdata,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.length === 0) {
        setresultmessage('No Shops or service found')
      }
      setshopowner(response.data);
      setProgress(1);
      setTimeout(() => {
        setlinearProgress(false);
      }, 2000);
    } catch (error) {
      
      setlinearProgress(false);
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
  
  const [isNavigating, setIsNavigating] = useState(false);

  const handleNavigateBack = () => {
    if (!isNavigating) {
      setIsNavigating(true);
      navigation.goBack();
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.searchcontainer}>
        <View
          style={[
            styles.searchbar,
            { backgroundColor: "white" },
          ]}
        >
          <TouchableOpacity
            onPress={() => {
             handleNavigateBack();
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#8A57E4" />
          </TouchableOpacity>
          <TextInput
            style={styles.searchinput}
            placeholder={"Search shops near you..."}
            value={businessname}
            onChangeText={(e) => setbusinessname(e)}
            onSubmitEditing={fetchData}
          />
          <TouchableOpacity onPress={fetchData}>
            <Feather name="search" size={30} color="#8A57E4" />
          </TouchableOpacity>
        </View>
        
       <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            justifyContent:'flex-start',
              columnGap: 10,
             marginLeft:20,
              width:'100%',
          
            }}
          >
            <Text style={{ color: colorScheme === "dark" ? "grey" : "grey" }}>
              Shop open
            </Text>
            <Checkbox
              value={availabilitystatus}
              onValueChange={setavailabilitystatus}
              color={availabilitystatus ? "#3C4142" : undefined}
              style={{height:30,width:30}}
            />
          </View> 
        <View style={styles.filtercontainer}>
         
           <View style={{ width: "45%" }}>
            <SelectList
             setSelected={(val) => setjoblocation(val)}
              data={chooselocation}
              save="value"
              placeholder="Location"
              dropdownTextStyles={{ color: "grey" }}
              inputStyles={{ color: "grey" }}
              closeicon={<AntDesign name="close" size={30}color={COLORS.gray} />}
            />
          </View>
          <View style={{ width: "45%" }}>
            <SelectList
              setSelected={(val) => setcategory(val)}
              data={choosedata}
              save="value"
              placeholder="category"
              dropdownTextStyles={{ color: "grey" }}
              inputStyles={{ color: "grey" }}
              closeicon={<AntDesign name="close" size={30} color={COLORS.gray} />}
            />
          </View>
          
        </View>
        {linearProgress && (
          <LinearProgress
            value={progress}
            variant="determinate"
            color={COLORS.primary}
          />
        )}
      </View>

      <FlatList
      style={[
        styles.resultcontainer,
        { backgroundColor: "#F7F9FF" },
      ]}
      data={shopowner}
      keyExtractor={(item, index) => index.toString()}
      ListEmptyComponent={() => (
        <View>
          <Text style={{ textAlign: 'center' }}>
            {resultmessage + "..."}
          </Text>
        </View>
      )}
      renderItem={({ item, index }) => (
        <Shopcard data={item} key={index} />
      )}
    />
    </View>
  );
};

export default CustomerSearchBar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchcontainer: {
    paddingTop: 50,
    padding: 20,
    justifyContent: "space-evenly",
    gap: 20,
    backgroundColor: "white",
  },
  searchbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    elevation: 5,
    borderRadius: 10,
    shadowColor: "grey",
  },
  searchinput: {
    height: "100%",
    width: "75%",
    paddingHorizontal: 9,
  },
  filtercontainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  filter: {
    flexDirection: "row",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "grey",
    width: "45%",
    justifyContent: "center",
    alignItems: "center",
  },

  resultcontainer: {
    flex: 1,
    height: (height * 76) / 100,
    padding: 20,
  },
  resultcardtop: {
    flexDirection: "row",
    height: 65,
  },
  resultcard: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "white",
    borderRadius: 5,
    elevation: 1,
    marginVertical: "2%",
    paddingHorizontal: 5,
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
    height: 70,
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
