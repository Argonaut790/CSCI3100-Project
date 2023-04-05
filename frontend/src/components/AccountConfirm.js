import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";

const verifyUser = (code) => {
  return axios
    .patch(process.env.REACT_APP_DEV_API_PATH + "/account/auth/" + code)
    .then((response) => {
      return response.data;
    });
};

//TODO: render confirm page
const AccountConfirm = () => {
  const [searchParams] = useSearchParams();
  verifyUser(searchParams.get("confirmationCode"));

  return (
    <div className="accountConfirmContainer">
      <h3>Account confirmed!</h3>
      <Link to={"/home"}>Back to main page</Link>
    </div>
  );
};

export default AccountConfirm;
