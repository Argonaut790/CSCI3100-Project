import { useState, useEffect } from "react";
import DeleteButtonContext from "./DeleteButtonContext";
import FetchPost from "./FetchPost";
//function needs to be Capital Letter in the first

import ImportAll from "./ImportAll";
import axios from "axios";

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
  // Get userId from localStorage
  const userId = JSON.parse(localStorage.getItem("user")).userId;
  const [followedNum, setFollowedNum] = useState(0);
  const [followerNum, setFollowerNum] = useState(0);
  const [pendingNum, setPendingNum] = useState(0);
  const [postNum, setPostNum] = useState(0);
  const [userBio, setUserBio] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchFollowData = async () => {
      const res = await axios.get(
        "http://localhost:5500/follow/stat/" + userId
      );
      if (!res.error) {
        setFollowedNum(res.data.followedNum);
        setFollowerNum(res.data.followerNum);
        setPendingNum(res.data.pendingNum);
      } else {
        console.log(res);
      }
    };
    fetchFollowData().catch(console.error);

    const fetchPostData = async () => {
      const res = await axios.get("http://localhost:5500/tweet/stat/" + userId);
      if (!res.error) {
        setPostNum(res.data.postNum);
      } else {
        console.log(res);
      }
    };
    fetchPostData().catch(console.error);

    const fetchUserData = async () => {
      const res = await axios.get("http://localhost:5500/account/" + userId);
      if (!res.error) {
        setUserBio(res.data.bio);
        setUsername(res.data.username);
      } else {
        console.log(res);
      }
    };
    fetchUserData().catch(console.error);
  }, [userId]);

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
          <div className="fw-bold border-bottom py-2">
            {username} #{userId}
          </div>
          <div className="text-break">{userBio}</div>
          <button type="button" className="btn btn-dark">
            Edit Profile Button
          </button>
        </div>
      </div>
      <div className="py-2 h4 d-flex flex-row justify-content-evenly">
        <div> {postNum} Posts</div>
        <div> {followerNum} Followers</div>
        <div> {followedNum} Followings</div>
        <div> {pendingNum} Pending</div>
      </div>
    </div>
  );
};

export default ProfileContent;
