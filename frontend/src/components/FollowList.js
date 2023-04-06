import { useState, useEffect } from "react";
import axios from "axios";
import UserItem from "./UserItem";

// Params:
// @userId: userId of current user
// @isFollowerList: true if want to render follower list, false if want to render followed list

// Render followed user / follower list
const FollowList = ({ userId, isFollowerList }) => {
  const [follows, setFollows] = useState([]);
  let apiString = isFollowerList ? "/follower/" : "/followed/";
  let title = isFollowerList ? "Follower" : "Following ";

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
  }, [userId, apiString]);

  const handleRemove = async (followUserId) => {
    const followData = isFollowerList
      ? {
          followedUserId: userId,
          followerUserId: followUserId,
        }
      : {
          followedUserId: followUserId,
          followerUserId: userId,
        };
    console.log(followData);
    const res = await axios.delete(
      process.env.REACT_APP_DEV_API_PATH + "/follow/",
      followData
    );
    if (!res.error) {
      console.log(res);
      // Show Successful message
    } else {
      console.log(res);
      // Show Error message
    }
  };

  return (
    <>
      <ul className="list-group" id="following-div">
        <li
          key="followingTitle"
          className="list-group-item"
          id="following-label"
        >
          {title}
        </li>
        {follows.map((follow) => (
          <UserItem
            userId={follow.userId}
            username={follow.username}
            buttons={[
              {
                text: isFollowerList ? "Remove" : "Unfollow",
                onClick: handleRemove,
              },
            ]}
          />
        ))}
        {!follows.length && (
          <li key="no-follow" className="list-group-item">
            No {title} Found
          </li>
        )}
      </ul>
    </>
  );
};

export default FollowList;
