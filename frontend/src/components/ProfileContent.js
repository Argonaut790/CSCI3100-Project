import { useState, useEffect } from "react";
import DeleteButtonContext from "./DeleteButtonContext";
import FetchPost from "./FetchPost";
//function needs to be Capital Letter in the first

import ImportAll from "./ImportAll";

const images = ImportAll(
  require.context("../images", false, /\.(png|jpe?g|svg)$/)
);

const ProfileContent = () => {
  return (
    <>
      <TopMid />
      <Content />
    </>
  );
};

const TopMid = () => {
  return (
    <div className="container-fluid top-p-1" id="top-mid">
      <div className="row">
        <div className="h3 head d-flex">💩 Profile</div>
      </div>
    </div>
  );
};

const Content = () => {
  const [deleteButton, setdeleteButton] = useState(null);

  useEffect(() => {
    const deleteButtonDiv = (
      <div className="btn">
        <img
          src={images["trash.svg"]}
          className="white-img"
          alt="delete-button"
          id="delete-button"
        />
      </div>
    );
    setdeleteButton(deleteButtonDiv);
  }, []);

  return (
    <div className="container-fluid p-0" id="mid-center">
      <PersonalInfo />
      <DeleteButtonContext.Provider value={deleteButton}>
        <FetchPost />
      </DeleteButtonContext.Provider>
    </div>
  );
};

const PersonalInfo = () => {
  return (
    <div id="profile-mask" className="d-flex flex-column shadow py-4">
      <div className="d-flex flex-row justify-content-evenly py-3">
        <div className="w-40 d-flex justify-content-center align-items-center ms-3">
          <img
            src={images["user_avatar.jpg"]}
            className="float-start rounded-circle"
            alt="profile-avatar"
            id="profile-avatar"
          />
        </div>
        <div className="d-grid gap-2 w-60 p-4">
          <div className="fw-bold border-bottom py-2">UserName #UserID</div>
          <div className="text-break">
            User Description Penultimate | CSCI | CENG | CUHK | CSCI3100
          </div>
          <button type="button" className="btn btn-dark">
            Edit Profile Button
          </button>
        </div>
      </div>
      <div className="py-2 h4 d-flex flex-row justify-content-evenly">
        <div> # Posts</div>
        <div> # Followers</div>
        <div> # Followings</div>
      </div>
    </div>
  );
};

export default ProfileContent;
