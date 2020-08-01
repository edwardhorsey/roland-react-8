import firebase, { provider, firestore } from "../../firebase";
import React, { Component } from 'react';
import styles from './Hosting.module.scss';
import Button from "../Button";
import Routes from "../Routes";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../data/fa-library';

class Hosting extends Component {
  state = {
    user: null,
    userBeats: [],
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
  
  getBeats = () => {
    firestore
    .collection(this.state.user.uid)
    .get()
    .then((querySnapshot) => {
          const userBeats = querySnapshot.docs.map((doc) => {return { beatID: doc.id, loop: doc.data() }});
          this.setState({ userBeats })
      })
    .catch((err) => console.log(err));
  }
  
  storePattern = (beatName) => {
    let result = true;
    firestore
      .collection(this.state.user.uid)
      .doc(beatName)
      .set( { ...this.props.loop } )
      .catch((err) => {
        console.log(err);
        result = false;
      })
    this.getBeats();
    return result;
  }



  render() {
    const userDetails = this.state.user ? <p>Hello {this.state.user.displayName.split(' ')[0]}</p> : <p>Not signed in</p>;
    const signInIcons = this.state.user ? (
      <FontAwesomeIcon icon={["fas", "sign-out-alt"]} onClick={this.signOut} />
    ) : (
      <FontAwesomeIcon icon={["fas", "sign-in-alt"]} onClick={this.signIn} />
    ) ;
    if (
      this.state.user
      && this.state.user.uid
      && this.state.userBeats.length === 0
    ) {
      this.getBeats();
    }
    return (
      <>
      <div className={styles.hosting}>
        <div className={styles.signInOut}>
            {userDetails}
            <span className={styles.icons}>{signInIcons}</span>
        </div>
        <Routes user={this.state.user} storeName={this.storeName} storePattern={this.storePattern} userBeats={this.state.userBeats} loadLoop={this.props.loadLoop}/>
      </div>
      </>
    );
  }
}
 
export default Hosting;