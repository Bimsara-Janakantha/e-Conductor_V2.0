import { Image, StyleSheet, Pressable } from "react-native";
import { Link, router } from "expo-router";
import { FormEvent, useState , useRef } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView, TextInput } from "react-native-gesture-handler";
import Animated, { useAnimatedRef } from 'react-native-reanimated';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { View } from "react-native-reanimated/lib/typescript/Animated";
import { opacity } from "react-native-reanimated/lib/typescript/reanimated2/Colors";
import { OwnerFormPage1 , OwnerFormPage2 , OwnerFormPage3} from "@/components/FormComponents/OwnerForm";
import FontAwesome from "@expo/vector-icons/build/FontAwesome";

const formPageCount = 3;
const formPageWidth = 300;

export default function SignUP() {
  const [name, setName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [nic, setNIC] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [bankName, setBankName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [otp, setOTP] = useState('');

  const [loading, setLoading] = useState(false);

  // Subitting form /////////////////////////////////////////////////////////////////////////////////

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
  const [backVisible, setBackVisible] = useState(false);
  const [nextVisible, setNextVisible] = useState(false);
  var isSubmitDisabled = true;

  function scrollFoward () {
    if (scrollRef.current) {
      let newPos = (currentPos < (formPageCount - 1)*formPageWidth) ? currentPos + formPageWidth : (formPageCount - 1)*formPageWidth;
      scrollRef.current.scrollTo({ x: newPos, y: 0, animated: true });
      setCurrentPos(newPos);
    }
  };

  function scrollBack () {
    if (scrollRef.current) {
      let newPos = (currentPos > 0) ? currentPos - formPageWidth : 0;
      scrollRef.current.scrollTo({ x: newPos, y: 0, animated: true });
      setCurrentPos(newPos);
    }
  };

  function submitForm () {
    router.replace('/(drawer)/home/tabone');
  };

  return (
    <ThemedView style={styles.pageBody} lightColor="#fff" darkColor="#222">

      {/*************************************************************** Title ************************************************************************/}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" lightColor="#ffb925" darkColor="#ffb925">Sign Up</ThemedText>
      </ThemedView>

      {/*********************************************************** Sign in form *********************************************************************/}
      <ThemedView style={styles.formBody}> 
        <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16} horizontal={true} style={styles.formPageContainer} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} pointerEvents={'none'}>
          <Animated.View style={styles.formPage}>
            <ThemedView style={styles.signInTypeContainer}>
              <Pressable style={styles.signInTypeButton} onPress={scrollFoward} pointerEvents={'auto'}><ThemedText type="subtitle" lightColor="#fff" darkColor="#fff">Sign up as a passenger</ThemedText></Pressable>
              <Pressable style={styles.signInTypeButton} onPress={scrollFoward} pointerEvents={'auto'}><ThemedText type="subtitle" lightColor="#fff" darkColor="#fff">Sign up as an employee</ThemedText></Pressable>
              <Pressable style={styles.signInTypeButton} onPress={scrollFoward} pointerEvents={'auto'}><ThemedText type="subtitle" lightColor="#fff" darkColor="#fff">Sign up as a bus owner</ThemedText></Pressable>
            </ThemedView>
          </Animated.View>
          <Animated.View style={styles.formPage}>
            <OwnerFormPage1 name={name} setName={setName} phoneNo={phoneNo} setPhoneNo={setPhoneNo} dateOfBirth={dateOfBirth} setDateOfBirth={setDateOfBirth} nic={nic} setNIC={setNIC} setNextVisible={setNextVisible} setBackVisible={setBackVisible} currentPos={currentPos}/>
          </Animated.View>
          <Animated.View style={styles.formPage}>
            <OwnerFormPage2 accountNo={accountNo} setAccountNo={setAccountNo} bankName={bankName} setBankName={setBankName} branchName={branchName} setBranchName={setBranchName} setNextVisible={setNextVisible} setBackVisible={setBackVisible} currentPos={currentPos}/>
          </Animated.View>
          <Animated.View style={styles.formPage}>
            <OwnerFormPage3 otp={otp} setOTP={setOTP} setNextVisible={setNextVisible} setBackVisible={setBackVisible} currentPos={currentPos} />
          </Animated.View>
        </Animated.ScrollView>
      </ThemedView>

      {/************************************************* Form Nevigation Buttons (Next & Back) ********************************************************/}
      <ThemedView style={styles.formNevContainer}>
        {backVisible && <Pressable style={styles.formBackButton} onPress={scrollBack}><ThemedText type="subtitle" lightColor="#000" darkColor="#fff"><FontAwesome name='chevron-left' size={20}/> Back </ThemedText></Pressable>}
        {nextVisible && <Pressable style={styles.formNextButton} onPress={scrollFoward}><ThemedText type="subtitle" lightColor="#000" darkColor="#fff"> Next <FontAwesome name='chevron-right' size={20}/></ThemedText></Pressable>}
      </ThemedView>

      {/***************************************************** Submit button and footer *****************************************************************/}
      <ThemedView style={styles.footer}>
        <Pressable style={styles.submitButton} disabled={isSubmitDisabled} onPress={submitForm}><ThemedText type="subtitle" lightColor="#fff" darkColor="#fff">Sign Up</ThemedText></Pressable>
        <ThemedText lightColor="#aaa" darkColor="#aaa">Already have an account? <Link href={'/login'}><ThemedText lightColor="#17f" darkColor="#17f">Log In</ThemedText></Link></ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  pageBody: {
    flex: 1,
  },
  formPageContainer: {
    width: formPageWidth,
  },
  signInTypeContainer: {
    gap: 10,
    backgroundColor: 'transparent',
    paddingTop: 50,
    alignSelf: 'center',
  },
  signInTypeButton: {
    borderWidth: 0,
    color: '#fff',
    borderRadius: 50,
    padding: 10,
    marginBottom: 5,
    backgroundColor: '#358b1e',
    alignItems: 'center',
  },
  formPage: {
    width: formPageWidth,
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 0,
  },
  formBackButton: {
    position: 'absolute',
    left: 0,
    backgroundColor: 'transparent',
  },
  formNextButton: {
    position: 'absolute',
    right: 0,
    backgroundColor: 'transparent',
  },
  formBody: {
    backgroundColor: 'transparent',
    height: '60%',
    //backgroundColor: "#fff",
    color: "#aa00ff",
    margin: 10,
    borderRadius: 10,
    padding: 10,
    alignSelf:'center',
  },
  titleContainer: {
    backgroundColor: 'transparent',
    padding: 10,
    marginTop: 20,
  },
  footer: {
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  submitButton: {
    borderWidth: 0,
    color: '#fff',
    borderRadius: 50,
    padding: 10,
    marginBottom: 5,
    backgroundColor: '#ff8b2e',
    alignItems: 'center',
  },
  formNevContainer: {
    width: formPageWidth,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-around',
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