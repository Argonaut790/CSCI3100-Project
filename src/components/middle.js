import ImportAll from "./ImportAll";
import Post from "./Post";
//function needs to be Capital Letter in the first

const Middle = () => {
  return (
    <>
      <TopMid />
      <Content />
    </>
  );
};

const images = ImportAll(
  require.context("../images", false, /\.(png|jpe?g|svg)$/)
);

const TopMid = () => {
  return (
    <div className="container-fluid top-p-1" id="top-mid">
      <div className="row">
        <div className="h3 head d-flex">Home</div>
      </div>
      <div className="row">
        <div className="col h4 head text-center" id="you">
          You
        </div>
        <div className="col h4 head text-center" id="">
          Following
        </div>
      </div>
    </div>
  );
};

const Content = () => {
  return (
    <div className="container-fluid p-0" id="mid-center">
      <div className="row d-flex justify-content-center" id="post-list">
        <Post />
        <Post />
        <Post />
        <Post />
      </div>
    </div>
  );
};

export default Middle;
