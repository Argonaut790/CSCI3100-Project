import { useState, useEffect } from "react";
import { useNotification } from "../NotificationContext";
// import DeleteButtonContext from "./DeleteButtonContext";
import FetchPost from "./FetchPost";
//function needs to be Capital Letter in the first

import ImportAll from "./ImportAll";
import axios from "axios";

const images = ImportAll(
  require.context("../images", false, /\.(png|jpe?g|svg)$/)
);

const ProfileContent = ({ maskBackgroundRef }) => {
  return (
    <>
      <TopMid />
      <Content maskBackgroundRef={maskBackgroundRef} />
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

const Content = ({ maskBackgroundRef }) => {
  const [deleteButton, setdeleteButton] = useState(false);
  // const [deleteConfirmation, setdeleteConfirmation] = useState(null);

  useEffect(() => {
    setdeleteButton(true);
  }, []);

  // Get userId from localStorage
  const userId = JSON.parse(localStorage.getItem("user")).userId;
  // print the userId in console
  // console.log(userId);

  return (
    <div className="container-fluid p-0" id="mid-center">
      <PersonalInfo />
      <FetchPost
        // userID={userId}
        // handleDeletePost={handleDeletePost}
        userId={userId} // this is to tell FetchPost that it is in profile page
        deleteButton={deleteButton}
        maskBackgroundRef={maskBackgroundRef}
      />
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
  const [userAvatar, setUserAvatar] = useState(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isPrivateChecked, setIsPrivateChecked] = useState(isPrivate);
  const [opacity, setOpacity] = useState(0.1);
  const [profileStatus, setProfileStatus] = useState(null);

  const [edit, setEdit] = useState(false);
  const [editedUsername, setEditedUsername] = useState(username);
  const [editNameCount, setEditNameCount] = useState(username.length);
  const [editedBio, setEditedBio] = useState(userBio);
  const [editBioCount, setEditBioCount] = useState(userBio.split(/\s+/).length);
  const [editedOpacity, setEditedOpacity] = useState(opacity);

  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchFollowData = async () => {
      const res = await axios.get(
        process.env.REACT_APP_DEV_API_PATH + "/follow/stat/" + userId
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
        process.env.REACT_APP_DEV_API_PATH + "/tweet/stat/" + userId
      );
      if (!res.error) {
        setPostNum(res.data.postNum);
      } else {
        console.log(res);
      }
    };
    fetchPostData().catch(console.error);

    const fetchUserData = async () => {
      const res = await axios.get(
        process.env.REACT_APP_DEV_API_PATH + "/account/" + userId
      );
      if (!res.error) {
        setUserBio(res.data.bio);
        setEditedBio(res.data.bio);
        setUsername(res.data.username);
        setEditedUsername(res.data.username);
        setIsPrivate(res.data.isPrivate);
        setIsPrivateChecked(res.data.isPrivate);
        setOpacity(res.data.backgroundOpacity);
        setEditedOpacity(res.data.backgroundOpacity);
        setEditNameCount(res.data.username.length);
        setEditBioCount(res.data.bio.split(/\s+/).length);
      } else {
        console.log(res);
      }
    };
    fetchUserData().catch(console.error);

    const fetchAvatar = async () => {
      try {
        const res = await axios.get(
          process.env.REACT_APP_DEV_API_PATH + "/account/profile/" + userId
        );
        if (!res.error) {
          const avatarData = res.data;
          // console.log("avartarData: ", avatarData);
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
  }, [userId]);

  const handleEdit = () => {
    if (edit) {
      setEdit(false);
    } else {
      setEdit(true);
    }
  };

  const [image, setImage] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEditAvatar = (e) => {
    const target = e.target;
    const value = target.type === "file" ? target.files[0] : target.value;

    setImage(value);

    // Create a preview URL when an image is selected

    if (target.type === "file" && value) {
      const previewURL = URL.createObjectURL(value);
      setPreviewURL(previewURL);
    }
  };

  const onChangeUsername = (e) => {
    setEditedUsername(e.target.value);
    setEditNameCount(e.target.value.length);
  };

  const onChangeBio = (e) => {
    let inputValue = e.target.value;
    // Update the state only if the limited input value is shorter than the current desc
    if (inputValue.split(/\s+/).length <= 200) {
      setEditedBio(inputValue);
    }

    // const descWordCount = this.state.desc.split(/\s+/).length;
    let inputLength = inputValue.split(/\s+/).length;
    const inputArray = inputValue.split(/\s+/);

    if (inputArray[inputLength - 1] === "") {
      inputLength--;
    }

    setEditBioCount(inputLength);

    // Update the input element's height to fit its content
    // it's not working
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  // const onPaste = (e) => {
  //   // Prevent the default paste behavior
  //   e.preventDefault();

  //   // Get the pasted text from the event
  //   const pastedText = e.clipboardData.getData("text");

  //   // Calculate the number of words in the current bio and the pasted text
  //   const currentWordCount = editedBio.split(/\s+/).length;
  //   const pastedWordCount = pastedText.split(/\s+/).length;

  //   // Calculate the remaining words allowed in the bio
  //   const remainingWords = 200 - currentWordCount;

  //   // If the pasted text has more words than allowed, truncate it
  //   const allowedPastedWords = pastedText.split(/\s+/).slice(0, remainingWords);
  //   const allowedPastedText = allowedPastedWords.join(" ");

  //   // Concatenate the current bio and the allowed pasted text
  //   const newBio = editedBio + " " + allowedPastedText;

  //   // Update the state with the new bio and its word count
  //   setEditedBio(newBio);
  //   setEditBioCount(newBio.split(/\s+/).length);

  //   // Update the input element's height to fit its content
  //   e.target.style.height = "auto";
  //   e.target.style.height = `${e.target.scrollHeight}px`;
  // };

  const onChangeOpacity = (e) => {
    setEditedOpacity(e.target.value);
  };

  const refreshPage = () => {
    //navigate(location.pathname, { replace: true });
    window.location.reload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Update only the new username in the backend
    try {
      // Update privacy setting if it is changed
      if (isPrivate !== isPrivateChecked) {
        await axios.patch(
          process.env.REACT_APP_DEV_API_PATH + "/account/private/" + userId,
          { isPrivate: isPrivateChecked }
        );
        setIsPrivate(isPrivateChecked);
      }
      // Update username & bio & opacity if they are changed
      if (
        editedBio !== userBio ||
        editedUsername !== username ||
        editedOpacity !== opacity
      ) {
        const updatedprofile = {
          username: editedUsername,
          bio: editedBio,
          backgroundOpacity: editedOpacity,
        };
        await axios.patch(
          process.env.REACT_APP_DEV_API_PATH + "/account/profile/" + userId,
          updatedprofile
        );
        // Update the state for username and userBio
        setUsername(editedUsername);
        setUserBio(editedBio);
        setOpacity(editedOpacity);
      }

      // Update avatar if it is changed
      if (image) {
        // Create a FormData object and append the image file to it
        const formData = new FormData();
        formData.append("image", image);
        await axios.patch(
          process.env.REACT_APP_DEV_API_PATH +
            "/account/profile/avatar/" +
            userId,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      console.log("Patch successfully!");

      if (previewURL) setUserAvatar(previewURL);
      // clear input fields
      setPreviewURL(null);
      // this.setState({ isLoading: false });

      handleEdit();
      showNotification("User profile has been changed!", "success");
      await new Promise((resolve) => setTimeout(resolve, 3000));
      refreshPage();
      //setTimeout(() => {
      //handleProfileStatus(200);
      //}, 6000);
    } catch (e) {
      // this.setState({ isLoading: false });
      console.log(e);
      console.log("Can't Upload Image!");
      handleEdit();

      showNotification("User profile has not been changed!", "error");
      await new Promise((resolve) => setTimeout(resolve, 3000));
      refreshPage();
    }
    setIsLoading(false);
  };

  return (
    <div id="profile-mask" className="d-flex flex-column shadow py-4">
      {edit ? (
        // edit is true
        <div className="d-flex flex-row justify-content-evenly py-3">
          <div className="w-40 d-flex justify-content-center align-items-center ms-3">
            {previewURL ? (
              <img
                src={previewURL}
                className="btn p-0 border-0 float-start rounded-circle"
                alt="profile-avatar"
                id="profile-avatar"
              />
            ) : (
              <>
                {userAvatar ? (
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer d-flex justify-content-center align-items-center"
                  >
                    <div
                      className="d-flex btn p-0 border-0 justify-content-center align-items-center rounded-circle mask-avatar"
                      id="profile-avatar"
                      style={{
                        backgroundImage: `url(${userAvatar})`,
                        filter: "none",
                      }}
                    >
                      <img
                        src={images["add.svg"]}
                        className="btn p-0 border-0 float-start rounded-circle white-img"
                        alt="profile-avatar"
                        id="edit-avatar"
                      />
                      <input
                        type="file"
                        className="cursor-pointer"
                        id="image-upload"
                        name="image"
                        accept="image/*"
                        onChange={handleEditAvatar}
                      />
                    </div>
                  </label>
                ) : (
                  <div
                    className="d-flex btn p-0 border-0 justify-content-center align-items-center rounded-circle mask-avatar"
                    id="profile-avatar"
                  >
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer d-flex justify-content-center align-items-center"
                    >
                      <img
                        src={images["add.svg"]}
                        className="btn p-0 border-0 float-start rounded-circle white-img"
                        alt="profile-avatar"
                        id="edit-avatar"
                      />
                      <input
                        type="file"
                        className="cursor-pointer"
                        id="image-upload"
                        name="image"
                        accept="image/*"
                        onChange={handleEditAvatar}
                      />
                    </label>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="d-grid gap-3 w-60 p-4 text-muted">
            {/* UserName and Id */}
            <div className="form-floating">
              <input
                type="text"
                name="Username"
                className="form-control floating"
                id="floatingUsername"
                placeholder="Edit UserName"
                value={editedUsername}
                onChange={onChangeUsername}
                maxLength={8}
              />
              <label htmlFor="floatingUsername">
                Edit UserName {editNameCount}/8
              </label>
            </div>

            {/* bio */}
            <div className="form-floating ">
              <textarea
                type="text"
                name="Bio"
                className="overflow-hidden form-control floating"
                id="floatingUsername"
                placeholder="Edit Bio"
                value={editedBio}
                onChange={onChangeBio}
                style={{ resize: "none", height: "fit-content" }}
              />
              <label htmlFor="floatingUsername">
                Edit Bio {editBioCount}/200
              </label>
            </div>
            {/* privacy toggle switch */}
            <div className="d-flex flex-row">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={isPrivateChecked}
                  onChange={() => setIsPrivateChecked(!isPrivateChecked)}
                />
                <span className="slider round"></span>
              </label>
              <div className="fw-bold text-uppercase text-light ps-3 d-flex justify-content-center align-items-center">
                {isPrivateChecked ? "Private" : "Public"}
              </div>
            </div>
            <div>
              <div>Background Opacity</div>
              <input
                className="opacity-slider"
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={editedOpacity}
                onChange={onChangeOpacity}
              />
            </div>
            {/* Exit Editing Button */}
            {isLoading ? (
              <div className="d-flex flex-row justify-content-evenly">
                <button
                  type="button"
                  className="btn btn-dark w-75"
                  onClick={handleSubmit}
                  style={{ margin: "1rem" }}
                >
                  Confirm Change
                </button>
                <img
                  className="spinner"
                  src={images["doge.png"]}
                  alt="spinner"
                ></img>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-dark"
                onClick={handleSubmit}
                style={{ margin: "1rem" }}
              >
                Confirm Change
              </button>
            )}
          </div>
        </div>
      ) : (
        // edit is false
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
              {username} #{userId}
            </div>
            <div className="text-break">{userBio}</div>
            <button type="button" className="btn btn-dark" onClick={handleEdit}>
              Edit Profile Button
            </button>
          </div>
        </div>
      )}
      <div className="py-2 h4 d-flex flex-row justify-content-evenly">
        <div> {postNum} Posts</div>
        <div> {followerNum} Followers</div>
        <div> {followedNum} Followings</div>
        {isPrivate && <div> {pendingNum} Pending</div>}
      </div>
    </div>
  );
};

export default ProfileContent;
