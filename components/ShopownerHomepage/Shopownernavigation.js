
import {
    View,

    Image
  } from "react-native";
  import React from "react";
 
  import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
  
  
  import { Ionicons } from "@expo/vector-icons";
  import { COLORS } from "../../constants/Theme";

import Shopownerprofile from "./Shopownerprofile";
import Shopownerhomepage from "./Shopownerhomepage";


 
const Shopownernav = () => {
    


  
    const Tab = createBottomTabNavigator();
    return (
      <View style={{ flex: 1 }}>
       
           <View style={{width:'100%',height:'10%',alignItems:'flex-start',justifyContent:'center',backgroundColor: COLORS.primary,}} >
              <Image
                source={
                  require('../../assets/headerlogo.png')
                }
                style={{height:100,width:100,marginHorizontal:20}}
              />
            </View>
   
        <View style={{ flex: 1 }}>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
  
                if (route.name === "homeshopowner") {
                  iconName = focused ? "ios-home" : "ios-home-outline";
                } else if (route.name === "Shopownerprofile") {
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
              name="homeshopowner"
              component={Shopownerhomepage}
              options={{ tabBarLabel: "Home", headerShown: false }}
            />
            <Tab.Screen
              name="Shopownerprofile"
              component={Shopownerprofile}
              options={{ tabBarLabel: "Profile", headerShown: false }}
            />
           
          </Tab.Navigator>
        </View>
      </View>
    );
  };

  export default Shopownernav