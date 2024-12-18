/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */

import React, { useState, useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/context/authContext";
import axios from "axios";

const PrivateRoute = () => {
  const user = useAuth();
  const navigate = useNavigate()

  if (!user.token) return <Navigate to="/login" />;

  // if(!user.isAuthenticated) return <Navigate to="/login"/>

  return <Outlet/>

  // useEffect(() => {
  //   const validateToken = async () => {
  //     if (!user.token) return <Navigate to="/login" />;

  //     try {
  //       // Validate token with the backend
  //       const response = await axios.post(
  //         "http://localhost:5000/api/auth/verify-token",
  //         {
  //           headers: {
  //             Authorization: `Bearer ${user.token}`,
  //           },
  //         }
  //       );

  //       console.log("RESPONSE VALIDATE TOKEN :", response)

  //       if (response.status === 200) {
  //         setIsAuthenticated(true);
  //       }
  //     } catch (err) {
  //       console.error("Invalid or expired token", err);
  //       localStorage.removeItem("site");
  //       // navigate("/login");
  //     }
  //   };

  //   validateToken();
  // }, [user]);

  // return <Outlet />;
};

export default PrivateRoute;