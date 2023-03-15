import FetchPost from "./FetchPost";
//function needs to be Capital Letter in the first

const ProfileContent = () => {
  return (
    <>
      <TopMid />
      <Content />
    </>
  );
};

const TopMid = () => {
  return (
    <div className="container-fluid top-p-1" id="top-mid">
      <div className="row">
        <div className="h3 head d-flex">💩 Profile</div>
      </div>
    </div>
  );
};

const Content = () => {
  return (
    <div className="container-fluid p-0" id="mid-center">
      <FetchPost />
    </div>
  );
};

export default ProfileContent;
