import React, { Component } from "react";
import styles from "./OwnBeats.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../data/fa-library';

class OwnBeats extends Component {
 
  state = { iconClass: false, beatName: '', }

  componentDidMount() {
    this.inputRef = React.createRef();
  }

  renderOptions = () => {
    return this.props.userBeats.map((beat, index) => {
      console.log(beat);
      return <option key={index} value={beat.beatID}>{beat.beatID}</option>
    })
  };
   
  loadLoop = (event) => {
    const loop = this.props.userBeats.find(beat => beat.beatID === event.target.value).loop;
    this.props.loadLoop(loop)
  };

  storeName = (event)=>{
    this.setState({ beatName: event.target.value })
  }

  saveLoop = () => {
      let answer = this.props.storePattern(this.state.beatName);
      if (answer) {
        this.setState({ iconClass: true });
        this.inputRef.current.value = '';
      }
      setTimeout(() => {this.setState({ iconClass: false })}, 1000);
  };

  render() {
    return (
        <div className={styles.ownBeats}>
          <div className={styles.selectAndStore}>
          <p>Select a beat to load</p>
            <select name="Your loops" onChange={this.loadLoop}>
              {this.renderOptions()}
            </select>
            <p>Save your beat</p>
            <div className={styles.store}>
              <input ref={this.inputRef} type="text" placeholder="Name your beat" required="yes" onChange={this.storeName}/>
              <span className={this.state.iconClass ? styles.success : ''}><FontAwesomeIcon onClick={this.saveLoop} icon={["fas", "save"]} /></span>
            </div>
          </div>
        </div>
    );
  }
}
 
export default OwnBeats;