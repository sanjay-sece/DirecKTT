import React, { useState, useRef,} from 'react';
import { View, Modal, Image, TouchableOpacity, StyleSheet, Text, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';


const ImagePopup = ({ imageUrl, onClose }) => {
  const [modalVisible, setModalVisible] = useState(true);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
        onClose(); 
      }}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            setModalVisible(false);
            onClose();
          }}
        >
          <AntDesign name="close" size={24} color="white" />
        </TouchableOpacity>
        <Image source={{ uri: imageUrl }} style={styles.image} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
    zIndex: 1,
    color: 'white',
  },
  imageContainer: {
    width: 330,
    height: 330,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default ImagePopup;