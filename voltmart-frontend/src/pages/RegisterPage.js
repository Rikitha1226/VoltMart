import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function RegisterPage(){

  const navigate = useNavigate();

  const [username,setUsername]=useState("");
  const [email,setEmail]=useState("");
  const [phone,setPhone]=useState("");
  const [password,setPassword]=useState("");
  const [confirmPassword,setConfirmPassword]=useState("");
  const [role,setRole]=useState("CASHIER");

  const register = async ()=>{

    if(password!==confirmPassword){
      alert("Passwords do not match");
      return;
    }

    try{

      await API.post("/auth/register",{
        username,email,phone,password,role
      });

      alert("Registration successful");
      navigate("/");

    }catch{
      alert("Registration failed");
    }

  }

  return(

    <div className="container">

      <div className="card">

        <h2>Create Account</h2>

        <input className="input"
        placeholder="Username"
        onChange={(e)=>setUsername(e.target.value)}/>

        <input className="input"
        placeholder="Email"
        onChange={(e)=>setEmail(e.target.value)}/>

        <input className="input"
        placeholder="Phone"
        onChange={(e)=>setPhone(e.target.value)}/>

        <input className="input"
        type="password"
        placeholder="Password"
        onChange={(e)=>setPassword(e.target.value)}/>

        <input className="input"
        type="password"
        placeholder="Confirm Password"
        onChange={(e)=>setConfirmPassword(e.target.value)}/>

        <select className="input"
        onChange={(e)=>setRole(e.target.value)}>

          <option value="CASHIER">Cashier</option>
          <option value="ADMIN">Admin</option>

        </select>

        <button className="button" onClick={register}>
        Register
        </button>

        <button className="link"
        onClick={()=>navigate("/")}>
        Back to Login
        </button>

      </div>

    </div>

  )

}

export default RegisterPage;