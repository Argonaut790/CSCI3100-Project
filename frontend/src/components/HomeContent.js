import FetchPost from "./FetchPost";
//function needs to be Capital Letter in the first

const HomeContent = () => {
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
        <div className="h3 head d-flex">✨ Home</div>
      </div>
    </div>
  );
};

const Content = () => {
  return (
    <div className="container-fluid p-0" id="mid-center">
      <FetchPost profile={false} />
    </div>
  );
};

export default HomeContent;
