import React, { Component } from "react";
import firebase from "firebase";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
  }

  componentWillMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ user });
    });
  };

  handleAuth = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(res => console.log(`Logged as ${res.user.email}`))
      .catch(err => console.log(`Error ${err.code}: ${err.message}`));
  };
  hanndleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(res => console.log(`Bye ${res.user.email}!`))
      .catch(err => console.log(`Error ${err.code}: ${err.message}`));
  };

  renderLoginButton = () => {
    if (this.state.user) {
      return (
        <div>
          <img width="100" src={this.state.user.photoURL} alt={this.state.user.displayName} />
          <p>Hola {this.state.user.displayName}!</p>
          <button onClick={this.hanndleLogout}>Logout</button>
        </div>
      );
    } else {
      return (
        <button type="button" onClick={this.handleAuth}>
          Login with Google
        </button>
      )
    }
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Photo Collection</h1>
        </header>
        <div className="App-intro">{this.renderLoginButton()}</div>
      </div>
    );
  }
}

export default App;
