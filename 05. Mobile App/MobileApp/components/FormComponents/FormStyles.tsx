import { StyleSheet } from 'react-native';

export const formStyles = StyleSheet.create({
    formError: {
      color: 'transparent',
      marginBottom: 5,
    },

    inputField: {
      width: 280,
      color: '#333',
      borderRadius: 20,
      borderWidth: 2,
      borderColor: 'transparent',
      paddingHorizontal: 10,
      paddingVertical: 5,
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

    inputDropdown: {
      width: 280,
      color: '#333',
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: -10,
      marginBottom: 10,
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
      backgroundColor: '#3bf',
      marginHorizontal: 50,
      marginVertical: 10,
      alignItems: 'center',
    }
  });