import React, { Component } from 'react';
import { Router } from "@reach/router";
import { firestore } from "../../firebase";
import PrivateRoutes from "../PrivateRoutes";

class Routes extends Component {

  render() { 


    return (
      <>
        <Router>
          <PrivateRoutes path="/" user={this.props.user}>
            {/* <OwnBeats path="ownbeats" user={this.props.user}/> */}
          </PrivateRoutes>
        </Router>
        <p>hi from router</p>
      </>
     );
  }
}
 
export default Routes;