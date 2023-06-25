import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, logout, profile } from "../Redux/userSlice";

export default function Navebar(props) {
  const client = useSelector(selectUser);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    props.showAlert("Logged Out, Successfully", "success");
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/login");
  };
  const toProfile = async (e) => {
    e.preventDefault();
    dispatch(
      profile({
        pProfile: client.user
      })
    );
    navigate("profile");
  };
  return (
    <div>
      <nav
        style={{ backgroundColor: "#253356" }}
        className="navbar navbar-expand-lg navbar-dark bg-ligth"
      >
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <b>peerTutor</b>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" aria-current="page" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">
                  About
                </Link>
              </li>
            </ul>
            <form>
              {localStorage.getItem("token") && (
                <div style={{ marginRight: 80 }}>
                  <div className="dropdown">
                    <button
                      className="btn btn-secondary dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="fa-solid fa-user text-light"></i> Options
                    </button>
                    <ul className="dropdown-menu">
                      <li style={{ padding: "0" }}>
                        <button
                          className="btn btn-outline-primary"
                          onClick={toProfile}
                        >
                          <FontAwesomeIcon
                            icon={faUser}
                            style={{
                              margin: "0 10 0",
                              border: "solid",
                              padding: "7px",
                              borderRadius: "100%",
                            }}
                          />{" "}
                          My Profile
                        </button>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="btn btn-primary my-1"
                          style={{ marginLeft: 40 }}
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </nav>
    </div>
  );
}
