/*
This API is used to connect frontend with the own nodeJS backend server
*/

import Axios from "axios";

// Base API of the server
const API_BASE_URL = process.env.REACT_APP_LOCAL_BACKEND_URL;
//const API_BASE_URL = process.env.REACT_APP_RAILWAY_BACKEND_URL;

// Get data from backend
export const Response = async (page) => {
  try {
    const destination = `${API_BASE_URL}/${page}`;
    console.log(`Listening to: ${destination}`);
    const response = await Axios.post(`${destination}`);
    //console.log(`Response:: Type: ${response.data.type}   data: ${response.data.id}`);
    return response; // Note::  format: {ResType, data}
  } catch (error) {
    console.error("There was an error fetching the users!", error);
    throw error;
  }
};

// Send data to the backend
export const Post = async (data, page) => {
  try {
    const destination = `${API_BASE_URL}/${page}`;
    console.log(`Post to: ${destination}`);
    await Axios.post(`${destination}`, data); // Note::  format: {PostType, data}
  } catch (error) {
    console.error("There was an error in the request message!", error);
    throw error;
  }
};

// Send data to the backend and get response from the backend
export const Request = async (sendData, page) => {
  //console.log('Im here');
  try {
    const destination = `${API_BASE_URL}/${page}`;
    console.log(`Request from: ${destination}`);
    const ServerResponse = await Axios.post(`${destination}`, sendData); // Note::  format: {ReqType, data}
    //console.log(`Server Response: ${JSON.stringify(ServerResponse.data)}`);
    return ServerResponse;
  } catch (error) {
    console.error("There was an error adding the user!", error);
    throw error;
  }
};

// Send data to the backend and get response from the backend
export const GetRequest = async (sendData, page) => {
  //console.log('Im here');
  try {
    const destination = `${API_BASE_URL}/${page}`;
    console.log(`GETRequest from: ${destination}`);
    //console.log(`Data: ${JSON.stringify(sendData)}`);
    const ServerResponse = await Axios.get(`${destination}`, sendData); // Note::  format: {ReqType, data}
    //console.log(`NODEServer Response: ${JSON.stringify(ServerResponse.data)}`);
    return ServerResponse;
  } catch (error) {
    console.error("There was an error adding the user!", error);
    throw error;
  }
};

// Send data to the backend and get response from the backend
export const GetResponse = async (page) => {
  //console.log('Im here');
  try {
    const destination = `${API_BASE_URL}/${page}`;
    console.log(`GETResponse from: ${destination}`);
    const ServerResponse = await Axios.get(`${destination}`, "");
    //console.log(`Server Response: ${JSON.stringify(ServerResponse.data)}`);
    return ServerResponse;
  } catch (error) {
    console.error("There was an error adding the user!", error);
    throw error;
  }
};
