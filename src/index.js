import React from "react";
import ReactDOM from "react-dom";
import firebase from "firebase";

import "./index.css";
import App from "./App";

firebase.initializeApp({
  apiKey: "AIzaSyAJgYV72RDo-M74Nez9WAjuA0otUPjKm_A",
  authDomain: "photo-collection-1d4ad.firebaseapp.com",
  databaseURL: "https://photo-collection-1d4ad.firebaseio.com",
  projectId: "photo-collection-1d4ad",
  storageBucket: "photo-collection-1d4ad.appspot.com",
  messagingSenderId: "48864678337"
});

ReactDOM.render(<App />, document.getElementById("root"));
