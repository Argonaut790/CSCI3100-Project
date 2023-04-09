import { useState, useEffect } from "react";
import axios from "axios";
import UserItem from "./UserItem";
import { useContext } from "react";
import { FollowContext } from "./Follow";

// Params:
// @userId: userId of current user
// Render pending follower list
const SuggestedFollowList = ({ userId }) => {
  const [follows, setFollows] = useState([]);
  const { setFollowListUpdated } = useContext(FollowContext);

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
    console.log(followData);
    const res = await axios.post(
      process.env.REACT_APP_DEV_API_PATH + "/follow/",
      followData
    );
    if (!res.error) {
      // Update current list
      setFollows(follows.filter((follow) => follow.userId !== followedUserId));
      // Update follower list
      setFollowListUpdated((prevState) => !prevState);
    } else {
      console.log(res);
    }
  };

  //TODO: get avatar from db
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
          </li>
          {follows.map((follow) => (
            <UserItem
              userId={follow.userId}
              username={follow.username}
              buttons={[
                {
                  text: "Follow",
                  onClick: handleFollow,
                },
              ]}
            />
          ))}
        </ul>
      )}
    </>
  );
};

export default SuggestedFollowList;
