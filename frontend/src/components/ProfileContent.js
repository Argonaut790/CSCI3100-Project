import FetchPost from "./FetchPost";
//function needs to be Capital Letter in the first

import ImportAll from "./ImportAll";
import React, { useEffect, useState } from "react";
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
  return (
    <div className="container-fluid p-0" id="mid-center">
      <PersonalInfo />
      <FetchPost />
    </div>
  );
};

const PersonalInfo = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [followedNum, setFollowedNum] = useState(0);
  const [followerNum, setFollowerNum] = useState(0);
  const [pendingNum, setPendingNum] = useState(0);
  const [postNum, setPostNum] = useState(0);
  const [userBio, setUserBio] = useState("");

  useEffect(() => {
    const fetchFollowData = async () => {
      const res = await axios.get(
        "http://localhost:5500/follow/stat/" + user.userId
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
      const res = await axios.get(
        "http://localhost:5500/tweet/stat/" + user.userId
      );
      if (!res.error) {
        setPostNum(res.data.postNum);
      } else {
        console.log(res);
      }
    };
    fetchPostData().catch(console.error);

    const fetchBioData = async () => {
      const res = await axios.get(
        "http://localhost:5500/account/bio/" + user.userId
      );
      if (!res.error) {
        setUserBio(res.data.bio);
      } else {
        console.log(res);
      }
    };
    fetchBioData().catch(console.error);
  }, [user]);

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
            {user.username} #{user.userId}
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
