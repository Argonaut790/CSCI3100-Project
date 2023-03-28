import { useState, useEffect } from "react";
import axios from "axios";

const FollowerList = (userId) => {
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const res = await axios.get(
        "http://localhost:5500/follow/follower/" + userId
      );
      if (!res.error) {
        setFollowers(res.data);
      } else {
        console.log(res);
      }
    };
    fetchUserData().catch(console.error);
  }, [userId]);

  return (
    <>
      <ul className="list-group" id="following-div">
        <li className="list-group-item" id="following-label">
          Following
        </li>
        <li className="list-group-item">
          <UserID />
        </li>
        <li className="list-group-item">
          <UserID />
        </li>
        <li className="list-group-item">
          <UserID />
        </li>
        <li className="list-group-item">
          <UserID />
        </li>
        <li className="list-group-item">
          <UserID />
        </li>
        <li className="list-group-item">
          <UserID />
        </li>
      </ul>
    </>
  );
};

export default FollowerList;
