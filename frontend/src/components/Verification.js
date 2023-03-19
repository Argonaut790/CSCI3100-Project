import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";

const verifyUser = (code) => {
  return axios
    .patch("http://localhost:5500/account/auth/" + code)
    .then((response) => {
      return response.data;
    });
};

const AccountConfirm = () => {
  const [searchParams] = useSearchParams();
  verifyUser(searchParams.get("confirmationCode"));

  return (
    <div className="container">
      <h3>Account confirmed!</h3>
      <Link to={"/home"}>Back to main page</Link>
    </div>
  );
};

export default AccountConfirm;