import React from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

//TODO: render confirm page
const AccountConfirm = () => {
  const [searchParams] = useSearchParams();
  const verifyUser = async (code) => {
    return axios
      .patch(process.env.REACT_APP_DEV_API_PATH + "/account/auth/" + code)
      .then((response) => {
        return response.data;
      });
  };

  verifyUser(searchParams.get("confirmationCode"));

  return (
    <>
      <div className="col-lg-9 mask-background text-light">
        <h3> Account confirmed, please login!</h3>
      </div>
    </>
  );
};

export default AccountConfirm;
