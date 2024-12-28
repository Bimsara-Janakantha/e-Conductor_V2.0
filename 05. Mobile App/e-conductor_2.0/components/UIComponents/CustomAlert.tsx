import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Pressable, GestureResponderEvent } from 'react-native';
import Modal from 'react-native-modal';

type Props = {
    isVisible: boolean;
    onClose: (event: GestureResponderEvent) => void;
}

const CustomAlert = ({ isVisible, onClose }: Props) => {
  return (
    <Modal isVisible={isVisible}>
      <View style={styles.modalContent}>
        <Text style={styles.title}>Error</Text>
        <Text style={styles.message}>Failed to fetch tickets</Text>
        <Pressable onPress={onClose} ><Text>Close</Text></Pressable>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
  },
});

export default CustomAlert;
