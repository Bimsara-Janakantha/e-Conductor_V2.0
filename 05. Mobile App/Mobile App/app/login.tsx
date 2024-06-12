import { StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import Animated, { useAnimatedRef } from 'react-native-reanimated';
import { FontAwesome } from "@expo/vector-icons";

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LogInFormPage1, LogInFormPage2} from "@/components/FormComponents/LoginForm";

export default function LogIn() {

  // Subitting form /////////////////////////////////////////////////////////////////////////////////

  const [phoneNo, setPhoneNo] = useState('');
  const [loading, setLoading] = useState(false);

  // const handleSubmit = async () => {
  //   if (name === '' || phoneNo === '' || dateOfBirth === '') {
  //     // Plese fill the form completely
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     const response = await fetch('http://localhost/api/users' , {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({name, phoneNo, dateOfBirth}),
  //     });

  //     const result = await response.json();

  //     if (response.ok) {
  //       setName('');
  //       setPhoneNo('');
  //       setDateOfBirth('');
  //     }
  //   } catch (error) {
  //     //Error
  //   } finally {
  //     setLoading(false);
  //   }
  // };

// Subitting form /////////////////////////////////////////////////////////////////////////////////

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const [currentPos, setCurrentPos] = useState(0);

  const scrollFoward = () => {
    if (scrollRef.current) {
      const newPos = (currentPos < 300) ? currentPos + 300 : 300;
      scrollRef.current.scrollTo({ x: newPos, y: 0, animated: true });
      setCurrentPos(newPos);
    }
  };

  const scrollBack = () => {
    if (scrollRef.current) {
      const newPos = (currentPos > 0) ? currentPos - 300 : 0;
      scrollRef.current.scrollTo({ x: newPos, y: 0, animated: true });
      setCurrentPos(newPos);
    }
  };

  const submitForm = () => {
    router.replace('/(drawer)/home/tabone');
  };

  const gotoSignUp = () => {
    router.replace('/signup');
  };

  return (
    <ThemedView style={styles.pageBody} lightColor="#fff" darkColor="#222">
      <ThemedView style={styles.formBody}> 
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title" lightColor="#ffb925" darkColor="#ffb925">Log In</ThemedText>
        </ThemedView>

        <Animated.ScrollView 
          ref={scrollRef} 
          scrollEventThrottle={16} 
          horizontal={true} 
          style={styles.formPageContainer} 
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          pointerEvents={'none'}>
          <Animated.View style={styles.formPage}>
            <LogInFormPage1 phoneNo={phoneNo} setPhoneNo={setPhoneNo} />
          </Animated.View>

          <Animated.View style={styles.formPage}>
            <LogInFormPage2 />
          </Animated.View>
        </Animated.ScrollView>

        <ThemedView style={styles.formPageNevContainer}>
          <Pressable style={styles.formPageNevButton} onPress={scrollBack}><ThemedText type="subtitle" lightColor="#000" darkColor="#fff"><FontAwesome name='arrow-left' size={20}/> Back</ThemedText></Pressable>
          <ThemedView style={{width: 100}}></ThemedView>
          <Pressable style={styles.formPageNevButton} onPress={scrollFoward}><ThemedText type="subtitle" lightColor="#000" darkColor="#fff">Next <FontAwesome name='arrow-right' size={20}/></ThemedText></Pressable>
        </ThemedView>

        <ThemedView style={styles.buttonContainer}>
          <Pressable style={styles.submitButton} onPress={submitForm}><ThemedText type="subtitle" lightColor="#fff" darkColor="#fff">Log In</ThemedText></Pressable>
          <Pressable onPress={gotoSignUp}><ThemedText lightColor="#777" darkColor="#777">Don't have an account?</ThemedText></Pressable>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  pageBody: {
    flex: 1,
  },
  formPageContainer: {
    width: 300,
    height: 400,
  },
  formPage: {
    width: 300,
    height: 400,
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 0,
  },
  formPageNevButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#aa00ff',
  },
  formBody: {
    backgroundColor: 'transparent',
    color: "#aa00ff",
    margin: 10,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  titleContainer: {
    backgroundColor: 'transparent',
    padding: 20,
  },
  buttonContainer: {
    backgroundColor: 'transparent',
    marginBottom: 5,
  },
  inputFieldTitle: {
    textAlign: 'left',
    color: '#333',
  },
  submitButton: {
    borderWidth: 0,
    color: '#fff',
    borderRadius: 50,
    padding: 10,
    backgroundColor: '#ff8b2e',
    margin: 10,
    alignItems: 'center',
  },
  formPageNevContainer: {
    width: 300,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'transparent',
  },
  buttonBody: {
    alignItems: 'center',
    backgroundColor: '#ff8b2e',
    marginVertical: 10,
    marginHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 20,
  },
});