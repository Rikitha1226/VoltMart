import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function LoginPage(){

  const navigate = useNavigate();

  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");

  const login = async ()=>{

    try{

      const res = await API.post("/auth/login",{username,password});

      const user = res.data;

      if(user.role==="ADMIN"){
        navigate("/admin");
      }else{
        navigate("/cashier");
      }

    }catch{
      alert("Invalid login");
    }

  }

  return(

    <div className="container">

      <div className="card">

        <h2>VoltMart Login</h2>

        <input className="input"
        placeholder="Username"
        onChange={(e)=>setUsername(e.target.value)}
        />

        <input className="input"
        type="password"
        placeholder="Password"
        onChange={(e)=>setPassword(e.target.value)}
        />

        <button className="button" onClick={login}>
        Login
        </button>

        <button className="link"
        onClick={()=>navigate("/register")}>
        Create Account
        </button>

      </div>

    </div>

  )

}

export default LoginPage;