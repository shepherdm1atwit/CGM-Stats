import React from "react";
import ReactDOM from "react-dom";
import "bulma/css/bulma.min.css";
import App from "./App";
import {BrowserRouter} from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
    <BrowserRouter>
        <UserProvider>
            <App />
        </UserProvider>
    </BrowserRouter>,

  document.getElementById("root")
);
