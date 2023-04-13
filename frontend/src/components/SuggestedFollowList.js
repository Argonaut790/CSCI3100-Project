import { useState, useEffect } from "react";
import axios from "axios";
import UserItem from "./UserItem";
import { useContext } from "react";
import { FollowContext } from "./Follow";
import ImportAll from "./ImportAll";
import { useNotification } from "../NotificationContext";

// Params:
// @userId: userId of current user
// Render pending follower list

const images = ImportAll(
  require.context("../images", false, /\.(png|jpe?g|svg)$/)
);

const SuggestedFollowList = ({ userId, openedList, setOpenedList }) => {
  const [follows, setFollows] = useState([]);
  const { setFollowListUpdated } = useContext(FollowContext);
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchFollowData = async () => {
      const res = await axios.get(
        process.env.REACT_APP_DEV_API_PATH + "/follow/suggestion/" + userId
      );
      if (!res.error && res.data) {
        setFollows(res.data);
      } else {
        console.log(res);
      }
    };
    fetchFollowData().catch(console.error);
  }, [userId]);

  const handleFollow = async (followedUserId) => {
    const followData = {
      followedUserId: followedUserId,
      followerUserId: userId,
    };
    const res = await axios.post(
      process.env.REACT_APP_DEV_API_PATH + "/follow/",
      followData
    );
    if (!res.error) {
      // Update current list
      setFollows(follows.filter((follow) => follow.userId !== followedUserId));
      // Update follower list
      setFollowListUpdated((prevState) => !prevState);
      if (res.data.isAccepted) {
        showNotification("Follow successfully!", "success");
      } else {
        showNotification("Request Sent!", "success");
      }
    } else {
      console.log(res);
    }
  };

  const handleOpenedList = () => {
    setOpenedList((prevState) => [false, false, false, !prevState[3]]);
  };

  return (
    <>
      {follows.length > 0 && (
        <ul className="list-group" id="following-div">
          <li
            key="suggestedFollowTitle"
            className="list-group-item"
            id="followTitle-label"
          >
            Suggested
            <img
              src={images["angle-up.svg"]}
              alt="angle-up"
              className={`white-img float-end h-75 cursor-pointer arrow ${
                openedList[3] ? "down" : "up"
              }`}
              onClick={() => handleOpenedList()}
            ></img>
          </li>
          <div
            className="overflow-auto"
            style={{ maxHeight: "50vh" }}
            hidden={openedList[3] ? false : true}
          >
            {follows.map((follow) => (
              <UserItem
                key={"Suggested" + follow.userId}
                userId={follow.userId}
                username={follow.username}
                userAvatar={follow.avatar}
                buttons={[
                  {
                    text: "Follow",
                    onClick: handleFollow,
                  },
                ]}
              />
            ))}
          </div>
        </ul>
      )}
    </>
  );
};

export default SuggestedFollowList;
