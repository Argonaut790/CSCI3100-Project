import ImportAll from "./ImportAll";
//function needs to be Capital Letter in the first
const Lhs = () => {
  return (
    <>
      <TopLeft />
      <Navbar />
      <User />
    </>
  );
};

const images = ImportAll(
  require.context("../images", false, /\.(png|jpe?g|svg)$/)
);

const TopLeft = () => {
  return (
    <div className="row h3 head d-flex align-items-center" id="top-left">
      <img
        src={images["twittericon.png"]}
        className="mr-1 white-img"
        id="icon"
        alt="icon"
      />
      Rettiwt
    </div>
  );
};

const Navbar = () => {
  return (
    <div className="row d-flex" id="nav">
      <nav className="h4 nav flex-column">
        <a className="nav-link" href="#">
          <img src={images["home.png"]} className="mr-1 white-img" />
          <span>Home</span>
        </a>
        <a className="nav-link" href="#">
          <img src={images["explore.png"]} className="mr-1 white-img" />
          <span>Explore</span>
        </a>
        <a className="nav-link" href="#">
          <img src={images["chat.png"]} className="mr-1 white-img" />
          <span>Chat</span>
        </a>
        <a className="nav-link" href="#">
          <img src={images["user.png"]} className="mr-1 white-img" />
          <span>Profile</span>
        </a>
        <a className="nav-link h5 text-center" id="tweet" href="#">
          Tweet
        </a>
      </nav>
    </div>
  );
};

const User = () => {
  return (
    <div className="row h4 d-flex align-items-md-center" id="user">
      <img
        src={images["avatar.png"]}
        className="rounded float-start white-img"
        id="avatar"
        alt="avatar"
      />
      Username #ID
    </div>
  );
};

export default Lhs;
