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
    <div class="row h3 head d-flex align-items-center" id="top-left">
      <img
        src={images["twittericon.png"]}
        class="mr-1 white-img"
        id="icon"
        alt="icon"
      />
      Rettiwt
    </div>
  );
};

const Navbar = () => {
  return (
    <div class="row d-flex" id="nav">
      <nav class="h4 nav flex-column">
        <a class="nav-link" href="#">
          <img src={images["home.png"]} class="mr-1 white-img" />
          Home
        </a>
        <a class="nav-link" href="#">
          <img src={images["explore.png"]} class="mr-1 white-img" />
          Explore
        </a>
        <a class="nav-link" href="#">
          <img src={images["chat.png"]} class="mr-1 white-img" />
          Chat
        </a>
        <a class="nav-link" href="#">
          <img src={images["user.png"]} class="mr-1 white-img" />
          Profile
        </a>
        <a class="nav-link h5 text-center" id="tweet" href="#">
          Tweet
        </a>
      </nav>
    </div>
  );
};

const User = () => {
  return (
    <div class="row h4 d-flex align-items-md-center" id="user">
      <img
        src={images["avatar.png"]}
        class="rounded float-start white-img"
        id="avatar"
        alt="avatar"
      />
      Username #ID
    </div>
  );
};

export default Lhs;
