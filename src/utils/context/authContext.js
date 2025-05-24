/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */

import React, { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthDataService from "../../services/AuthDataService";
import axiosInstance from "../AxiosInstance";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const { login, verifyToken, refreshToken } = useAuthDataService()
  const [userData, setUserData] = useState(localStorage.getItem("userData") || "")
  const [user, setUser] = useState(localStorage.getItem("user") || "");
  const [token, setToken] = useState(localStorage.getItem("site") || "");
  const [errMsg, setErrMsg] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [statusLogin, setStatusLogin] = useState("LoggedOut")
  const navigate = useNavigate();


  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async() => {
    try {
      if(token){
        const responseToken = await verifyToken(token)
          // console.log("responseToken Verifiy :", responseToken)
          if(responseToken.status === 200){
            setUser(responseToken.data.responseUser.username)
            localStorage.setItem("user", responseToken.data.responseUser.username)
            setUserData(responseToken.data.responseUser)
            localStorage.setItem("userData", JSON.stringify(responseToken.data.responseUser))
            setIsAuthenticated(true)
          } else{
            localStorage.removeItem("site");
            localStorage.removeItem("user");
            localStorage.removeItem("userData");
            setUser(null)
            setUserData(null)
            setToken(null)
            navigate("/login");
          }
      }
    } catch (error) {   
      localStorage.removeItem("site");
      localStorage.removeItem("user");
      localStorage.removeItem("userData");

      setUser(null)
      setUserData(null)
      setToken(null)
      navigate("/login");
    }
  }

  const loginAction = async (form) => {
    try {
      const response = await login(form);
      if (response.data) {
        setToken(response.data.accessToken);
        localStorage.setItem("site", response.data.accessToken);
        
        const responseToken = await verifyToken(response.data.accessToken)
        if(responseToken.status === 200){
          setUser(responseToken.data.responseUser.username)
          localStorage.setItem("user", responseToken.data.responseUser.username)
          setUserData(responseToken.data.responseUser)
          localStorage.setItem("userData", JSON.stringify(responseToken.data.responseUser))
          setIsAuthenticated(true)
          localStorage.setItem("status", "Success")
          setStatusLogin("Success")
          navigate("/");
        }

        return responseToken;
      }
    //   throw new Error(response.message);
    } catch (err) {
      throw err
    }
  };


  const logOut = () => {
    setUser(null);
    setUserData(null);
    setToken("");
    localStorage.removeItem("site");
    localStorage.removeItem("user");
    localStorage.removeItem("userData");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, user, userData, isAuthenticated, errMsg, statusLogin, loginAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );

};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};