import FetchPost from "./FetchPost";
import { useNotification } from "../NotificationContext";
//function needs to be Capital Letter in the first
import { useEffect } from "react";
import axios from "axios";
import ImportAll from "./ImportAll";

const images = ImportAll(
  require.context("../images", false, /\.(png|jpe?g|svg)$/)
);

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
  const { showNotification } = useNotification();
  return (
    <div className="container-fluid p-0" id="mid-center">
      <FetchPost profile={false} maskBackgroundRef={maskBackgroundRef} showNotification={showNotification}/>
    </div>
  );
};

export default HomeContent;
