import {
  View,
  Text,

  Dimensions,
  StyleSheet,
  TouchableOpacity,

} from "react-native";
import React  from "react";
import {

  useNavigation,

} from "@react-navigation/native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Profile from "./Profile";
import { Ionicons, Feather} from "@expo/vector-icons";
import { COLORS } from "../../constants/Theme";
import Createthread from "./Createthread/Createthread";
import Threadsavailable from "./Threadsavailable";

const Width = Dimensions.get("window").width;


const Customerhome = () => {
  const navigation = useNavigation();



  const handleFocus = () => {

    navigation.navigate("Customersearchbar");

  };


  const Tab = createBottomTabNavigator();
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          width: "100%",
          height: "10%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: COLORS.primary,
        }}
      >
        <TouchableOpacity style={styles.searchbar} onPress={handleFocus}>
          <Text style={styles.searchinput}>Search shops near you...</Text>
          <Feather name="search" size={30} color="black" />
        </TouchableOpacity>

      </View>

      <View style={{ flex: 1 }}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === "homeCustomer") {
                iconName = focused ? "ios-home" : "ios-home-outline";
              } else if (route.name === "Createthread") {
                iconName = focused
                  ? "ios-add-circle"
                  : "ios-add-circle-outline";
              } else if (route.name === "Customerprofile") {
                iconName = focused ? "ios-person" : "ios-person-outline";
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarLabelStyle: {
              fontSize: 12,
            },
            tabBarActiveTintColor: COLORS.primary,
            tabBarInactiveTintColor: "gray",
            tabBarShowLabel: true,
            tabBarStyle: {
              borderTopWidth: 0,
              borderTopColor: "gray",
              paddingBottom: 8,
              height: 60,
              
            },
          })}
        >
          <Tab.Screen
            name="homeCustomer"
            component={Threadsavailable}
            options={{ tabBarLabel: "Home", headerShown: false }}
          />
          <Tab.Screen
            name="Createthread"
            component={Createthread}
            options={{ tabBarLabel: "Create", headerShown: false }}
          />
          <Tab.Screen
            name="Customerprofile"
            component={Profile}
            options={{ tabBarLabel: "Profile", headerShown: false }}
          />
        </Tab.Navigator>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  box1: {
    backgroundColor: COLORS.primary,
    height: 100,
    width: Width,
  },
  searchbar: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    height: 50,
    backgroundColor: "white",
    elevation: 5,
    borderRadius: 10,
    shadowOffset: {
      height: 2,
      width: 2,
    },
    shadowColor: "black",
  },
  searchinput: {
    color: COLORS.gray
  },
});
export default Customerhome;
