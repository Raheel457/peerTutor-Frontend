import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { selectUser } from "../Redux/userSlice";
import Qitems from "./Qitems";
export default function Questions(props) {
  // To navigate to different routes
  const navigte = useNavigate();
  // Get all the questions
  const [Questions, setQuestions] = useState([]);
  useEffect(() => {
    const getQuestions = async () => {
      if (localStorage.getItem("token")) {
        const response = await fetch(
          `http://localhost:5000/api/query/getallquery`,
          {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        const json = await response.json();
        setQuestions(json);
      }
    };
    getQuestions();
  });

  const client = useSelector(selectUser);
  return (
    <div className="container my-1">
      <div>
        <h1 style={{ display: "inline" }}>Top Questions </h1>
        {client.user.status === "student" && (
          <button
            onClick={() => {
              navigte("/AskQuestion");
            }}
            className="btn btn-outline-primary"
            style={{ marginLeft: "83%" }}
          >
            {" "}
            <FontAwesomeIcon icon={faPlusCircle} /> Ask Question
          </button>
        )}
      </div>
      {Questions.length !== 0 ? (
        <div>
          {Questions.map((question) => {
            return (
              <div className="my-3" key={question._id}>
                <Qitems item={question} showAlert={props.showAlert} />
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          <h4 className="my-3">No Questions Yet, Please Ask One!!!</h4>
        </div>
      )}
    </div>
  );
}
