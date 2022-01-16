import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import { Settings } from "./Settings";
import "./style.scss";

Settings.setDarkTheme(Settings.getForceDarkTheme());

ReactDOM.render(
	<App />,
	document.querySelector("app")
);

if ("serviceWorker" in navigator) {
	window.addEventListener("load", () => {
		navigator.serviceWorker.register("./service-worker.js");
	});
}
