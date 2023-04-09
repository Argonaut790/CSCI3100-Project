import { useState, useEffect } from "react";
// import DeleteButtonContext from "./DeleteButtonContext";
import FetchPost from "./FetchPost";
//function needs to be Capital Letter in the first

import ImportAll from "./ImportAll";
import axios from "axios";

const images = ImportAll(
  require.context("../images", false, /\.(png|jpe?g|svg)$/)
);

const UserProfileContent = ({ targetUserId }) => {
  return (
    <>
      <TopMid />
      <Content targetUserId={targetUserId} />
    </>
  );
};

const TopMid = () => {
  return (
    <div className="container-fluid top-p-1" id="top-mid">
      <div className="row">
        <div className="h3 head d-flex">💩 User Profile</div>
      </div>
    </div>
  );
};

const Content = ({ targetUserId }) => {
  const userId = JSON.parse(localStorage.getItem("user")).userId;
  const [followedNum, setFollowedNum] = useState(0);
  const [followerNum, setFollowerNum] = useState(0);
  const [userBio, setUserBio] = useState("");
  const [username, setUsername] = useState("");
  const [userAvatar, setUserAvatar] = useState(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isRequested, setIsRequested] = useState(false);

  useEffect(() => {
    const fetchFollowData = async () => {
      const res = await axios.get(
        process.env.REACT_APP_DEV_API_PATH + "/follow/stat/" + targetUserId
      );
      if (!res.error) {
        setFollowedNum(res.data.followedNum);
        setFollowerNum(res.data.followerNum);
      } else {
        console.log(res);
      }
    };
    fetchFollowData().catch(console.error);

    const fetchUserData = async () => {
      const res = await axios.get(
        process.env.REACT_APP_DEV_API_PATH + "/account/" + targetUserId
      );
      if (!res.error) {
        setUserBio(res.data.bio);
        setUsername(res.data.username);
        setIsPrivate(res.data.isPrivate);
      } else {
        console.log(res);
      }
    };
    fetchUserData().catch(console.error);

    const fetchVisiable = async () => {
      const res = await axios.get(
        process.env.REACT_APP_DEV_API_PATH +
          `/follow/visiable/${userId}/${targetUserId}`
      );
      if (!res.error) {
        if (
          res.data &&
          res.data !== [] &&
          res.data.isAccepted &&
          res.data.isAccepted === true
        ) {
          // user followed target user
          setIsVisible(true);
          setIsFollowed(true);
          setIsRequested(false);
        } else if (
          res.data &&
          res.data !== [] &&
          res.data.isAccepted === false &&
          isPrivate
        ) {
          // user requested target user
          setIsVisible(false);
          setIsFollowed(false);
          setIsRequested(true);
        } else if (!isPrivate) {
          // user not followed target user and target user is public
          setIsVisible(true);
          setIsFollowed(false);
          setIsRequested(false);
        } else {
          // user not followed target user and target user is private
          setIsVisible(false);
          setIsFollowed(false);
          setIsRequested(false);
        }
      } else {
        console.log(res);
      }
    };
    fetchVisiable().catch(console.error);

    const fetchAvatar = async () => {
      try {
        const res = await axios.get(
          process.env.REACT_APP_DEV_API_PATH +
            "/account/profile/" +
            targetUserId
        );
        if (!res.error) {
          const avatarData = res.data;
          console.log("avartarData: ", avatarData);
          const imageResponse = await axios.get(avatarData, {
            responseType: "blob",
          });
          const imageURL = URL.createObjectURL(imageResponse.data);
          setUserAvatar(imageURL);
        } else {
          console.log(res);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchAvatar().catch(console.error);
  }, [targetUserId, isPrivate, userId]);

  const handleFollow = async () => {
    const followData = {
      followedUserId: targetUserId,
      followerUserId: userId,
    };
    console.log(followData);
    const res = await axios.post(
      process.env.REACT_APP_DEV_API_PATH + "/follow/",
      followData
    );
    if (!res.error) {
      if (res.data.isAccepted === true) {
        setIsFollowed(true);
        setIsVisible(true);
      } else {
        setIsRequested(true);
      }
    } else {
      console.log(res);
    }
  };

  const handleUnfollow = async () => {
    const followedUserId = targetUserId;
    const followerUserId = userId;

    const res = await axios.delete(
      process.env.REACT_APP_DEV_API_PATH + "/follow/",
      {
        params: {
          followedUserId,
          followerUserId,
        },
      }
    );
    if (!res.error) {
      console.log(res);
      setIsFollowed(false);
      if (isPrivate) {
        setIsVisible(false);
      }
    } else {
      console.log(res);
    }
  };
  return (
    <div className="container-fluid p-0" id="mid-center">
      <div className="d-flex flex-row justify-content-evenly py-3">
        <div className="w-40 d-flex justify-content-center align-items-center ms-3">
          {userAvatar ? (
            <img
              src={userAvatar}
              className="float-start rounded-circle"
              alt="profile-avatar"
              id="profile-avatar"
            />
          ) : (
            <img
              src={images["avatar.png"]}
              className="float-start rounded-circle"
              alt="profile-avatar"
              id="profile-avatar"
              style={{ filter: "brightness(1) invert(1)" }}
            />
          )}
        </div>
        <div className="d-grid gap-2 w-60 p-4">
          <div className="fw-bold border-bottom py-2">
            {username} #{targetUserId}
          </div>
          <div className="text-break">{userBio}</div>
          {isFollowed ? (
            <button
              type="button"
              className="btn btn-dark"
              onClick={handleUnfollow}
            >
              Unfollow
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-dark"
              onClick={handleFollow}
            >
              {isRequested ? "Requested" : "Follow"}
              {/* TODO: unrequested */}
            </button>
          )}
        </div>
      </div>

      <div className="py-2 h4 d-flex flex-row justify-content-evenly">
        <div> {followerNum} Followers</div>
        <div> {followedNum} Followings</div>
      </div>
      {isVisible && <FetchPost userId={targetUserId} deleteButton={false} />}
    </div>
  );
};

export default UserProfileContent;
