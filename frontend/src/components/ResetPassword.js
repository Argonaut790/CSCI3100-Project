import React, { useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const captchaRef = useRef(null);

  const verifyUser = async (code) => {
    axios
      .patch(process.env.REACT_APP_DEV_API_PATH + "/account/auth/" + code)
      .then((response) => {
        if (response.data) {
          // user login
          localStorage.setItem(
            "user",
            JSON.stringify({ userId: response.data })
          );
        }
        return response.data;
      });
  };

  const userId = verifyUser(searchParams.get("confirmationCode"));

  const updatePassword = async (userId, password) => {
    const user = {
      userId: userId,
      password: password,
    };
    axios
      .patch(
        process.env.REACT_APP_DEV_API_PATH + "/account/password/reset/",
        user
      )
      .then((response) => {
        document.getElementById("result").innerText = response.data;
      });
    setPassword("");
    setConfirmPassword("");
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };
  const onChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    let isPasswordInvalid = false;
    let isPasswordEmpty = false;
    let isConfirmPasswordEmpty = false;
    let isConfirmPasswordInvalid = false;

    document.getElementById("result").innerText = "";
    // Client-side validation
    const passwordRegEx = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})"
    );
    if (password === "") {
      isPasswordEmpty = true;
    }
    if (confirmPassword === "") {
      isConfirmPasswordEmpty = true;
    }
    if (password !== confirmPassword) {
      document.getElementById("result").innerText +=
        "- Your confirm password does not match\n";
      isPasswordInvalid = true;
      isConfirmPasswordInvalid = true;
    }
    if (!password.match(passwordRegEx)) {
      document.getElementById("result").innerText +=
        "- Password must contains at least 1 upper case, 1 lower case, 1 number with the minimum length of 8 \n";
      isPasswordInvalid = true;
      isConfirmPasswordInvalid = true;
    }

    if (isPasswordInvalid || isConfirmPasswordInvalid) {
      document.getElementById("result").innerText +=
        "- Please enter your " +
        (isPasswordEmpty ? " password" : "") +
        (isConfirmPasswordEmpty ? " and confirm your password " : "");
      document.getElementById("result").innerText += "\n";
    }
    const token = captchaRef.current.getValue();
    if (!token || token === "") {
      document.getElementById("result").innerText +=
        "- Please finish the captcha";
    }
    if (
      password !== "" &&
      confirmPassword !== "" &&
      password === confirmPassword &&
      password.match(passwordRegEx) &&
      token
    ) {
      captchaRef.current.reset();
      updatePassword(userId, password);
    }
  };

  return (
    <div className="modalContainer">
      <form className="d-flex flex-column" onSubmit={onSubmit}>
        <div className="h6">
          - At least length of 8, 1 upper case, 1 lower case, 1 number for
          password
        </div>
        <div className="col-lg-9 mask-background text-light">
          <h3> Please reset your password.</h3>

          <div className="form-floating">
            <input
              type="password"
              name="password"
              className="form-control floating"
              id="floatingPassword"
              placeholder="password"
              value={password}
              onChange={onChangePassword}
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="password"
              name="confirmPassword"
              className="form-control floating"
              id="floatingConfirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={onChangeConfirmPassword}
            />
            <label htmlFor="floatingConfirmPassword">Confirm Password</label>
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
              value="Create Account"
              className="btn btn-outline-warning"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
