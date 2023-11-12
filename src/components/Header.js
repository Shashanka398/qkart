import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import {Link,useNavigate} from 'react-router-dom';

import React from "react";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
  let navigate=useNavigate();
  let userName=localStorage.getItem("username");
  const clear=()=>{
    localStorage.clear();
    window.location.reload();
  }  
  return (
    <Box className="header">
    <Box className="header-title">
          <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      {children}
    {hasHiddenAuthButtons?(
      <Button
        className="explore-button"
        startIcon={<ArrowBackIcon />}
        variant="text"
        onClick={(e)=>{("/")}}
      >
        Back to explore
      </Button>
    ):(userName?(
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar alt={userName}  src="/public/avatar.png" />
        <p> {userName}</p>
        <Button  variant="contained"
        onClick={clear}
        >LOGOUT</Button></Stack>
      ):(
        <Stack direction="row" spacing={2}>
          <Button  variant="contained"
            onClick={(e)=>{navigate("/login")}}
          >LOGIN</Button>
        <Button  variant="contained" onClick={(e)=>{navigate("/register")}}>REGISTER</Button>
        </Stack>)
        )}
   </Box>
    );
};

export default Header;
