import React, { useEffect, useState } from 'react'
import OTPInput from 'react-otp-input'
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { handleNotifications } from '../MyNotifications/FloatingNotifications';
import { Post, Request } from '../../APIs/NodeBackend';
import './OTP1.css'


export default function OTP({setIsLogged, userData, sendResponse, language, setAllowNavigate}) { // Language is not implemented yet
  // Variable for initial count
  let endTime = 120;

  // Variable for server OTP
  const [serverOTP, setServerOTP] = useState('');

  // Initialize useNavigate hook
  const navigate = useNavigate();

  // variable where user entered otp is stored
  const [otp, setOtp] = useState('');

  // variable for disable otp field
  const [isDissable, setIsDissable] = useState(false);

  // variable for disable Resend button
  const [resendDissable, setresendDissable] = useState(true);

  // variable to store reamining time
  const [time, setTime] = useState(endTime);


  // Confirm user and mobile comes correctly
  useEffect(()=>{
    //console.log(`OTP SEND:: userID: ${userData.userID}    mobile: ${userData.mobile}   email: ${userData.email}`);
    requestOTP({mobile: userData.mobile, email: userData.email});
  }, []);

  
  // Function to get the OTP from server
  const requestOTP = async (values) => {
    // Creating data object
    const data = {
      type: 'loginOTP',
      data: values
    }
    //console.log(`request message::   type: ${data.type}      data: ${data.data}`);

    try {
        const serverResponse = await Request(data, 'OTP');
        const newOTP = serverResponse.data;
        console.log(`New OTP:: ${newOTP}`);
        setServerOTP(newOTP);
    } catch (error) {
        console.error('Error adding user:', error);
    }
   //setServerOTP('abc123'); // Remove when connected to server
  };

  // Function to get the OTP from server
  const sendLog = async (value) => {
    // Creating data object
    const data = {
      type: 'Post1',    // Posting user login informations
      data: value
    }
    //console.log(`request message::   type: ${data.type}      data: ${data.data}`);

    try {
        await Post(data, 'logs/users');
    } catch (error) {
        console.error('Error adding user:', error);
    }
  };


  // Use effect for the countdown
  useEffect(()=>{
    if(time>0){
      setTimeout(() => {
        setTime(time-1);
      }, 1000);
    }
    else{
      setIsDissable(true);
      setresendDissable(false);
      handleNotifications({
        type:'warning', 
        title:'Time is out!', 
        body:'Please click Resend OTP to get a new OTP.'
      });
    }
  }, [time])

  // Function to handle login button
  const loginHandle = () =>{
    if(serverOTP === otp){
      localStorage.setItem('userId', JSON.stringify(userData.userID));
      localStorage.setItem('language', language);
      localStorage.setItem('userType', JSON.stringify(userData.userType));
      localStorage.setItem('empType', JSON.stringify(userData.empType));
      setIsLogged(true);
      setAllowNavigate(true);
      navigate('/');
      handleNotifications({
        type:'success', 
        title:'Successful Login!', 
        body:'Welcome to e-Conductor!.'
      });
      sendLog(userData);
    }
    else{
      handleNotifications({
        type:'error', 
        title:'Invalid OTP!', 
        body:'OTP is invalid. Try Again!'
      });
      setOtp ('');
    }
  }

  // Function to handle back button
  const backHandle = () =>{
    sendResponse('none');
  }

  // Function to handle Resend Option
  const resendHandle = () =>{
    if (resendDissable){
      handleNotifications({
        type:'warning', 
        title:'Wait!', 
        body:'Wait untill countdown ends!'
      });
    }
    else{
      setTime(endTime);
      setIsDissable(false);
      setOtp('');
      setresendDissable(true);
      requestOTP({mobile: userData.mobile, email: userData.email});   // function to get the new OTP from the server
      handleNotifications({
        type:'info', 
        title:'Resend OTP!', 
        body:'New OTP is sent to your mobile number.'
      });
    }
  }

  return (
    <div className='OTP-Wrappper'>
      <h3>Enter Your OTP</h3>
      <label>We sent an OTP to your mobile number and the email. It is valid for next {time} seconds.</label>
      
      <div className="otp-area">
        <OTPInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          renderInput={(props) => <input {...props} disabled={isDissable}/>}
          inputStyle={{
            width: '40px',
            height: '40px',
            border: '2px solid #666666',
            borderRadius: '4px',
            margin: '5px',
            backgroundColor: 'rgba(255, 255, 255, 0.795)',
            color: 'black',
            fontSize: '20px',
          }}
        />
      </div>

      <div className='btn-container'>
        <Button onClick={backHandle} variant='outline-light'>Back</Button>
        <Button onClick={loginHandle} variant='light'>Login</Button>
      </div>
      
      {/* Edit URL Here */}
      <label>Didn't recive an OTP? <span onClick = {resendHandle} disabled = {resendDissable}><b><u> Resend OTP </u></b></span></label>

    </div>
  )
}
