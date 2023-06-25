import React , {useState} from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../Redux/userSlice";

export default function Login(props) {
  const dispatch = useDispatch();
  const Navigate = useNavigate();
    const [user, setUser] = useState({
        email:"",
        password:""
    });
    const HandleLogin = async (e) => {
      e.preventDefault();
      const response = await fetch(`http://localhost:5000/api/auth/login`, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email : user.email,
          password : user.password
        }),
      });
      const json = await response.json();
      // Checking if login credentials are matched
      if (json.progress) {
        localStorage.setItem("token", json.jwtData);
        setTimeout(() => {
          localStorage.removeItem("token");
        }, 600000);
        props.showAlert(`Logged In, Successfully as ${json.client.status.charAt(0).toUpperCase() + json.client.status.slice(1)}`, "success");
        Navigate("/");
        dispatch(login({
          user:json.client
        }));
      } else {
        // Will put alert later
        props.showAlert("Invalid Credentials, please try again.", "warning");
        console.log("Invalid");
      }
    };  
    const onChangeHandle = (e)=>{
        setUser({ ...user, [e.target.name]: e.target.value });
    }
  return (
    <div className="container">
    <h2 className="my-2">Login to Peer tutor plateform</h2>
      <form>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Email address"
            value={user.email}
            name = "email"
            onChange={onChangeHandle}
          />
          <small id="emailHelp" className="form-text text-muted">
            Make sure to provide the correct information 
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            placeholder="Password"
            value={user.password}
            name = "password"
            onChange={onChangeHandle}
          />
        </div>
        <button type="submit" className="btn btn-primary my-3" disabled={!user.email || !user.password} onClick={HandleLogin}>
          Login
        </button>
      </form>
    </div>
  );
}
