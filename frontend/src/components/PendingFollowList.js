import { useState, useEffect } from "react";
import axios from "axios";
import UserItem from "./UserItem";
import { useContext } from "react";
import { FollowContext } from "./Follow";
import ImportAll from "./ImportAll";

// Params:
// @userId: userId of current user
// Render pending follower list

const images = ImportAll(
  require.context("../images", false, /\.(png|jpe?g|svg)$/)
);

const PendingFollowList = ({ userId, openedList, setOpenedList }) => {
  const [follows, setFollows] = useState([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const { setFollowListUpdated } = useContext(FollowContext);

  useEffect(() => {
    const fetchUserData = async () => {
      const res = await axios.get(
        process.env.REACT_APP_DEV_API_PATH + "/account/" + userId
      );
      if (!res.error) {
        setIsPrivate(res.data.isPrivate);
      } else {
        console.log(res);
      }
    };
    fetchUserData().catch(console.error);

    const fetchFollowData = async () => {
      const res = await axios.get(
        process.env.REACT_APP_DEV_API_PATH + "/follow/pending/" + userId
      );
      if (!res.error) {
        setFollows(res.data);
      } else {
        console.log(res);
      }
    };
    fetchFollowData().catch(console.error);
  }, [userId]);

  const handleAccpet = async (followerUserId) => {
    const followData = {
      followedUserId: userId,
      followerUserId: followerUserId,
    };
    console.log(followData);
    const res = await axios.patch(
      process.env.REACT_APP_DEV_API_PATH + "/follow/",
      followData
    );
    if (!res.error) {
      // Update pending list
      setFollows(follows.filter((follow) => follow.userId !== followerUserId));
      // Update follower list
      setFollowListUpdated((prevState) => !prevState);
    } else {
      console.log(res);
    }
  };

  const handleReject = async (followerUserId) => {
    const followedUserId = userId;
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
      // Update pending list
      setFollows(follows.filter((follow) => follow.userId !== followerUserId));
    } else {
      console.log(res);
    }
  };

  const handleOpenedList = () => {
    setOpenedList((prevState) => [false, false, !prevState[2], false]);
  };

  return (
    <>
      {isPrivate && (
        <ul className="list-group" id="following-div">
          <li
            key="pendingfollowTitle"
            className="list-group-item"
            id="pending-follow-label"
          >
            Pending Follower
            <img
              src={images["angle-up.svg"]}
              alt="angle-up"
              className={`white-img float-end h-75 cursor-pointer arrow ${
                openedList[2] ? "down" : "up"
              }`}
              onClick={() => handleOpenedList()}
            ></img>
          </li>

          <div
            className="overflow-auto"
            style={{ maxHeight: "50vh" }}
            hidden={openedList[2] ? false : true}
          >
            {follows.map((follow) => (
              <UserItem
                userId={follow.userId}
                username={follow.username}
                userAvatar={follow.avatar}
                buttons={[
                  {
                    text: "Accept",
                    onClick: handleAccpet,
                  },
                  {
                    text: "Reject",
                    onClick: handleReject,
                  },
                ]}
              />
            ))}

            {!follows.length && (
              <li key="no-pending-follow" className="list-group-item">
                No Pending Follower
              </li>
            )}
          </div>
        </ul>
      )}
    </>
  );
};

export default PendingFollowList;
