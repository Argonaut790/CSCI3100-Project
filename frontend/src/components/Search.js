import ImportAll from "./ImportAll";
import React, { useState, useEffect } from "react";
import axios from "axios";

//function needs to be Capital Letter in the first
const Search = () => {
  const [searchString, setSearchString] = useState("");
  const [resultItems, setResultItems] = useState([]);

  const onChangeSearchString = (e) => {
    setSearchString(e.target.value);
    console.log(searchString);
  };
  useEffect(() => {
    const fetchResultItems = async () => {
      const res = await axios.get(
        "http://localhost:5500/account/search/" + searchString
      );
      if (!res.error) {
        setResultItems(res.data);
        console.log(resultItems);
      } else {
        console.log(res);
      }
    };
    fetchResultItems().catch(console.error);
  }, [searchString]);

  const SearchResults = () => {
    return (
      <ul>
        {resultItems.map((item) => (
          <li key={item.userId}>{item.username}</li>
        ))}
      </ul>
    );
  };

  const images = ImportAll(
    require.context("../images", false, /\.(png|jpe?g|svg)$/)
  );

  return (
    <div>
      <div className="form-floating" id="search-engine-div">
        <input
          type="text"
          name="searchString"
          className="form-control text-light"
          id="search-engine"
          placeholder="Search Tags"
          value={searchString}
          onChange={onChangeSearchString}
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
        {SearchResults}
      </div>
    </div>
  );
};

export default Search;
