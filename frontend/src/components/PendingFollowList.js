import { useState, useEffect } from "react";
import axios from "axios";
import UserItem from "./UserItem";
import { useContext } from "react";
import { FollowContext } from "./Follow";

// Params:
// @userId: userId of current user
// Render pending follower list
const PendingFollowList = ({ userId }) => {
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

  //TODO: get avatar from db
  return (
    <>
      {isPrivate && (
        <ul className="list-group" id="following-div">
          <li
            key="followingTitle"
            className="list-group-item"
            id="following-label"
          >
            Pending Follower
          </li>
          {follows.map((follow) => (
            <UserItem
              userId={follow.userId}
              username={follow.username}
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
            <li key="no-follow" className="list-group-item">
              No Pending Follower
            </li>
          )}
        </ul>
      )}
    </>
  );
};

export default PendingFollowList;
