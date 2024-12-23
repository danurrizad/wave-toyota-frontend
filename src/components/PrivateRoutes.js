/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */

import React, { useState, useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/context/authContext";
import axios from "axios";

const PrivateRoute = () => {
  const auth = useAuth();

  if (!auth.token || !auth.user) return <Navigate to="/login" />;

  // if(!user.isAuthenticated) return <Navigate to="/login"/>

  return <Outlet/>
};

export default PrivateRoute;