import React from "react";
import { Link } from "react-router-dom";


export default function Error() {
  return (
    <div className="">
      <h1 style={{lineHeight:2}}>
        404 Error: <h6 style={{marginLeft:170}}><b>Not Found</b>, the page you are trying to reach is unavailable.</h6>
      </h1>
      <Link className="btn btn-secondary" to={"/"}>Go back</Link>
    </div>
  );
}
