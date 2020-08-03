import React, { Component } from 'react';
import { Router } from "@reach/router";
import PrivateRoutes from "../PrivateRoutes";
import OwnBeats from "../OwnBeats";

class Routes extends Component {

  render() { 

    return (
      <>
        <Router>
          <PrivateRoutes path="/" user={this.props.user}>
            <OwnBeats
              path="/yourbeats"
              user={this.props.user}
              storeName={this.props.storeName}
              storePattern={this.props.storePattern}
              userBeats={this.props.userBeats}
              loadLoop={this.props.loadLoop}
              deletePattern={this.props.deletePattern}
            />
          </PrivateRoutes>
        </Router>
      </>
     );
  }
}
 
export default Routes;