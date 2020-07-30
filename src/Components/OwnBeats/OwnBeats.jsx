import React, { Component } from "react";
import Button from "../Button";
import styles from "./OwnBeats.module.scss"

class OwnBeats extends Component {

  loadPattern = () => {
    console.log('load a pattern');
  }

  storePattern = () => {
    console.log('pattern stored');
  }

  renderOptions = () => {
    console.log('renderoptions')
  }

  render() { 

    return (
      <>
        <section className={styles.ownBeats}>
          <p>Your beats</p>
          <p>Select from here</p>
          <div className={styles.selectAndStore}>
            <select name="" id="">

            </select>
            <Button text="Load"  />
              <input type="text" placeholder="Name your beat" onChange={this.props.storeName}/>
            <Button text="Store" logic={this.props.storePattern} />
          </div>
        </section>
      </>
    );
  }
}
 
export default OwnBeats;