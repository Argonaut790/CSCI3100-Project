import React, { useState, useRef } from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

const ForgotPasswordModal = ({ setShowModal }) => {
  const [email, setEmail] = useState("");
  const captchaRef = useRef(null);

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
