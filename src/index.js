import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import Lhs from "./components/Lhs";
import Middle from "./components/Middle";
import Rhs from "./components/Rhs";

const leftPart = ReactDOM.createRoot(document.getElementById("lhs"));
const middlePart = ReactDOM.createRoot(document.getElementById("content"));
const rightPart = ReactDOM.createRoot(document.getElementById("rhs"));

leftPart.render(<Lhs />);
middlePart.render(<Middle />);
rightPart.render(<Rhs />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
