import {
    View,
    Text,
    Dimensions,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    ToastAndroid,
    Modal,
    Pressable
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { COLORS } from "../../constants/Theme";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, Feather } from '@expo/vector-icons';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from 'expo-secure-store';
import { clearCustomerToken } from "../../redux/customerAuthActions";
import { connect } from "react-redux";
import { setCustomerToken } from "../../redux/customerAuthActions";

const Width = Dimensions.get("window").width;
const Height = Dimensions.get("window").height;


const ShopOwnerAccountDelete = ({ route }) => {
    const navigation = useNavigation();

    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
 
    const dispatch = useDispatch();
    useEffect(() => {
        if (route.params) {
            setemail(route.params.email || '');
        }
    }, [route.params]);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((e) => !e);
    };


    const deleteaccount = async () => {
        if (!email) {
            showToast('Please enter your email!');
            return;
        }

        if (!validateEmail(email)) {
            showToast('Please enter a valid email address');
            return;
        }

        if (!password) {
            showToast('Please enter your password!');
            return;
        }

        setLoading(true);

        const formDataLogin = { email, password };

        try {
            const response = await axios.post(
                "https://direckt-copy1.onrender.com/auth/deleteshopowner",
                formDataLogin,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

   


                dispatch(clearCustomerToken());
                await SecureStore.deleteItemAsync("customertoken");
                await AsyncStorage.removeItem("customerdata");
             
                showToast("Account Deleted Permanenlty!");
                navigation.navigate("Home");
         
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
        } finally {
            setLoading(false);
        }
    };

    const showToast = (e) => {
        ToastAndroid.show(e, ToastAndroid.SHORT);
    };
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <View style={styles.box1}>
                <Text style={{fontSize:30,fontWeight:'600'}}>Account Deletion</Text>
                    <Text style={styles.box1text}>*Account cannot be recovered once deleted*</Text>
                </View>
                <View style={styles.box2}>
                    <TextInput
                        style={styles.box2input}
                        placeholder="Email"
                        value={email}
                        onChangeText={(text) => setemail(text)}
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.box2input}
                        placeholder="Password"
                        value={password}
                        onChangeText={(text) => setpassword(text)}
                        secureTextEntry={!isPasswordVisible}
                        autoCapitalize="none"
                    />
                    <TouchableOpacity onPress={togglePasswordVisibility} >
                        <Text style={{ color: "grey" }} >{isPasswordVisible ? <FontAwesome name="eye-slash" size={13} color="grey" /> : <FontAwesome name="eye" size={13} color="grey" />} {isPasswordVisible ? 'Hide Password' : 'Show Password'}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.box3}>
                    {loading && (
                        <View style={styles.activityIndicatorContainer}>
                            <ActivityIndicator size="large" color={COLORS.primary} />
                        </View>
                    )}
                    <TouchableOpacity underlayColor="white" onPress={deleteaccount}>
                        <View style={styles.box3opacity}>
                            <Text
                                style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
                            >
                                Delete Account
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ShopOwnerAccountDelete;
const styles = StyleSheet.create({
    box1: {
        flex: 3,
        paddingLeft: (Width * 13) / 100,
        justifyContent: "flex-end",
        gap:10,
    },
    box2: {
        flex: 2,
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    box3: {
        flex: 3,
        gap: 30,
        alignItems: "center",
    },
    box1text: {
        fontSize: 13,
        color: 'grey',
    },
    box2input: {
        borderColor: "grey",
        borderWidth: 1,
        width: (Width * 75) / 100,
        height: 50,
        borderRadius: 5,
        paddingLeft: 10,
        fontSize: 18,
    },
    box3opacity: {
        width: (Width * 75) / 100,
        backgroundColor: COLORS.primary,
        paddingVertical: 17,
        borderRadius: 5,
        alignItems: "center",
    },
    box3signin: {
        color: "white",
        fontSize: 23,
    }, centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
});
