import React, { useEffect, useState } from "react";
import axios from "axios";

const Admin = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        process.env.REACT_APP_DEV_API_PATH + "/account/"
      );
      if (!res.error) {
        setUsers(res.data);
      } else {
        console.log(res);
      }
    };
    fetchData().catch(console.error);
  }, []);

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
      console.log(res);
      if (!res.error) {
        window.location.reload();
      } else {
        console.log(res.error);
      }
    } catch (err) {
      console.log(err);
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
            Your Total Users: <strong>{users.length}</strong>
          </p>
          <table className="table table-hover">
            <thead>
              <tr className="table-dark">
                <th scope="col">UserId</th>
                <th scope="col">Username</th>
                <th scope="col">Email</th>
                <th scope="col">Status</th>
                <th scope="col">Admin?</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Admin;
