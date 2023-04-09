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
      <div className="d-flex flex-row">
        <div className="d-flex justify-content-center align-items-center w-25">
          <Link to={"/user?userId=" + userId}>
            <img
              src={images["user_avatar.jpg"]}
              className="float-start post-user-avatar m-0"
              alt="user-avatar"
            />
          </Link>
        </div>
        <div className="d-flex align-items-md-center h-100 m-0 ps-2 pe-2 post-user-id w-75">
          <div className="fw-bold">{username}</div>
          <div>#{userId}</div>
          {buttons.map((button) => (
            <button
              type="button"
              key={userId + "-" + button.text}
              className={`btn w-100 ${
                button.text === "Follow" ? "btn-success" : "btn-dark"
              }`}
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
