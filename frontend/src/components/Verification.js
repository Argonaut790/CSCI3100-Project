import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const verifyUser = (code) => {
  return axios
    .patch("http://localhost:5500/account/auth/" + code)
    .then((response) => {
      return response.data;
    });
};

const AccountConfirm = (props) => {
  console.log(props);
  //   if (props.match.path === "/confirm/:confirmationCode") {
  //     verifyUser(props.match.params.confirmationCode);
  //   }

  return (
    <div className="container">
      <header>
        <h3>
          <strong>Account confirmed!</strong>
        </h3>
      </header>
      <Link to={"/home"}>Back to main page</Link>
    </div>
  );
};

export default AccountConfirm;
