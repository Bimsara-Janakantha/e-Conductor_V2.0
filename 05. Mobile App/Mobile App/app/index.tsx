import { View, Image, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";
import React from "react";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import { useRef } from "react";

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function Index() {
  /*
  const [inputs, setInputs] = useState({})
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const [currentPos, setCurrentPos] = useState(0);

  const scrollFoward = () => {
    if (scrollRef.current) {
      const newPos = (currentPos < 400) ? currentPos + 200 : 400;
      scrollRef.current.scrollTo({ x: newPos, y: 0, animated: true });
      setCurrentPos(newPos);
    }
  };

  const scrollBack = () => {
    if (scrollRef.current) {
      const newPos = (currentPos > 0) ? currentPos - 200 : 0;
      scrollRef.current.scrollTo({ x: newPos, y: 0, animated: true });
      setCurrentPos(newPos);
    }
  };

  const submitForm = () => {
    router.replace('/(drawer)/home/tabone');
  };

  const gotoLogin = () => {
    router.replace('/login');
  };

  const handleChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}));
  }
  
  */

  return (
      /* 

            <Animated.ScrollView 
              ref={scrollRef} 
              scrollEventThrottle={16} 
              horizontal={true} 
              style={styles.scrollableTabContainer} 
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              pointerEvents={'none'}>
                <Animated.View style={styles.scrollableTab}>
                  <GestureHandlerRootView>
                    <ThemedText lightColor="#777" darkColor="#777">Email</ThemedText>
                    <TextInput style={styles.inputField} placeholder="Enter your email" onChange={handleChange} pointerEvents={'auto'}/>
                    <ThemedText lightColor="#777" darkColor="#777">Password</ThemedText>
                    <TextInput style={styles.inputField} placeholder="Enter your password" onChange={handleChange} pointerEvents={'auto'}/>
                  </GestureHandlerRootView>
                </Animated.View>
                <Animated.View style={styles.scrollableTab}>
                  <ThemedText darkColor="#269">Try me</ThemedText>
                </Animated.View>
                <Animated.View style={styles.scrollableTab}>
                  <ThemedText darkColor="#f53">Try me</ThemedText>
                </Animated.View>
            </Animated.ScrollView>

            <ThemedView style={styles.buttonContainer}>
              <Pressable style={styles.scrollableTabButton} onPress={scrollBack}><ThemedText type="subtitle">Back</ThemedText></Pressable>
              <Pressable style={styles.scrollableTabButton} onPress={scrollFoward}><ThemedText type="subtitle">Next</ThemedText></Pressable>
            </ThemedView>
            
            <Pressable style={styles.submitButton} onPress={submitForm}>
              <ThemedText type="subtitle" lightColor="#fff" darkColor="#fff">Sign Up</ThemedText>
            </Pressable>


       */
      <ThemedView style={styles.pageBody} lightColor="#fff" darkColor="#222">
        <ThemedView style={styles.titleContainer}>
          <Image
            source={require('@/assets/images/logo.jpg')}
            style={styles.logo}
          />
          <ThemedText type="title" lightColor="#ffb925" darkColor="#ffb925">e-conductor</ThemedText>
        </ThemedView>
        <ThemedView style={styles.buttonContainer}>
          <Link href="/signup" asChild>
            <Pressable style={styles.buttonBody}>
              <ThemedText type="buttonText" lightColor="#fff" darkColor="#fff">Sign Up</ThemedText>
            </Pressable>
          </Link>
          <Link href="/login" asChild>
            <Pressable style={styles.buttonBody}>
              <ThemedText type="buttonText" lightColor="#fff" darkColor="#fff">Log In</ThemedText>
            </Pressable>
          </Link>
          <ThemedView style={styles.subtitleContainer}>
            <ThemedText lightColor="#aaa" darkColor="#aaa">Terms and Conditions</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  // scrollableTabContainer: {
  //   flex: 1,
  //   flexDirection: 'row',
  // },
  // scrollableTab: {
  //   width: 200,
  //   height: 100,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: 'lightblue',
  //   marginHorizontal: 10,
  // },
  pageBody: {
    flex: 1,
  },
  titleContainer: {
    margin: 30,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  subtitleContainer: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginTop: 5,
  },
  buttonContainer: {
    width: '100%',
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 10,
  },
  buttonBody: {
    alignItems: 'center',
    backgroundColor: '#ff8b2e',
    marginVertical: 7,
    marginHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 20,
  },
  logo: {
    height: 125,
    width: 125,
    margin: 10,
    borderRadius: 15,
    //bottom: 0,
    //left: 0,
    //position: 'absolute',
  },
});