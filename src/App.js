import React, { Component } from "react";
import firebase from "firebase";
import "./App.css";
import FileUpload from "./FileUpload";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      uploadValue: 0,
      pictures: []
    };
  }

  componentWillMount = async () => {
    try {
      const user = await firebase.auth().onAuthStateChanged(user => {
        this.setState({ user });
      });
      const snapshot = await firebase
      .database()
      .ref("pictures")
      .on("child_added", snapshot => {
        this.setState({
          pictures: this.state.pictures.concat(snapshot.val())
        });
      });
    } catch (err) {
      console.log(err);
    }
  };

  handleAuth = async () => {
    try {
      const provider = await new firebase.auth.GoogleAuthProvider();
      const response = await firebase.auth().signInWithPopup(provider);
      console.log(`Logged as ${response.user.email}`);
    } catch (err) {
      console.log(err);
    }
  };

  handleLogout = async () => {
    try {
      const logout = await firebase
      .auth()
      .signOut()
    } catch (err) {
      console.log(err)
    }
  };

  handleUpload = e => {
    const file = e.target.files[0];
    const storageRef = firebase.storage().ref(`/photos/${file.name}`);
    const task = storageRef.put(file);
    task.on(
      "state_changed",
      snapshot => {
        let percentage = snapshot.bytesTransferred / snapshot.totalBytes * 100;
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
          <button onClick={this.handleLogout}>Logout</button>
          <FileUpload
            onUpload={this.handleUpload}
            onUploadValue={this.state.uploadValue}
          />
          {this.state.pictures
            .map((picture, index) => (
              <div key={index}>
                <img
                  width="320"
                  src={picture.image}
                  alt={picture.displayName}
                />
                <br />
                <img
                  width="100"
                  src={picture.photoURL}
                  alt={picture.displayName}
                />
                <br />
                <span>{picture.displayName}</span>
              </div>
            ))
            .reverse()}
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
