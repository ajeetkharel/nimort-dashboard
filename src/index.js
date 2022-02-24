import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import store from "./rtk/store";
import { Provider } from "react-redux";

console.disableYellowBox = true;
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
