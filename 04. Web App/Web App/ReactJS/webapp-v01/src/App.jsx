// This is the main code for the web app

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./Components/Navbars/Navbar2";
import Footer from "./Components/Footer/Footer2";
import Home from "./Pages/Home";
import Signin from "./Pages/Signin";
import Signup from "./Pages/Signup";
import About from "./Pages/About";
import Dashboard from "./Pages/Dashboard";
import Bookings from "./Pages/Bookings";
import Reload from "./Pages/Reload";
import Invoice from "./Pages/Invoice";
import Forbidden from "./Pages/Forbidden";
import General from "./Components/Dashboard/General";
import Transactions from "./Components/Dashboard/Transactions";
import Tickets from "./Components/Dashboard/Tickets";
import Devices from "./Components/Dashboard/Devices";
import Settings from "./Components/Dashboard/Settings";
import VerifyEmail from "./Pages/VerifyEmail";
import Terms from "./Pages/TermsConditions";
import Help from "./Pages/Help";
import AvailableTickets from "./Pages/AvailableTickets";
import Tracking from "./Pages/Tracking";
import MyBusses from "./Pages/MyBusses";
import Earnings from "./Components/Dashboard/Earnings";
import BusTracking from "./Components/MyBusses/Bus.Tracking";
import BusGeneral from "./Components/MyBusses/Bus.General";
import BusDetail from "./Components/MyBusses/Bus.Detail";
import { getSessionData } from "./Components/SessionData/Sessions";
import {
  PrivertRouteToSignin,
  PrivertRouteToHome,
  PrivertRouteToForbidden,
} from "./Routes/PrivertRoutes";
import { MyBars } from "./Components/Spinners/Spinners";
import ContactUs from "./Pages/ContactUs";
import NewsRoom from "./Pages/NewsRoom";
import { deleteData, updateData } from "./APIs/NodeBackend2";
import { ToastAlert } from "./Components/MyNotifications/WindowAlerts";

