import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./components/Home/Home";
import Logincustomer from "./components/CustomerAuthentication/Logincustomer";
import Signupcustomer from "./components/CustomerAuthentication/Signupcustomer";
import UserLogin from "./components/Userauthentication/UserLogin";
import Userregister from "./components/Userauthentication/Userregister";
import Customerhome from "./components/customerhomepage/Customerhome";
import Direcktsvg from "./components/Home/Homesvg";
import { StatusBar } from "react-native";
import { COLORS } from "./constants/Theme";
import CustomerSearchBar from "./components/customerhomepage/Customersearchbar";
import Shopownerhomepage from "./components/ShopownerHomepage/Shopownerhomepage";
import Shopownernav from "./components/ShopownerHomepage/Shopownernavigation";
import EditOwnerProfile from "./components/ShopownerHomepage/Editshopownerprofile";
import StoreProfile from "./components/customerhomepage/Storeprofile";
import CustomerForgetpassword from "./components/CustomerAuthentication/CustomerForgetpassword";
import Customerpassword from "./components/CustomerAuthentication/Customerpassword";
import Shopownerpassword from "./components/Userauthentication/Shopownerchangepassword";
import ShopownerForgetpassword from "./components/Userauthentication/Shopownerforgetpassword";
import UserVerification from "./components/Userauthentication/UserVerification";
import CustomerVerification from './components/CustomerAuthentication/CustomerVerification';
import rootReducer  from "./redux/rootReducer"
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

import * as SecureStore from 'expo-secure-store';
import CustomerAccountDelete from './components/customerhomepage/CustomerAccountDelete';
import ShopOwnerAccountDelete from './components/ShopownerHomepage/ShopOwnerAccountDelete';
import ReportShop from './components/customerhomepage/ReportShop';
import Editjob from './components/customerhomepage/Editjob';
const Stack = createStackNavigator();
const store = configureStore({reducer: rootReducer});


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
     
      return;
    }
  
    
    Notifications.getExpoPushTokenAsync({
      projectId: "0c12957b-d59b-4237-9a10-5ef2a34ecd3c",
    }).then(response => {
      token = response.data;
      SecureStore.setItemAsync('devicetoken', token)
        .then(() => {
        
        })
        .catch(error => {
         
        });
    }).catch(error => {
      
    });
  } else {
    return;
  }

  return token;
}

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
 
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
    
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar hidden={false} backgroundColor={COLORS.primary}/>
        <Stack.Navigator initialRouteName="Direcktsvg">
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Logincustomer"
            component={Logincustomer}
            options={{ headerTransparent: true, title: "" }}
          />
          <Stack.Screen
            name="Signupcustomer"
            component={Signupcustomer}
            options={{ headerTransparent: true, title: "" }}
          />
          <Stack.Screen
            name="Userlogin"
            component={UserLogin}
            options={{ headerTransparent: true, title: "" }}
          />
          <Stack.Screen
            name="Userregister"
            component={Userregister}
            options={{ headerTransparent: true, title: "" }}
          />
          <Stack.Screen
            name="CustomerForgetpassword"
            component={CustomerForgetpassword}
            options={{ headerTransparent: true, title: "" }}
          />
          <Stack.Screen
            name="Customerhome"
            component={Customerhome}
            options={{ headerShown:false }}
          />
          <Stack.Screen
            name="Shopownerhomepage"
            component={Shopownerhomepage}
            options={{ headerShown:false }}
          />
          <Stack.Screen
            name="Direcktsvg"
            component={Direcktsvg}
            options={{ headerShown:false }}
          />
          <Stack.Screen
            name="Customersearchbar"
            component={CustomerSearchBar}
            options={{ headerShown:false }}
          />
          <Stack.Screen
            name="Shopownernav"
            component={Shopownernav}
            options={{ headerShown:false }}
          />
          <Stack.Screen
            name="EditOwnerProfile"
            component={EditOwnerProfile}
            options={{ headerShown:false }}
          />
          <Stack.Screen
            name="storeprofile"
            component={StoreProfile}
            options={{ headerShown:false }}
          />
          <Stack.Screen
            name="Customerpassword"
            component={Customerpassword}
            options={{ headerShown:false }}
          />
          <Stack.Screen
            name="Shopownerchangepassword"
            component={Shopownerpassword}
            options={{ headerShown:false }}
          />
          <Stack.Screen
            name="Shopownerforgotpassword"
            component={ShopownerForgetpassword}
            options={{ headerShown:false }}
          />
            <Stack.Screen
            name="CustomerVerification"
            component={CustomerVerification}
            options={{ headerShown:false }}
          />
          <Stack.Screen
            name="UserVerification"
            component={UserVerification}
            options={{ headerShown:false }}
          />
          <Stack.Screen
            name="ShopOwnerAccountDelete"
            component={ShopOwnerAccountDelete}
            options={{ headerShown:false }}
          />
          <Stack.Screen
            name="CustomerAccountDelete"
            component={CustomerAccountDelete}
            options={{ headerShown:false }}
          />
          <Stack.Screen
            name="ReportShop"
            component={ReportShop}
            options={{ headerShown:false }}
          />
            <Stack.Screen
            name="Editjob"
            component={Editjob}
            options={{ headerShown:false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

