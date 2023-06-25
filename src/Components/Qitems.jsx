import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

import { useDispatch, useSelector } from "react-redux";
import { question, selectUser, profile } from "../Redux/userSlice";

export default function Qitems({ item, showAlert }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Making 2 states to keep track of votes
  const [upVote, setupVote] = useState(false);
  const [downVote, setdownVote] = useState(false);
  // Making state to get information of questioner
  const [Questioner, setQuestioner] = useState("");
  const [user, setUser] = useState({});
  const client = useSelector(selectUser);
  const title = JSON.stringify(item.question.title).substring(0, 15) + "...";
  const description =
    JSON.stringify(item.question.description).substring(0, 20) + "...";
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
        setQuestioner(json.name);
        setUser(json);
      }
    };
    // console.log(upVote);
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
  }, [item.votes.upVotes, item.votes.downVotes, client.user._id, item.user]);

  // Handling voting system
  const HandleUpVote = async () => {
    const response = await fetch(
      `http://localhost:5000/api/query/updatequery/${item._id}`,
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
    if (json.response === "upVoted") {
      showAlert("Vote Casted", "success");
      setupVote(true);
      setdownVote(false);
    } else if (json.response === "removed") {
      showAlert("Vote Removed", "success");
      setupVote(false);
      setdownVote(false);
    }
  };

  const HandleDownVote = async () => {
    const response = await fetch(
      `http://localhost:5000/api/query/updatequery/${item._id}`,
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

    if (json.response === "downVoted") {
      showAlert("Vote Casted", "success");
      setupVote(false);
      setdownVote(true);
    } else if (json.response === "removed") {
      showAlert("Vote Removed", "success");
      setupVote(false);
      setdownVote(false);
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
            height: "185px",
            borderColor: "#E0E0E0",
          }}
        >
          <FontAwesomeIcon
            icon={faCaretUp}
            className="upVote"
            values="up"
            style={{
              margin: "7px 6px 0",
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

              backgroundColor: "#D3D3D3",
            }}
          >
            <h4>{item.votes.count}</h4>
          </div>
          <FontAwesomeIcon
            icon={faCaretDown}
            className="downVote"
            values="down"
            style={{
              margin: "3px 6px 0",
              color: downVote && "#8B0000",
              height: "50px",
              cursor: "pointer",
            }}
            onClick={HandleDownVote}
          />
          <div
            style={{
              display: "grid",
              placeItems: "center",
            }}
          >
            <p
              style={{
                backgroundColor: "#D3D3D3",
                borderRadius: "5%",
                padding: "0.2px 2px 0.2px",
              }}
            >
              {item.votes.total}
            </p>
          </div>
        </div>
        <div className="card" style={{ width: "60%" }}>
          <div className="card-body">
            <div>
              <h5 className="card-title" style={{ display: "inline" }}>
                {title}
              </h5>
              <button
                style={{
                  display: "inline",
                  marginLeft: 20,
                  backgroundColor: "#D0D0D0",
                  padding: 3,
                  borderRadius: 5,
                  borderColor: "#E0E0E0",
                }}
                onClick={async () => {
                  
                  dispatch(
                    profile({
                      pProfile: user,
                    })
                  );
                  navigate("/profile");
                }}
              >
                {" "}
                Asked By: {Questioner}
              </button>
              <p
                style={{
                  display: "inline",
                  marginLeft: 20,
                  backgroundColor: "#E0E0E0",
                  padding: 3,
                  borderRadius: 5,
                }}
              >
                {" "}
                Question Course Code: {item.course}
              </p>
            </div>
            <p className="card-text">{description}</p>
            <button
              className="btn btn-primary mx-3"
              onClick={() => {
                dispatch(
                  question({
                    qPayload: { item, user, time: `${duration} ${v}` },
                  })
                );
                navigate("/toQuestion");
              }}
            >
              View Question
            </button>
            <p className="mx-3" style={{ display: "inline" }}>
              {item.responses.length !== 0
                ? `Replies: ${item.responses.length}`
                : "No Replies Yet"}
            </p>
          </div>
          <div className="card-footer text-muted">
            {duration} {v} ago
          </div>
        </div>
      </div>
    </>
  );
}
