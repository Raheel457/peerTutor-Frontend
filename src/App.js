import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Error from "./Components/Error";
import Login from "./Components/Login";
import Navbar from "./Components/Navebar";
import Protected from "./Components/Protected";
import Questions from "./Components/Questions";
import About from "./Components/About";
import AskQuestion from "./Components/AskQuestion";
import ViewQuestion from "./Components/ViewQuestion";
import Profile from "./Components/Profile";
import Alert from "./Components/Alert";
import { useState } from "react";


function App() {
  
  const [alert, setAlert] = useState(null);
  const showAlert = (message, type)=> {
    setAlert({
      message: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 1600);
  }
  return (
    <BrowserRouter>
          <Navbar showAlert={showAlert}/>
          <Alert alert={alert}/>
          <div className="container">
            <Routes>
              <Route exact path="/" element={<Protected Component={Questions} showAlert={showAlert} />} />
              <Route exact path="/AskQuestion" element={<Protected Component={AskQuestion} showAlert={showAlert} />} />
              <Route exact path="/toQuestion" element={<Protected Component={ViewQuestion} showAlert={showAlert}/>} />
              <Route exact path="/profile" element={<Protected Component={Profile} showAlert={showAlert}/>} />
              <Route exact path="login" element={<Login showAlert={showAlert}/> }  />
              <Route exact path="about" element={<About />}/>
              <Route path="*" element={<Error />}/>
            </Routes>
          </div>
        </BrowserRouter>
  );
}

export default App;
