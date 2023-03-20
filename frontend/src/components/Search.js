import ImportAll from "./ImportAll";

//function needs to be Capital Letter in the first
const Search = ({ loggedIn: { loggedIn } }) => {
  return (
    <>
      <Searchbar />
      {loggedIn && (
        <ul class="list-group" id="following-div">
          <li class="list-group-item" id="following-label">
            Following
          </li>
          <li class="list-group-item">
            <UserID />
          </li>
          <li class="list-group-item">
            <UserID />
          </li>
          <li class="list-group-item">
            <UserID />
          </li>
          <li class="list-group-item">
            <UserID />
          </li>
          <li class="list-group-item">
            <UserID />
          </li>
          <li class="list-group-item">
            <UserID />
          </li>
        </ul>
      )}
    </>
  );
};

const images = ImportAll(
  require.context("../images", false, /\.(png|jpe?g|svg)$/)
);

const UserID = () => {
  return (
    <div className="post-user-info">
      <img
        src={images["user_avatar.jpg"]}
        className="float-start post-user-avatar"
        alt="user-avatar"
      />
      <div className="d-flex align-items-md-center h-100 m-0 post-user-id">
        <div className="fw-bold">UserName</div>
        <div>#UserID</div>
      </div>
    </div>
  );
};

const Searchbar = () => {
  return (
    <div>
      <div className="form-floating" id="search-engine-div">
        <input
          className="form-control text-light"
          id="search-engine"
          placeholder="Search Tags"
        />
        <label htmlFor="search-engine" className="d-flex align-items-md-center">
          <img
            src={images["search.png"]}
            className="white-img"
            id="search-icon"
            alt=" "
          />
          Search Twitter
        </label>
      </div>
    </div>
  );
};

export default Search;
