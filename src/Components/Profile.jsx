import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { selectUser } from "../Redux/userSlice";
import defaultPic from "../img/defaulPic.png";
import "../css/profileStyles.css";

export default function Profile(props) {
  const client = useSelector(selectUser);
  const [Image, setImage] = useState("");
  const [CImage, setCImage] = useState("");
  const [status, setStatus] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const me = client.user;
  const user = client.pSlice;

  const uploadPic = () => {
    ref.current.click();
  };

  const clearInput = (e) => {
    e.preventDefault();
    const input = document.getElementById("PicIn");
    input.value = "";
    setImage("");
  };

  const HandleChange = (e) => {
    setImage(e.target.files[0]);
  };

  const PrevPage = (e) => {
    e.preventDefault();
    navigate(-1);
    // dispatch(profile());
  };
  const UploadImage = async () => {
    if (localStorage.getItem("token")) {
      const form = document.getElementById("imgForm");

      const formData = new FormData(form);

      formData.append("name", "User Pfp");
      formData.append("current", CImage ? "true" : "false");

      const response = await fetch(`http://localhost:5000/api/auth/setPfp`, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        body: formData,
      });
      const json = await response.json();
      props.showAlert(`${json.message}`, "success");
      setStatus(!status);
    }
  };

  const DeletePFP = async () => {
    if (localStorage.getItem("token")) {
      const response = await fetch(`http://localhost:5000/api/auth/delPfp`, {
        method: "PUT", // *GET, POST, PUT, DELETE, etc.
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      const json = await response.json();

      if (!json.status) {
        props.showAlert("Image not found, Please try later.", "warning");
      } else {
        props.showAlert("Successfully deleted.", "success");
        setCImage("");
      }
    }
  };

  useEffect(() => {
    const getPFP = async () => {
      const response = await fetch(`http://localhost:5000/api/auth/getPfp`, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          userID: user.pProfile._id,
        }),
      });
      const json = await response.json();
      if (json.status) {
        console.log(json.img.image.data.data);
        // const render = new FileReader();
        // render.onloadend = () => {
        //   setCImage(render.result.toString());
        // };
        // render.readAsDataURL();

        setCImage(
          btoa(String.fromCharCode(...new Uint8Array(json.img.image.data.data)))
        );
        setStatus(true);
      } else {
        setStatus(false);
      }
    };
    getPFP();
  });

  return (
    <>
      <button
        type="button"
        ref={ref}
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        style={{ display: "none" }}
      >
        Launch demo modal
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Uplaod Profile Picture
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <label className="custom-file-upload">
                <form id="imgForm">
                  <input
                    id="PicIn"
                    style={{ display: "inline" }}
                    type="file"
                    name="profileImage"
                    accept=".jpeg,.png,.jfif"
                    onChange={HandleChange}
                  />
                  {Image && (
                    <FontAwesomeIcon
                      style={{ cursor: "pointer", color: "red" }}
                      data-bs-toggle="tooltip"
                      id="deleteSelected"
                      data-bs-placement="top"
                      title="Remove Selected Image"
                      onClick={clearInput}
                      icon={faX}
                    />
                  )}
                </form>
                Image size should be less than 200 kb
              </label>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                disabled={CImage === ""}
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={DeletePFP}
              >
                Delete Current Picture
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={UploadImage}
                data-bs-dismiss="modal"
                disabled={!Image}
              >
                Upload Image
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <button className="btn btn-primary" onClick={PrevPage}>
          go back
        </button>
      </div>
      <div className="my-2 bio">
        <h1 className="my-3" style={{ marginLeft: "20%", display: "inline" }}>
          {user.pProfile.name}{" "}
          {user.pProfile._id === me._id && (
            <p style={{ display: "inline" }}> (YOU) </p>
          )}
        </h1>

        <img
          className="mx-3 my-2"
          id="PFP"
          src={!status ? defaultPic : `data:image/png;base64,${CImage}`}
          alt={defaultPic}
        />
        {user.pProfile._id === me._id && (
          <FontAwesomeIcon
            style={{ cursor: "pointer" }}
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Edit you profile picture"
            onClick={uploadPic}
            icon={faEdit}
          />
        )}
      </div>

      <div
        style={{
          backgroundColor: "#E0E0E0",
          padding: 3,
          borderRadius: 5,
          paddingLeft: 15,
        }}
      >
        <div className="my-2">
          <h5 style={{ display: "inline" }}>Semester Number: </h5>{" "}
          <p style={{ display: "inline" }}>{user.pProfile.semester}</p>
        </div>
        <div className="my-2">
          <h5 style={{ display: "inline" }}>Email: </h5>{" "}
          <p style={{ display: "inline" }}>{user.pProfile.email}</p>
        </div>
        <div className="my-2">
          <h5 style={{ display: "inline" }}>Courses: </h5>
          {user.pProfile.course.map((c) => {
            return (
              <p
                key={c}
                style={{
                  display: "inline",
                  marginLeft: 5,
                  padding: 5,
                  borderRadius: 5,
                  backgroundColor: "#BEBEBE",
                }}
              >
                {" "}
                {c}{" "}
              </p>
            );
          })}
        </div>
        <div className="my-2">
          <h5 style={{ display: "inline" }}>Status: </h5>{" "}
          <p style={{ display: "inline" }}>
            {user.pProfile.status.charAt(0).toUpperCase() +
              user.pProfile.status.slice(1)}{" "}
            {user.pProfile.status === "tutor" && (
              <FontAwesomeIcon
                style={{ cursor: "pointer" }}
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Trusted User"
                icon={faCheckCircle}
              />
            )}
          </p>
        </div>
      </div>
    </>
  );
}
