import { useState, useEffect } from "react";
import axios from "axios";
import ImportAll from "./ImportAll";

// Params:
// @userId: userId of current user
// Render pending follower list
const PendingFollowList = ({ userId }) => {
  const [follows, setFollows] = useState([]);
  const [isPrivate, setIsPrivate] = useState(false);

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

  const images = ImportAll(
    require.context("../images", false, /\.(png|jpe?g|svg)$/)
  );

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
            <li key={follow.userId} className="list-group-item">
              <div className="post-user-info">
                <img
                  src={images["user_avatar.jpg"]}
                  className="float-start post-user-avatar"
                  alt="user-avatar"
                />
                <div className="d-flex align-items-md-center h-100 m-0 post-user-id">
                  <div className="fw-bold">{follow.username}</div>
                  <div>#{follow.userId}</div>
                </div>
              </div>
            </li>
          ))}
          {!follows.length && (
            <li key="no-follow" className="list-group-item">
              No Pending Follower Found
            </li>
          )}
        </ul>
      )}
    </>
  );
};

export default PendingFollowList;
