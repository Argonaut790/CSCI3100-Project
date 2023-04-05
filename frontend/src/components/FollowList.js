import { useState, useEffect } from "react";
import axios from "axios";
import ImportAll from "./ImportAll";

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

  const images = ImportAll(
    require.context("../images", false, /\.(png|jpe?g|svg)$/)
  );

  //TODO: get avatar from db
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
            No {title} Found
          </li>
        )}
      </ul>
    </>
  );
};

export default FollowList;
