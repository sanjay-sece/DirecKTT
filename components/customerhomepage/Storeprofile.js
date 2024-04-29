import { StyleSheet, Text, View, ScrollView , TouchableOpacity, Dimensions, Image, Linking, ActivityIndicator, ToastAndroid } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { React , useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigation } from "@react-navigation/native";
import { useRoute } from '@react-navigation/native';
import ImagePopup from '../ShopownerHomepage/Imagepopup';
import * as SecureStore from "expo-secure-store";
const height = Dimensions.get("window").height


const StoreProfile = () => {
    const route = useRoute();
    const { _id } = route.params;

    const [storedata, setstoredata] = useState();
    const [showPopup, setShowPopup] = useState(false);

    const [activeImageIndex, setActiveImageIndex] = useState(null);
    const [token, settoken] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        SecureStore.getItemAsync("customertoken")
            .then((value) => {
            
                settoken(value);
            })
            .catch((error) => {});
    }, [])

    const handleImagePress = (index) => {
        setActiveImageIndex(index);
    };

    const handleClosePopup = () => {
        setActiveImageIndex(null);
    };

    const showToast = (e) => {
        ToastAndroid.show(e, ToastAndroid.SHORT);
    };

    useEffect(() => {
        if (!token || !_id) {
            return;
        }
       
        try {
            axios.get(`https://direckt-copy1.onrender.com/shopowner/getshopownerprofile?_id=${_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            )

                .then(response => {

                    setstoredata(response.data)

                })
                .catch(err => {
                  
                });
        } catch (error) {
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
    }, [_id, token]);
    if (!storedata && _id) {
        return (
            <View style={{ height: "100%", width: '100%', justifyContent: "center", alignItems: 'center' }}>
                <ActivityIndicator color={'purple'} size={67} />
                <Text>Loading store details</Text>
            </View>
        )
    }
    return (
        <ScrollView
            style={styles.container}
        >
            <View
                style={styles.headercontainer}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}
                >
                    <Ionicons name="arrow-back" size={30} color="#8A57E4" />
                </TouchableOpacity>
                <View style={styles.profilecontainer}>
                    <TouchableOpacity
                        onPress={() => setShowPopup(true)}
                    >
                        {storedata.profilepic ? <Image
                            source={{
                                uri: storedata.profilepic,
                            }}
                            style={styles.headerprofileImage}
                        /> : <Image
                            source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3u_DGIWouUwuaqQE88-nun_n2h-Pb2yRQXQ&usqp=CAU', }}
                            style={styles.headerprofileImage}
                        />
                        }
                    </TouchableOpacity>
                    {showPopup && (
                        <ImagePopup
                            imageUrl={storedata.profilepic}
                            onClose={() => setShowPopup(false)}
                        />
                    )}
                </View>
            </View>
            <View style={styles.bodycontainer}>
                <View >
                    <Text style={styles.bodyshopname} numberOfLines={2}>{storedata.businessname}</Text>
                </View>
                <View>
                    <Text style={styles.bodyshopdescription}>{storedata.businessabout ? storedata.businessabout : "There is no description available for this shop"}</Text>
                </View>

                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    {storedata.deliverystatus ? (
                        <Text>Delivery:<Text style={{ color: 'green' }}> YES</Text></Text>
                    ) : (
                        <Text>Delivery:<Text style={{ color: 'red' }}> NO</Text></Text>
                    )}
                </View>


            </View>
            <View style={styles.ctccontainer}>
                <View style={styles.ctccard}>
                    <View style={styles.ctcsection}>
                        <View style={storedata.availabilitystatus  ? [styles.storestatus, styles.ctcicon] : [styles.storestatusoff, styles.ctcicon]}>
                            {storedata.availabilitystatus ? <MaterialCommunityIcons name="store-check" size={42} color="white" /> : <MaterialCommunityIcons name="store-remove" size={42} color="white" />}
                        </View>
                        {storedata.availabilitystatus ? <Text style={{ fontSize: 10 }}>Store: Open</Text> : <Text style={{ fontSize: 10 }}>Store: Closed</Text>}
                    </View>
                    <View style={styles.ctcsection}>
                        <TouchableOpacity onPress={() => { Linking.openURL(`tel:${storedata.phonenumber}`) }}
                            style={[styles.ctcicon, styles.ctccall]}>
                            <MaterialIcons name="phone-in-talk" size={42} color="#5271FF" />
                        </TouchableOpacity >
                        <Text style={{ fontSize: 10 }}>Call Now</Text>
                    </View>
                    <View style={styles.ctcsection}>
                        <TouchableOpacity
                            onPress={() => {
                                storedata.gmaplink ? Linking.openURL(storedata.gmaplink) : showToast('Google map is not linked');
                            }}
                            style={[styles.ctcicon, styles.ctcdirection]}>
                            <FontAwesome5 name="directions" size={42} color="#5271FF" />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 10 }}>View Shop</Text>
                    </View>
                </View>
            </View>
            <View style={styles.otherdetails}>
                <View style={styles.detailitem}>
                    <Text style={styles.shopdetailstitle}>Location</Text>
                    <View style={styles.shopdetailsbox}>
                        <Text style={styles.shopdetailsvalue} numberOfLines={1}>{storedata.location ? storedata.location : "- no location -"}</Text>
                    </View>
                </View>
                <View style={styles.detailitem}>
                    <Text style={styles.shopdetailstitle}>Address</Text>
                    <View style={styles.shopdetailsbox}>
                        <Text style={styles.shopdetailsvalue} numberOfLines={2}>{storedata.address ? storedata.address : '- no address -'}</Text>
                    </View>
                </View>
                <View style={styles.detailitem}>
                    <Text style={styles.shopdetailstitle}>Delivery or Servicable Locations</Text>
                    <View style={styles.shopdetailsbox}>
                        <Text style={styles.shopdetailsvalue} numberOfLines={2}>{storedata.deliverylocation ? storedata.deliverylocation : '- no delivery or servicable locations -'}</Text>
                    </View>
                </View>
                <View style={styles.detailitem}>
                    <Text style={styles.shopdetailstitle}>Product or Services</Text>
                    <View style={styles.shopdetailsbox}>
                        <View style={styles.deliverylocationContainer}>
                            {storedata.category.map((item, index) => (
                                <View key={index} style={styles.locations}>
                                    <Text>{item}</Text>
                                </View>
                            ))
                            }
                            {storedata.category == 0 && <View><Text>- no product or service available -</Text></View>}
                        </View>
                    </View>
                </View>

                <View style={styles.detailitem}>
                    <Text style={styles.shopdetailstitle}>Mobile number</Text>
                    <View style={styles.shopdetailsbox}>
                        <Text style={styles.shopdetailsvalue}>{storedata.phonenumber}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.shopImages}>
                <Text style={styles.heading}>Photos</Text>
                <ScrollView style={styles.imagecontainer} horizontal={true}>
                    {storedata.photos.map((item, index) => (
                        <View key={index}>
                            <TouchableOpacity
                                style={styles.jobImage}
                                onPress={() => handleImagePress(index)}
                            >
                                <Image
                                    source={{ uri: item }}
                                    style={{ height: 100, width: 100, backgroundColor: 'black', marginRight: 10, borderRadius: 5 }}
                                />
                            </TouchableOpacity>
                        </View>
                    ))
                    }
                    {storedata.photos.length == 0 ? <View style={styles.addimagecard}><Text style={{ textAlign: 'center', fontSize: 10, color: 'grey' }}>No Image found</Text></View> : <></>}
                    {activeImageIndex !== null && (
                        <ImagePopup
                            imageUrl={storedata.photos[activeImageIndex]}
                            onClose={handleClosePopup}
                        />
                    )}
                </ScrollView>
            </View>
            <TouchableOpacity 
            style={{flexDirection:'row',paddingHorizontal:40,paddingVertical:30,alignItems:'center',gap:10,borderBottomWidth: 0.5,borderColor: 'gray',}}
            onPress={()=>{
                navigation.navigate('ReportShop',{shopownerid:_id,shopname:storedata.businessname});
            }}
            >
                <MaterialIcons name="report" size={35} color="black" />
                <Text style={{fontSize:15}}>Report Shopowner</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

export default StoreProfile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
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
        height: (height * 20) / 100,
        paddingHorizontal: 25,
        marginTop: -10,
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
    bodydelivery: {
        textAlign: 'center',
    },
    imagecontainer: {
        flex: 1,
        flexDirection: 'row'
    },
    ctccontainer: {
        flex: 1,
        height: (height * 14) / 100,
        paddingHorizontal: '4%',
    },
    ctccard: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 90,
        backgroundColor: 'white',
        borderRadius: 30,
        elevation: 3,
        paddingHorizontal: 18,
    },
    ctcsection: {
        width: '33%',
        height: '80%',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    ctcicon: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        width: 70,
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
    ctccall: {
        borderColor: '#5271FF',
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
        elevation: 4,
        shadowOffset: {
            width: 1,
            height: 1
        },
        shadowColor: "grey",
        backgroundColor: "red",
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
        height: (height * 25) / 100,
        paddingHorizontal: 30,
        paddingVertical: 20,
    },
    heading: {
        padding: 10,
        fontWeight: 'medium',
    }, 
    otherdetails: {
        flex: 1,
        paddingHorizontal: 30,
        paddingVertical: 10,
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
        padding: 8,
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
        height: (height * 55) / 100,
        padding: 20,
    },
    footertitle: {
        fontSize: 18,
        fontWeight: 'medium',
        paddingHorizontal: 20,
    },
    sociallinks: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        paddingHorizontal: 20,
    },
    aboutlist: {
        height: (height * 30) / 100,
        justifyContent: 'space-evenly',
    },
    aboutdetails: {
        flexDirection: 'row',
        padding: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: 'grey',
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