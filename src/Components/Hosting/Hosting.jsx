import React, { Component } from 'react';
// import styles from './Hosting.module.scss';
import firebase, { provider } from "../../firebase";
import Button from "../Button";

class Hosting extends Component {
  state = {
    user: null,
  }
  componentDidMount() {
    this.getUser();
  }
  signIn = () => {
    console.log('signin')
    firebase.auth().signInWithRedirect(provider);
  }
    signOut = () => {
    firebase
    .auth()
    .signOut()
    .then(() => {
      this.setState({ user: null });
    })
    .catch((error) => {
      console.log(error);
    });
  }
  getUser = () => firebase.auth().onAuthStateChanged(user => user ? this.setState({ user }) : this.setState({ user: null }))

  render() { 

    // this.getUser();

    const userDetails = this.state.user ? <p>Hello {this.state.user.displayName}</p> : <p>Not signed in</p>;

    return (
      <>
        <p>Hello from hosting</p>
        {userDetails}
        <Button text="Sign in" logic={this.signIn} />
        <Button text="Sign out" logic={this.signOut} />

      {/* <Routes user={this.state.user} /> */}

      </>
    );
  }
}
 
export default Hosting;