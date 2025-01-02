/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */

import React, { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthDataService from "../../services/AuthDataService";
import axiosInstance from "../AxiosInstance";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const { login, verifyToken } = useAuthDataService()
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
            setIsAuthenticated(true)
          } else{
            localStorage.removeItem("site");
            localStorage.removeItem("user");
            setUser(null)
            setToken(null)
          }
      }
    } catch (error) {
      if(error.response.data){
        setErrMsg("Token expired!")
      }
      // console.log("Error checking auth :", error)
      localStorage.removeItem("site");
      localStorage.removeItem("user");
      setUser(null)
      setToken(null)
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
    setToken("");
    localStorage.removeItem("site");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, errMsg, statusLogin, loginAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );

};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};