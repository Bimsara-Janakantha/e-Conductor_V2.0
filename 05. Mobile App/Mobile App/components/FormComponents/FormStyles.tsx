import { StyleSheet } from 'react-native';

export const formStyles = StyleSheet.create({
    formError: {
      color: 'red',
    },

    inputField: {
      width: 280,
      color: '#333',
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 5,
      marginBottom: 10,
      backgroundColor: '#fff',
      elevation: 3,
    },

    inputFieldInvalid: {
      width: 280,
      borderWidth: 2,
      borderColor: 'red',
      color: '#333',
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 5,
      backgroundColor: '#fff',
      elevation: 3,
    },

    timer: {
      alignSelf: 'center',
      backgroundColor: 'transparent',
    },
    
    resendOTPButton: {
      borderWidth: 0,
      color: '#fff',
      borderRadius: 50,
      paddingVertical: 10,
      backgroundColor: '#ffb925',
      marginHorizontal: 50,
      marginVertical: 10,
      alignItems: 'center',
    }
  });