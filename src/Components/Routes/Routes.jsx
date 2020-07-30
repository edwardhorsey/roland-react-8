import React, { Component } from 'react';
import { Router } from "@reach/router";
import { firestore } from "../../firebase";
import PrivateRoutes from "../PrivateRoutes";
import OwnBeats from "../OwnBeats";

class Routes extends Component {

  render() { 

    return (
      <>
        <Router>
          <PrivateRoutes path="/" user={this.props.user}>
            <OwnBeats path="/yourbeats" user={this.props.user} storeName={this.props.storeName} storePattern={this.props.storePattern} />
          </PrivateRoutes>
        </Router>
      </>
     );
  }
}
 
export default Routes;