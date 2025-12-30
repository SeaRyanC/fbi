import { h, render } from "preact";
import { App } from "./App.js";

// Render the app
render(h(App, null), document.getElementById("app")!);