function App() {
  /* Top level controlls for the web app */

  // To identify the current language of the webapp
  const localLanguage =
    localStorage.getItem("language") || sessionStorage.getItem("language");
  const [language, setLanguage] = useState(
    localLanguage === "en" || localLanguage === "sn" ? localLanguage : "en"
  );

  // To identify the login status
  const [isLogged, setIsLogged] = useState(
    sessionStorage.getItem("isLogged") || "none"
  );
  const [sessionData, setSessionData] = useState({});

  // Handling loading spinner
  const [loading, setLoading] = useState(false);

  // Fetching session data
  useEffect(() => {
    const fetchData = async () => {
      const sessionData = await getSessionData();
      console.log(`SessionData:: ${JSON.stringify(sessionData)}`);
      setSessionData(sessionData);
    };

    fetchData();
  }, []);

  // Finding session status
  useEffect(() => {
    const userID =
      JSON.parse(localStorage.getItem("userId")) ||
      JSON.parse(sessionStorage.getItem("userId"));
    console.log(
      `UID: ${userID}  sessionDataIsNull: ${
        Object.keys(sessionData).length === 0
      }`
    );

    // If session data is not empty
    if (Object.keys(sessionData).length > 0) {
      console.log("session validating!");
      sessionStorage.setItem("sessionData", JSON.stringify(sessionData));

      if (userID !== null) {
        sessionStatus(userID);
      } else {
        setIsLogged("false");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionData]);

  useEffect(() => {
    console.log(`isLogged: ${isLogged}  typeof(isLogged):: ${typeof isLogged}`);
    if (isLogged === "true") {
      sessionStorage.setItem("isLogged", "true");
    } else if (isLogged !== "none") {
      const userID =
        JSON.parse(localStorage.getItem("userId")) ||
        JSON.parse(sessionStorage.getItem("userId"));

      if (userID !== null) {
        sessionTerminate(userID);
      }
      console.log(`removed user : ${userID}`);
      localStorage.clear();
      sessionStorage.clear();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogged]);

  // Function to get session status
  const sessionStatus = async (value) => {
    // Creating data object
    const data = { userID: value, session: sessionData };

    console.log("update existing session data: ", data);

    try {
      const serverResponse = await updateData("logs", data);
      console.log("Session Status:: ", serverResponse.data);
      setIsLogged(serverResponse.data === "active" ? "true" : "false");
    } catch (error) {
      console.error(`Error:: finding session status. Refresh your browser.`);
    }
  };

  // Function to terminate session
  const sessionTerminate = async (value) => {
    // Creating data object
    const data = {
      userID: value,
      MAC: sessionData.MAC,
      browser: sessionData.browser,
    };

    console.log("Terminate Session:: ", data);

    try {
      const serverResponse = await deleteData("logs", data);
      if (serverResponse.data === "success") {
        console.log("Successfully terminated");
      }
    } catch (error) {
      console.error(`Error in terminating session.`);
      ToastAlert({
        type: "error",
        title: "Something went wrong\nPlease reload page again.",
      });
    }
  };

  // function to get device language
  useEffect(() => {
    localStorage.setItem("language", language);
    //console.log(`localLanguage: ${localLanguage}     language: ${language}`);
  }, [language]);

  return (
    <div>
      <BrowserRouter>
        <Navbar
          isLogged={isLogged}
          setIsLogged={setIsLogged}
          language={language}
          setLanguage={setLanguage}
        />

        <Routes>
          <Route path="/" element={<Navigate to="home" />} />
          <Route
            path="home"
            element={<Home language={language} setLoading={setLoading} />}
          />
          <Route
            path="about"
            element={<About language={language} setLoading={setLoading} />}
          />
          <Route path="help" element={<Help language={language} />} />
          <Route
            path="contact"
            element={<ContactUs language={language} setLoading={setLoading} />}
          />
          <Route
            path="news"
            element={<NewsRoom language={language} setLoading={setLoading} />}
          />

          <Route element={<PrivertRouteToSignin isLogged={isLogged} />}>
            <Route
              path="booking"
              element={<Bookings language={language} setLoading={setLoading} />}
            />
            <Route
              path="avtickets"
              element={
                <AvailableTickets language={language} setLoading={setLoading} />
              }
            />
            <Route
              path="tracking"
              element={<Tracking language={language} setLoading={setLoading} />}
            />
            <Route
              path="reload"
              element={<Reload language={language} setLoading={setLoading} />}
            />
            <Route element={<PrivertRouteToForbidden />}>
              <Route
                path="mybuses"
                element={
                  <MyBusses language={language} setLoading={setLoading} />
                }
              >
                <Route
                  path=""
                  element={
                    <BusGeneral language={language} setLoading={setLoading} />
                  }
                />
                <Route
                  path="tracking"
                  element={
                    <BusTracking language={language} setLoading={setLoading} />
                  }
                />
                <Route
                  path="busdetails"
                  element={
                    <BusDetail language={language} setLoading={setLoading} />
                  }
                />
              </Route>
            </Route>
            <Route
              path="dashboard"
              element={
                <Dashboard
                  setIsLogged={setIsLogged}
                  language={language}
                  setLoading={setLoading}
                />
              }
            >
              <Route
                path=""
                element={<Navigate to="general" replace />}
                setLoading={setLoading}
              />
              <Route
                path="general"
                element={
                  <General language={language} setLoading={setLoading} />
                }
              />
              <Route
                path="transactions"
                element={
                  <Transactions language={language} setLoading={setLoading} />
                }
              />
              <Route
                path="tickets"
                element={
                  <Tickets language={language} setLoading={setLoading} />
                }
              />
              <Route
                path="devices"
                element={
                  <Devices
                    language={language}
                    setIsLogged={setIsLogged}
                    setLoading={setLoading}
                  />
                }
              />
              <Route
                path="settings"
                element={
                  <Settings language={language} setLoading={setLoading} />
                }
              />
              <Route element={<PrivertRouteToForbidden />}>
                <Route
                  path="earnings"
                  element={
                    <Earnings language={language} setLoading={setLoading} />
                  }
                />
              </Route>
            </Route>
            <Route
              path="invoice"
              element={<Invoice language={language} setLoading={setLoading} />}
            />
          </Route>

          <Route element={<PrivertRouteToHome isLogged={isLogged} />}>
            <Route
              path="signin"
              element={
                <Signin
                  setIsLogged={setIsLogged}
                  language={language}
                  setLoading={setLoading}
                />
              }
            />
            <Route
              path="signup"
              element={<Signup language={language} setLoading={setLoading} />}
            />
            <Route
              path="verify"
              element={<VerifyEmail language={language} />}
            />
          </Route>

          <Route path="terms" element={<Terms language={language} />} />

          <Route path="*" element={<Forbidden language={language} />} />
        </Routes>

        <Footer />

        {loading && <MyBars />}
      </BrowserRouter>
    </div>
  );
}

export default App;
