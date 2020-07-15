import React, { Component } from "react";
import firebase from "../../firebase";
import { Router, navigate } from "@reach/router";


class PrivateRoutes extends Component {

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        alert('You have to log in to see');
        navigate('/');
      }
    })
  }

  render() { 
    return <>{this.props.children}</>
  }
}
 
export default PrivateRoutes;