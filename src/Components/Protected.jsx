import React, { useEffect } from "react";
import {  useNavigate } from "react-router-dom";

export default function Protected({ Component, showAlert }) {
    const navigate = useNavigate();
    useEffect(()=>{
        if (!localStorage.getItem("token")){
            navigate("login");
        }
    });

  return (
    <>
      {localStorage.getItem("token") && <Component showAlert={showAlert}/>}
    </>
  );
}
