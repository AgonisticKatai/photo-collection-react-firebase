import React, { Component } from "react";
import firebase from "firebase";

class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadValue: 0,
      picture: null
    };
  }

  handleUpload = e => {
    const file = e.target.files[0];
    const storageRef = firebase.storage().ref(`/photos/${file.name}`);
    const task = storageRef.put(file);
    task.on("state_changed", snapshot => {
      let percentage = snapshot.bytesTransferred / snapshot.TotalBytes * 100;
      this.setState({
        uploadValue: percentage
      });
    }, err => {
      console.log(err.message)
    }, () => {
      this.setState({
        uploadValue: 100,
        picture: task.snapshot.downloadURL
      })
    });
  };

  render() {
    return (
      <div>
        <progress value={this.state.uploadValue} max="100" />
        <br />
        <input type="file" onChange={this.handleUpload} />
        <br />
        <img width="320" src={this.state.picture} alt="" />
      </div>
    );
  }
}

export default FileUpload;
