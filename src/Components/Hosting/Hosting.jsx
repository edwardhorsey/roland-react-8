import firebase, { provider, firestore } from "../../firebase";
import React, { Component } from 'react';
import styles from './Hosting.module.scss';
import Button from "../Button";
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

  storeName = (event)=>{
    console.log(event)
    this.setState({ beatName: event.target.value })
  }

  storePattern = () => {
    let beatName = this.state.beatName;
    console.log(beatName);
    firestore
    .collection('Beats')
    .doc(this.state.user.uid)
    .set({ [beatName]:  { ...this.props.loop } })
    .catch((err) => console.log(err));
  }

  loadLoop = () => {
    // firestore
    //     .collection("recipes")
    //     .get()
    //     .then((querySnapshot) => {
    //         const favourites = querySnapshot.docs
    //             .filter((doc) => doc.data().uid === this.context.user.uid)
    //             .map((doc) => doc.data());
    //         this.setState({ favourites })
    //     })
    //     .catch((err) => console.log(err));
};

  render() { 

    const userDetails = this.state.user ? <p>Hello {this.state.user.displayName}</p> : <p>Not signed in</p>;

    return (
      <>
        {userDetails}

        <Button text={this.state.user? 'Sign out' : 'Sign in'} logic={this.state.user? this.signOut : this.signIn} />
        <Routes user={this.state.user} storeName={this.storeName} storePattern={this.storePattern} />

      </>
    );
  }
}
 
export default Hosting;