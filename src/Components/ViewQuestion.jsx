import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, profile } from "../Redux/userSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply } from "@fortawesome/free-solid-svg-icons";
import Ritems from "./Ritems";

export default function ViewQuestion(props) {
  const dispatch = useDispatch();
  const client = useSelector(selectUser);
  const Question = client.qSlice.qPayload;

  const [replies, setReplies] = useState([]);
  const [newAnswer, setNewAnswer] = useState({ answer: "" });

  const replyRef = useRef(null);

  const navigate = useNavigate();

  const handleReply = () => {
    replyRef.current.click();
  };

  const onchange = (e) => {
    setNewAnswer({ ...newAnswer, [e.target.name]: e.target.value });
  };
  const PostReply = async () => {
    if (localStorage.getItem("token")) {
      const response = await fetch(
        `http://localhost:5000/api/response/addresponse`,
        {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({
            answer: newAnswer.answer,
            qID: Question.item._id,
          }),
        }
      );
      const json = await response.json();
      props.showAlert("Reply Posted", "success");

      setReplies([...replies, json.response]);
    }
  };
  useEffect(() => {
    const getQuestions = async () => {
      if (localStorage.getItem("token")) {
        const response = await fetch(
          `http://localhost:5000/api/response/getallresponses`,
          {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
            body: JSON.stringify({ responsesId: Question.item.responses }),
          }
        );
        const json = await response.json();
        setReplies(json.Responses);
      }
    };

    getQuestions();
  }, [Question.item.responses]);

  return (
    <>
      <button
        ref={replyRef}
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#updateModal"
      >
        Launch demo modal
      </button>

      <div
        className="modal fade"
        id="updateModal"
        tabIndex="-1"
        aria-labelledby="updateModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="updateModalLabel">
                Reply to {Question.item.name}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form className="my-3">
                <div className="form-group my-3">
                  <label htmlFor="Fortitle">Title</label>
                  <h2>{Question.item.question.title}</h2>
                </div>
                <div className="form-group my-3">
                  <label htmlFor="forDescription">Description</label>
                  <h5>{Question.item.question.description}</h5>
                </div>
                <div className="form-group my-3">
                  <label htmlFor="forTag">Give Reply</label>
                  <textarea
                    className="form-control"
                    name="answer"
                    value={newAnswer.answer}
                    id="descriptionArea"
                    rows="3"
                    placeholder="Give a reply"
                    onChange={onchange}
                  ></textarea>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                disabled={newAnswer.answer.length <= 7}
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={PostReply}
              >
                Post Reply
              </button>
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 20 }}>
        <h1 style={{ display: "inline" }}>{Question.item.question.title}</h1>
        <button
          style={{
            display: "inline",
            marginLeft: 20,
            backgroundColor: "#D0D0D0",
            padding: 3,
            borderRadius: 5,
            borderColor: "#E0E0E0",
          }}
          onClick={() => {
            dispatch(
              profile({
                pProfile: Question.user,
              })
            );
            navigate("/profile");
          }}
        >
          {" "}
          Asked By: {Question.user.name}
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
          {Question.time} ago
        </p>
        <button
          className="btn btn-primary"
          style={{ float: "right" }}
          onClick={() => {
            navigate("/");
          }}
        >
          Go Back
        </button>
      </div>
      <h5 style={{ margin: 15 }}>{Question.item.question.description}</h5>
      {client.user.status === "tutor" && (
        <button className="btn btn-outline-primary mx-3" onClick={handleReply}>
          <FontAwesomeIcon icon={faReply} /> Give Reply
        </button>
      )}
      <h2 style={{ marginLeft: "40%" }}>
        {Question.item.responses.length > 0 ? "Replies" : "No Replies Yet"}
      </h2>
      {replies.map((reply) => {
        return (
          <div className="my-3" key={reply._id}>
            <Ritems item={reply} showAlert={props.showAlert} />
          </div>
        );
      })}
    </>
  );
}
