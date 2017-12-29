import React, { Component } from "react";
import firebase from "firebase";
import "./App.css";
import FileUpload from "./FileUpload";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      pictures: []
    };
  }

  componentWillMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ user });
    });
    firebase
      .database()
      .ref("pictures")
      .on("child_added", snapshot => {
        this.setState({
          pictures: this.state.pictures.concat(snapshot.val())
        });
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
      .then(res => console.log(`Bye...!`))
      .catch(err => console.log(`Error ${err.code}: ${err.message}`));
  };

  handleUpload = e => {
    const file = e.target.files[0];
    const storageRef = firebase.storage().ref(`/photos/${file.name}`);
    const task = storageRef.put(file);
    task.on(
      "state_changed",
      snapshot => {
        let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.setState({
          uploadValue: percentage
        });
      },
      err => {
        console.log(err.message);
      },
      () => {
        const record = {
          photoURL: this.state.user.photoURL,
          displayName: this.state.user.displayName,
          image: task.snapshot.downloadURL
        };
        const dbRef = firebase.database().ref("pictures");
        const newPicture = dbRef.push();
        newPicture.set(record);
      }
    );
  };

  renderLoginButton = () => {
    if (this.state.user) {
      return (
        <div>
          <img
            width="100"
            src={this.state.user.photoURL}
            alt={this.state.user.displayName}
          />
          <p>Hola {this.state.user.displayName}!</p>
          <button onClick={this.hanndleLogout}>Logout</button>
          <FileUpload onUpload={this.handleUpload} />
          {this.state.pictures.map(picture => (
            <div>
              <img width="320" src={picture.image} />
              <br />
              <img width="100" src={picture.photoURL} alt={picture.displayName} />
              <br />
              <span>{picture.displayName}</span>
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <button type="button" onClick={this.handleAuth}>
          Login with Google
        </button>
      );
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
