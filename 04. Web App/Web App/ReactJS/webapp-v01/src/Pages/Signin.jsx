import React, { useState } from 'react'
import Login from '../Components/LoginForm/login1'
import './Signin.css'
import OTP from '../Components/OTPForm/OTP1'
import { OnceFadeIn } from '../Components/Animations/Entrance.Once'

export default function Signin( { setIsLogged, language , setLoading } ) {
  // Empty data set
  const emptyData = {
    userID: '',
    userType: '',
    empType: '',
    mobile: '',
    email: '',
    sessionData: { }
  }  
  
  // Variable for storing current login state.
  const [isLoging, setIsLogin] = useState(false);      // boolean
  const [userData, setUserData] = useState(emptyData); // data Object
  const [rememberMe, setRememberMe] = useState(emptyData); // boolean

  // Handling response
  const handleResponse = (response) =>{
    //console.log('New Login:');
    //console.log(`Response:: ${JSON.stringify(response)}`);

    if(response === 'none'){
      setIsLogin(false);
      setUserData(emptyData);
    }
    else{
      setUserData(response);
      setIsLogin(true);
    }
  }

  return (
    <OnceFadeIn direction='right' duration={500}>
      <div className='Login-body'>
        {
          !isLoging ? (
            <OnceFadeIn>
              <Login setIsLogged={setIsLogged} data={userData} sendResponse={handleResponse} language={language} rememberMe={setRememberMe} setLoading={setLoading}/>
            </OnceFadeIn>
          ):(
            <OnceFadeIn delay={1000} duration={2000}>
              <OTP setIsLogged={setIsLogged} userData={userData} sendResponse={handleResponse} language={language} rememberMe={rememberMe} setLoading={setLoading}/>
            </OnceFadeIn>
          )
        }
      </div>
    </OnceFadeIn>
  )
}
