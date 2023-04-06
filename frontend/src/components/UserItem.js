import ImportAll from "./ImportAll";
import { Link } from "react-router-dom";

// buttons: object array with buttonOnClick & buttonText
const UserItem = ({ userId, username, buttons }) => {
  //TODO: show avatar
  const images = ImportAll(
    require.context("../images", false, /\.(png|jpe?g|svg)$/)
  );
  return (
    <li key={userId} className="list-group-item">
      <div className="post-user-info">
        <Link to={"/user?userId=" + userId}>
          <img
            src={images["user_avatar.jpg"]}
            className="float-start post-user-avatar"
            alt="user-avatar"
          />
        </Link>
        <div className="d-flex align-items-md-center h-100 m-0 post-user-id">
          <div className="fw-bold">{username}</div>
          <div>#{userId}</div>
          {buttons.map((button) => (
            <button
              key={userId + "-" + button.text}
              onClick={() => button.onClick(userId)}
            >
              {button.text}
            </button>
          ))}
        </div>
      </div>
    </li>
  );
};

export default UserItem;
