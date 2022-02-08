import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import store from "./rtk/store";
import { Provider } from "react-redux";
import "antd/dist/antd.css";

console.disableYellowBox = true;
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
