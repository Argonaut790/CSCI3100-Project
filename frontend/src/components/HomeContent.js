import FetchPost from "./FetchPost";
//function needs to be Capital Letter in the first
import { useEffect } from "react";

const HomeContent = ({ maskBackgroundRef }) => {
  return (
    <>
      <TopMid />
      <Content maskBackgroundRef={maskBackgroundRef} />
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

const Content = ({ maskBackgroundRef }) => {
  // useEffect(() => {
  //   console.log("maskBackgroundRef in Content:", maskBackgroundRef);
  // }, [maskBackgroundRef]);

  return (
    <div className="container-fluid p-0" id="mid-center">
      <FetchPost profile={false} maskBackgroundRef={maskBackgroundRef} />
    </div>
  );
};

export default HomeContent;
