/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */

import React, { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthDataService from "../../services/AuthDataService";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const { login, verifyToken } = useAuthDataService()
  const [user, setUser] = useState(localStorage.getItem("user") || "");
  const [token, setToken] = useState(localStorage.getItem("site") || "");
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate();

  const loginAction = async (form) => {
    try {
      const response = await login(form);
      if (response.data) {
        setToken(response.data.token);
        localStorage.setItem("site", response.data.token);

        const responseToken = await verifyToken(response.data.token)
        if(responseToken.status === 200){
          setUser(responseToken.data.responseUser.username)
          localStorage.setItem("user", responseToken.data.responseUser.username)
          setIsAuthenticated(true)
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
    <AuthContext.Provider value={{ token, user, isAuthenticated, loginAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );

};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};