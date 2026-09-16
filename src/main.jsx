// This is the starting point of our React app.
// It finds the <div id="root"> in index.html and renders our App inside it.

import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"   // Load our global styles (Tailwind)

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
