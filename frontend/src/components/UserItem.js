import ImportAll from "./ImportAll";
import { useNavigate } from "react-router-dom";

// buttons: object array with buttonOnClick & buttonText
const UserItem = ({ userId, username, userAvatar, buttons }) => {
  const navigate = useNavigate();

  const images = ImportAll(
    require.context("../images", false, /\.(png|jpe?g|svg)$/)
  );

  // show avatar
  let userAvatarFile = null;
  if (userAvatar) {
    userAvatarFile = userAvatar.filename;
  }
  let avatarURL = null;
  if (userAvatarFile) {
    avatarURL = `${process.env.REACT_APP_DEV_API_PATH}/account/profile/avatar/${userAvatarFile}`;
  } else {
    avatarURL = null;
  }

  const HandleImgOnClicked = (userId) => {
    console.log("image clicked");
    navigate("/user?userId=" + userId);
    window.location.reload();
  };

  return (
    <li key={userId} className="list-group-item">
      <div className="d-flex flex-row">
        <div className="d-flex justify-content-center align-items-center w-25">
          <img
            src={avatarURL ? avatarURL : images["avatar.png"]}
            className="float-start post-user-avatar m-0"
            alt="user-avatar"
            style={
              (avatarURL ? {} : { filter: "brightness(0) invert(1)" },
              { cursor: "pointer" })
            }
            onClick={() => HandleImgOnClicked(userId)}
          />
        </div>
        <div className="d-flex align-items-md-center h-100 m-0 ps-2 pe-2 post-user-id w-75">
          <div className="fw-bold">{username}</div>
          <div>#{userId}</div>
          <div className="d-grid gap-2">
            {buttons.map((button) => (
              <button
                type="button"
                key={userId + "-" + button.text}
                className={`btn w-100 ${
                  button.text === "Follow" || button.text === "Accept"
                    ? "btn-success"
                    : button.text === "Reject"
                    ? "btn-danger"
                    : "btn-dark"
                }`}
                onClick={() => button.onClick(userId)}
              >
                {button.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </li>
  );
};

export default UserItem;
