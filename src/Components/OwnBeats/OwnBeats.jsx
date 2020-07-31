import React, { Component } from "react";
import Button from "../Button";
import styles from "./OwnBeats.module.scss"

class OwnBeats extends Component {

  renderOptions = () => {
    return this.props.userBeats.map((beat, index) => {
      console.log(beat);
      return <option key={index} value={beat.beatID}>{beat.beatID}</option>
    })
  }
   
  loadLoop = (event) => {
    console.log('updating loop with ' + event.target.value)
    const loop = this.props.userBeats.find(beat => beat.beatID === event.target.value).loop;
    this.props.loadLoop(loop)
  };

  render() {
    console.log(this.props)
    return (
      <>
        <div className={styles.ownBeats}>
          <p>Select a beat to load</p>
          <div className={styles.selectAndStore}>
            <select name="Your loops" onChange={this.loadLoop}>
              {this.renderOptions()}
            </select>
            <p>Save your beat</p>
            <input type="text" placeholder="Name your beat" onChange={this.props.storeName}/>
            <Button text="Store" logic={this.props.storePattern} />
          </div>
        </div>
      </>
    );
  }
}
 
export default OwnBeats;