import React, { useState, useRef } from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

const ForgotPasswordModal = ({ setShowModal }) => {
  const [email, setEmail] = useState("");
  const captchaRef = useRef(null);

  /* Module: resetPassword
  * Version: 1.0??? (4/27/2023???)
  * Description: This module is used to send a PATCH request to the server to reset the user's password.
  * It uses the axios.patch method to send the request with the user's email.
  * If the request is successful and the status is 200, it updates the result element with the response data.
  * If there is an error, it updates the result element with the error response data.
  * Parameter: None
  */
  const resetPassword = () => {
    axios
      .patch(process.env.REACT_APP_DEV_API_PATH + "/account/password/", {
        email: email,
      })
      .then((res) => {
        if (res.status === 200) {
          document.getElementById("result").innerText = res.data;
        }
      })
      .catch((err) => {
        document.getElementById("result").innerText = err.response.data;
      });

    setEmail("");
  };

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    document.getElementById("result").innerText = "";
    const token = captchaRef.current.getValue();

    if (email === "") {
      document.getElementById("result").innerText +=
        "Please enter your email. \n";
      document.getElementById("floatingEmail").className =
        "form-control floating is-invalid";
    } else {
      document.getElementById("floatingEmail").className =
        "form-control floating";
    }

    if (!token || token === "") {
      document.getElementById("result").innerText +=
        "Please finish the captcha";
    }
    if (email !== "" && token) {
      captchaRef.current.reset();
      resetPassword();
    }
  };

  return (
    <div className="modalContainer">
      <button
        type="button"
        className="btn-close"
        onClick={() => setShowModal(false)}
      ></button>

      <form className="d-flex flex-column" onSubmit={onSubmit}>
        <div className="form-floating ">
          <input
            type="email"
            name="email"
            className="form-control floating"
            id="floatingEmail"
            placeholder="email"
            value={email}
            onChange={onChangeEmail}
          />
          <label htmlFor="floatingEmail">Email address</label>
        </div>

        <div className="form-floating mb-3">
          <ReCAPTCHA
            sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
            ref={captchaRef}
          />
        </div>

        <div className="buttonContainer d-grid">
          <input
            type="submit"
            value="Reset Password"
            className="btn btn-outline-warning"
          />
        </div>
      </form>
      <span id="result"></span>
    </div>
  );
};

export default ForgotPasswordModal;
