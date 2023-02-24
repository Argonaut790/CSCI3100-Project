import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import Lhs from "./components/Lhs";
import Middle from "./components/Middle";
import Rhs from "./components/Rhs";

const reactContentRoot = document.getElementById("root");
const reactContentLHS = document.getElementById("lhs");
const reactContentMiddle = document.getElementById("content");
const reactContentRHS = document.getElementById("rhs");

const leftPart = ReactDOM.createRoot(reactContentLHS);
const middlePart = ReactDOM.createRoot(reactContentMiddle);
const rightPart = ReactDOM.createRoot(reactContentRHS);

leftPart.render(<Lhs />);
middlePart.render(<Middle />);
rightPart.render(<Rhs />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
