import React from "react";

function Alert(props) {
  function capitalize(type) {
    return type[0].toUpperCase() + type.slice(1);
  }
  return (
    <div style={{height:50}}>
      {props.alert && (
        <div className={`alert alert-${props.alert.type}`} role="alert">
          <strong>{capitalize(props.alert.type)}</strong> :{" "}
          {props.alert.message}
        </div>
      )}
    </div>
  );
}

export default Alert;
