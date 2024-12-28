/*
This API is used to connect frontend with the own nodeJS backend server
*/

import axios from "axios";

// Base API of the server
const API_BASE_URL = process.env.REACT_APP_LOCAL_BACKEND_URL;
//const API_BASE_URL = process.env.REACT_APP_RAILWAY_BACKEND_URL;

// Get data from backend
export async function getData(page, sendData) {
  try {
    const destination = `${API_BASE_URL}/${page}`;
    //console.log(`Fetching data from: ${destination} with ${sendData}`);
    const response = await axios.get(destination, {
      params: { data: sendData },
    });
    return response;
  } catch (error) {
    console.error("There was an error fetching the data!", error);
    throw error;
  }
}

// Update data in backend
export async function updateData(page, sendData) {
  try {
    const destination = `${API_BASE_URL}/${page}`;
    //console.log(`Updating data in: ${destination}`);
    const response = await axios.patch(destination, sendData);
    return response;
  } catch (error) {
    console.error("Updating data error!", error);
    throw error;
  }
}

// Post new data to backend
export async function postData(page, sendData) {
  try {
    const destination = `${API_BASE_URL}/${page}`;
    console.log(
      `Posting new data in: ${destination} data: ${JSON.stringify(sendData)}`
    );
    const response = await axios.post(destination, { data: sendData });
    return response;
  } catch (error) {
    console.error("Adding data error!", error);
    throw error;
  }
}

// Add new data in backend -- Need to midify
export async function deleteData(page, sendData) {
  try {
    const destination = `${API_BASE_URL}/${page}`;
    //console.log(`Deleting excisting data in: ${destination}`);
    const response = await axios.delete(destination, { data: sendData });
    return response;
  } catch (error) {
    console.error("Deleting data error!", error);
    throw error;
  }
}
