import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

import { useDispatch, useSelector } from "react-redux";
import {  selectUser, profile } from "../Redux/userSlice";
import { useNavigate } from "react-router-dom";

export default function Ritems({ item, showAlert }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Making 2 states to keep track of votes
  const [upVote, setupVote] = useState(false);
  const [downVote, setdownVote] = useState(false);
  const [count , setCount] = useState(0);
  // Making state to get information of Answerer
  const [Answerer, setAnswerer] = useState("");
  const client = useSelector(selectUser);

  // Writing logic for Time stamps
  let duration = new Date() / 1000 - item.time;
  duration = Math.round(duration);
  let v = "";
  if (duration < 60) {
    v = "sec";
  } else {
    duration = Math.round(duration / 60);
    v = "min";
    if (duration > 60) {
      duration = Math.round(duration / 60);
      v = "hr";
      if (duration > 24) {
        duration = Math.round(duration / 24);
        v = "day";
        if (duration > 30) {
          duration = Math.round(duration / 30);
          v = "month";
        }
      }
    }
  }

  // Getting questioner's info
  useEffect(() => {
    const getUser = async () => {
      if (localStorage.getItem("token")) {
        const response = await fetch(`http://localhost:5000/api/auth/getuser`, {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({ userId: item.user }),
        });
        const json = await response.json();
        setAnswerer(json);
        
      }
    };

    setCount(item.votes.count);
    item.votes.upVotes.map(async (up) => {
      if (up === client.user._id) {
        setupVote(true);
      }
    });

    item.votes.downVotes.map(async (down) => {
      if (down === client.user._id) {
        setdownVote(true);
      }
    });
    getUser();
  }, [client.user._id, item]);

  // Handling voting system
  const HandleUpVote = async () => {
    const response = await fetch(
      `http://localhost:5000/api/response/updateResVotes/${item._id}`,
      {
        method: "PUT", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          vType: "up",
        }),
      }
    );
    const json = await response.json();
    
    if (json.status === "upVoted") {
      showAlert("Vote Casted", "success");
      setupVote(true);
      setdownVote(false);
      downVote ? setCount(count+2) : setCount(count+1);
    } else if (json.status === "removed") {
      showAlert("Vote Removed", "success");
      setupVote(false);
      setdownVote(false);
      setCount(count-1);
    }
  };

  const HandleDownVote = async () => {
    const response = await fetch(
      `http://localhost:5000/api/response/updateResVotes/${item._id}`,
      {
        method: "PUT", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          vType: "down",
        }),
      }
    );
    const json = await response.json();
    
    if (json.status === "downVoted") {
      showAlert("Vote Casted", "success");
      setupVote(false);
      setdownVote(true);
      upVote ? setCount(count-2) : setCount(count-1);
    } else if (json.status === "removed") {
      showAlert("Vote Removed", "success");
      setupVote(false);
      setdownVote(false);
      setCount(count+1);
    }
  };

  return (
    <>
      <div>
        <div
          style={{
            width: "50px",
            float: "left",
            border: "solid",
            borderColor: "#D3D3D3",
            height: "185px",
          }}
        >
          <FontAwesomeIcon
            icon={faCaretUp}
            className="upVote"
            values="up"
            style={{
              margin: "10px 6px 0",
              color: upVote && "green",
              height: "50px",
              cursor: "pointer",
            }}
            onClick={HandleUpVote}
          />
          <div
            style={{
              display: "grid",
              placeItems: "center",
              marginTop: "20%",
              backgroundColor: "#D3D3D3",
            }}
          >
            <h4>{count}</h4>
          </div>
          <FontAwesomeIcon
            icon={faCaretDown}
            className="downVote"
            values="down"
            style={{
              margin: "5px 6px 0",
              color: downVote && "#8B0000",
              height: "50px",
              cursor: "pointer",
            }}
            onClick={HandleDownVote}
          />
        </div>
        <div className="card" style={{ width: "60%" }}>
          <div className="card-body" style={{ paddingBottom:"55px"}}>
            <div>
            <button
                style={{
                  display: "block",
                  margin: "0 0 10px ",
                  backgroundColor: "#D0D0D0",
                  padding: 3,
                  borderRadius: 5,
                  borderColor:"#E0E0E0"
                  
                }}
                onClick={() => {
                  dispatch(
                    profile({
                      pProfile: Answerer,
                    })
                  );
                  navigate("/profile");
                }}
              >
                {" "}
                Answered by: {Answerer.name}
              </button>
              <h5
                className="card-title"
                style={{ display: "inline", }}
              >
                {item.answer}
              </h5>
            </div>
          </div>
          <div className="card-footer text-muted">
            {duration} {v} ago
          </div>
        </div>
      </div>
    </>
  );
}
