import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import moment from "moment";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

const Admin = () => {
  // Get userId from localStorage
  const localuserId = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).userId
    : "defaultUserId";

  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [userChartData, setUserChartData] = useState([]);
  const [postChartData, setPostChartData] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(
        process.env.REACT_APP_DEV_API_PATH + "/account/"
      );
      if (!res.error) {
        setUsers(res.data);
      } else {
        console.log(res);
      }
    };
    fetchUser().catch(console.error);

    const fetchPost = async () => {
      const res = await axios.get(
        process.env.REACT_APP_DEV_API_PATH + "/tweet/info"
      );
      if (!res.error) {
        setPosts(res.data);
      } else {
        console.log(res);
      }
    };
    fetchPost().catch(console.error);
  }, []);

  useMemo(() => {
    const fetchUserAnalysis = async () => {
      const userData = users.map((user) => moment(user.timestamp)) || null;
      const sortedUserData = userData.sort((a, b) => a.diff(b));
      const userCounts = {};
      sortedUserData.forEach((time) => {
        const day = time.startOf("day").format("MM/DD/YYYY");
        if (!userCounts[day]) {
          userCounts[day] = 1;
        } else {
          userCounts[day]++;
        }
      });
      let cumulativeCount = 0;
      const chartData = [];
      for (let day in userCounts) {
        cumulativeCount += userCounts[day];
        chartData.push({
          day: day,
          userCount: cumulativeCount,
        });
      }
      setUserChartData(chartData);
    };

    fetchUserAnalysis().catch(console.error);

    const fetchPostAnalysis = async () => {
      const postData = posts.map((post) => moment(post.timestamp)) || null;
      const sortedPostData = postData.sort((a, b) => a.diff(b));
      const postCounts = {};
      sortedPostData.forEach((time) => {
        const day = time.startOf("day").format("MM/DD/YYYY");
        if (!postCounts[day]) {
          postCounts[day] = 1;
        } else {
          postCounts[day]++;
        }
      });
      let cumulativeCount = 0;
      const chartData = [];
      for (let day in postCounts) {
        cumulativeCount += postCounts[day];
        chartData.push({
          day: day,
          userCount: cumulativeCount,
        });
      }
      setPostChartData(chartData);
    };

    fetchPostAnalysis().catch(console.error);
  }, [users, posts]);

  const changeUserStatus = async (userId, isActivated) => {
    try {
      const res = await axios.patch(
        process.env.REACT_APP_DEV_API_PATH + "/account/status/" + userId,
        { isActivated: isActivated }
      );
      if (!res.error) {
        window.location.reload();
      } else {
        console.log(res.error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const grantAdmin = async (userId) => {
    try {
      const res = await axios.patch(
        process.env.REACT_APP_DEV_API_PATH + "/account/admin/" + userId
      );
      if (!res.error) {
        window.location.reload();
      } else {
        console.log(res.error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deletePost = async (postId) => {
    try {
      const res = await axios.delete(
        process.env.REACT_APP_DEV_API_PATH + "/tweet/" + postId
      );
      if (!res.error) {
        window.location.reload();
      } else {
        console.log(res.error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteUser = async (userId) => {
    try {
      // follower following comment like dislike retweet post user
      try {
        await axios.delete(
          process.env.REACT_APP_DEV_API_PATH + "/follow/adminDelete/" + userId
        );
      } catch (error) {
        console.error("Error deleting follow data:", error);
        return;
      }

      try {
        await axios.delete(
          process.env.REACT_APP_DEV_API_PATH + "/comment/adminDelete/" + userId
        );
      } catch (error) {
        console.error("Error deleting comment data:", error);
        return;
      }

      try {
        await axios.delete(
          process.env.REACT_APP_DEV_API_PATH + "/like/adminDelete/" + userId
        );
      } catch (error) {
        console.error("Error deleting like data:", error);
        return;
      }

      try {
        await axios.delete(
          process.env.REACT_APP_DEV_API_PATH + "/dislike/adminDelete/" + userId
        );
      } catch (error) {
        console.error("Error deleting dislike data:", error);
        return;
      }

      try {
        await axios.delete(
          process.env.REACT_APP_DEV_API_PATH + "/tweet/adminDelete/" + userId
        );
      } catch (error) {
        console.error("Error deleting tweet data:", error);
        return;
      }

      try {
        await axios.delete(
          process.env.REACT_APP_DEV_API_PATH + "/account/admin/delete/" + userId
        );
      } catch (error) {
        console.error("Error deleting account data:", error);
        return;
      }

      window.location.reload();
    } catch (err) {
      console.error("Error in deleteUser function:", err);
    }
  };

  return (
    <div className="col-lg-9 mask-background text-light">
      <a href="/admin" className="btn btn-dark my-2">
        Reload Data
      </a>
      <h1> Users </h1>
      {users.length === 0 ? (
        <h3>No user created yet</h3>
      ) : (
        <div>
          <p>
            Total Users: <strong>{users.length}</strong>
          </p>
          <table className="table table-hover">
            <thead>
              <tr className="table-dark">
                <th scope="col">UserId</th>
                <th scope="col">Username</th>
                <th scope="col">Email</th>
                <th scope="col">Status</th>
                <th scope="col">Admin?</th>
                <th scope="col">Delete</th>
              </tr>
            </thead>
            <tbody className="mask-background">
              {users.map((user) => (
                <tr key={user.userId} className="text-light">
                  <th scope="row">{user.userId}</th>
                  <th scope="row">{user.username}</th>
                  <td>{user.email}</td>
                  {user.isActivated ? (
                    <td>
                      Active{" "}
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => changeUserStatus(user.userId, false)}
                      >
                        Deactivate
                      </button>
                    </td>
                  ) : (
                    <td>
                      Inactive{" "}
                      <button
                        type="button"
                        className="btn btn-warning"
                        onClick={() => changeUserStatus(user.userId, true)}
                      >
                        Activate
                      </button>
                    </td>
                  )}

                  {user.isAdmin ? (
                    <td> Y </td>
                  ) : (
                    <td>
                      N {"  "}
                      <button
                        type="button"
                        className="btn btn-warning"
                        onClick={() => grantAdmin(user.userId)}
                      >
                        Grant Admin
                      </button>
                    </td>
                  )}
                  <td>
                    {user.userId !== localuserId ? (
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => deleteUser(user.userId)}
                      >
                        Delete
                      </button>
                    ) : (
                      <div></div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <br />
      <br />
      <h1> Posts </h1>
      {posts.length === 0 ? (
        <h3>No posts yet</h3>
      ) : (
        <div>
          <p>
            Total Posts: <strong>{posts.length}</strong>
          </p>
          <table className="postTable table table-hover">
            <thead>
              <tr className="table-dark">
                <th scope="col">PostId</th>
                <th scope="col">Username</th>
                <th scope="col">Description</th>
                <th scope="col">Posted Time</th>
                <th scope="col">Retweet from</th>
                <th scope="col">Delete</th>
              </tr>
            </thead>
            <tbody className="mask-background">
              {posts.map((post) => (
                <tr key={post.postId} className="text-light">
                  <th scope="row">{post.postId}</th>
                  <th scope="row">{post.username}</th>
                  <td>{post.desc}</td>
                  <td>
                    <div>{moment(post.timestamp).format("MMMM Do")}</div>
                    <div>{moment(post.timestamp).format("h:mm a")}</div>
                  </td>
                  <td>{post.retweetId}</td>
                  <td>
                    N {"  "}
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => deletePost(post.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}{" "}
      <br />
      <br />
      <h1> Analysis </h1>
      <div>
        <h5> Cumulative User Register </h5>
        <LineChart width={400} height={400} data={userChartData}>
          <Line type="monotone" dataKey="userCount" stroke="white" />
          <YAxis stroke="white" />
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" stroke="white" />
        </LineChart>
      </div>
      <br /> <br />
      <div>
        <h5> Cumulative Tweet </h5>
        <LineChart width={400} height={400} data={postChartData}>
          <Line type="monotone" dataKey="userCount" stroke="white" />
          <YAxis stroke="white" />
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" stroke="white" />
        </LineChart>
      </div>
      <br /> <br /> <br /> <br /> <br /> <br /> <br />
    </div>
  );
};

export default Admin;
