import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../Redux/userSlice";
export default function AskQuestion({showAlert}) {
  // Getting user's info from store
  const client = useSelector(selectUser);
  const courses = client.user.course;
  const Navigate = useNavigate();
  // Controlling the onchange of title and description
  const [question, setQuestion] = useState({
    title: "",
    description: "",
    code: "...",
  });
  const onChangeHandle = (e) => {
    setQuestion({ ...question, [e.target.name]: e.target.value });
  };
  const postQuestion = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `http://localhost:5000/api/query/createquery`,
      {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          title: question.title,
          description: question.description ? question.description: "No description Given" ,
          course: question.code,
        }),
      }
    );
    const json = await response.json();
    if (json.progress) {
      showAlert("Posted Successfully", "success");
      Navigate("/");
    }
  };
  return (
    <>
      <div>
        <h2 className="my-3">Let's make a query</h2>
        <button
          className="btn btn-danger"
          style={{ float: "right", margin:20}}
          onClick={() => {
            Navigate("/");
          }}
        >
          Cancel
        </button>
      </div>
      <form>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="qtitle">Title *</label>
            <input
              type="text"
              name="title"
              value={question.title}
              className="form-control"
              id="qtitle"
              placeholder="Question title"
              onChange={onChangeHandle}
            />
          </div>
          <div className="form-group">
            <label htmlFor="descriptionArea" style={{ marginTop: 15 }}>
              Description
            </label>
            <textarea
              className="form-control"
              name="description"
              value={question.description}
              id="descriptionArea"
              rows="3"
              placeholder="Question Description"
              onChange={onChangeHandle}
            ></textarea>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group col-md-4">
            <label htmlFor="inputState" style={{ marginTop: 12 }}>
              Course Code *
            </label>
            <select
              id="inputState"
              className="form-control my-2"
              name="code"
              value={question.code}
              onChange={onChangeHandle}
            >
              <option value={"..."}>... </option>
              {courses.map((code) => {
                return <option key={code}> {code} </option>;
              })}
            </select>
          </div>
        </div>
        <button
          disabled={question.code === "..." || question.title.length < 5}
          type="submit"
          onClick={postQuestion}
          className="btn btn-primary"
        >
          Post the question
        </button>
      </form>
    </>
  );
}
