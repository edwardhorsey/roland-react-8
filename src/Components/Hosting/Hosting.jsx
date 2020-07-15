import React, { Component } from 'react';
// import styles from './Hosting.module.scss';
import firebase, { provider } from "../../firebase";
import Routes from "../Routes";

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
        <button onClick={this.signIn}>Sign in</button>
        <button onClick={this.signOut}>Sign out</button>

      {/* <Routes user={this.state.user} /> */}

      </>
    );
  }
}
 
export default Hosting;