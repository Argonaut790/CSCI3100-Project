import { useState, useEffect } from "react";
import axios from "axios";
import UserItem from "./UserItem";
import { useContext } from "react";
import { FollowContext } from "./Follow";
import ImportAll from "./ImportAll";

// Params:
// @userId: userId of current user
// @isFollowerList: true if want to render follower list, false if want to render followed list

// Render followed user / follower list

const images = ImportAll(
  require.context("../images", false, /\.(png|jpe?g|svg)$/)
);

const FollowList = ({ userId, isFollowerList, openedList, setOpenedList }) => {
  const [follows, setFollows] = useState([]);
  let apiString = isFollowerList ? "/follower/" : "/followed/";
  let title = isFollowerList ? "Follower" : "Following";
  const { followListUpdated } = useContext(FollowContext);

  useEffect(() => {
    const fetchUserData = async () => {
      const res = await axios.get(
        process.env.REACT_APP_DEV_API_PATH + "/follow" + apiString + userId
      );
      if (!res.error) {
        setFollows(res.data);
      } else {
        console.log(res);
      }
    };
    fetchUserData().catch(console.error);
  }, [userId, apiString, followListUpdated]);

  const handleRemove = async (followUserId) => {
    const followedUserId = isFollowerList ? userId : followUserId;
    const followerUserId = isFollowerList ? followUserId : userId;

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
      // Update follow list
      setFollows(follows.filter((follow) => follow.userId !== followUserId));
    } else {
      console.log(res);
    }
  };

  const handleOpenedList = (title) => {
    console.log("previous: " + openedList);
    if (title === "Following") {
      setOpenedList((prevState) => [!prevState[0], false, false, false]);
    } else {
      setOpenedList((prevState) => [false, !prevState[1], false, false]);
    }
    console.log("after: " + openedList);
  };

  return (
    <>
      <ul className="list-group" id="following-div">
        <li key="followTitle" className="list-group-item" id="follow-label">
          {title}
          <img
            src={images["angle-up.svg"]}
            alt="angle-up"
            className={`white-img float-end h-75 cursor-pointer arrow ${
              openedList[isFollowerList ? 1 : 0] ? "down" : "up"
            }`}
            onClick={() => handleOpenedList(title)}
          ></img>
        </li>
        {/* Following List */}
        <div
          className="overflow-auto"
          style={{ maxHeight: "50vh" }}
          hidden={isFollowerList || !openedList[0]}
        >
          {follows.map(
            (follow) =>
              title === "Following" && (
                <UserItem
                  key={"Following" + follow.userId}
                  userId={follow.userId}
                  username={follow.username}
                  userAvatar={follow.avatar}
                  buttons={[
                    {
                      text: isFollowerList ? "Remove" : "Unfollow",
                      onClick: handleRemove,
                    },
                  ]}
                />
              )
          )}
          {openedList[0] && !openedList[1] && !follows.length && (
            <li key="no-follow" className="list-group-item">
              No {title}
            </li>
          )}
        </div>
        {/* Follower List */}
        <div
          className="overflow-auto h-100"
          style={{ maxHeight: "50vh" }}
          hidden={!isFollowerList || !openedList[1]}
        >
          {follows.map(
            (follow) =>
              title === "Follower" && (
                <UserItem
                  key={"Follower" + follow.userId}
                  userId={follow.userId}
                  username={follow.username}
                  userAvatar={follow.avatar}
                  buttons={[
                    {
                      text: isFollowerList ? "Remove" : "Unfollow",
                      onClick: handleRemove,
                    },
                  ]}
                />
              )
          )}

          {!openedList[0] && openedList[1] && !follows.length && (
            <li key="no-follow" className="list-group-item">
              No {title}
            </li>
          )}
        </div>
      </ul>
    </>
  );
};

export default FollowList;
