import React, { Component } from "react";
import styles from "./OwnBeats.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../data/fa-library';

class OwnBeats extends Component {
 
  state = { iconClass: false, beatName: '', }

  componentDidMount() {
    this.inputRef = React.createRef();
    this.selectRef = React.createRef();
  }

  renderOptions = () => {
    return this.props.userBeats.map((beat, index) => {
      return <option key={index} value={beat.beatID}>{beat.beatID}</option>
    })
  };
   
  loadLoop = (event) => {
    const loop = this.props.userBeats.find(beat => beat.beatID === event.target.value).loop;
    this.props.loadLoop(loop)
  };

  storeName = (event)=>{
    this.setState({ beatName: event.target.value });
    this.inputRef.current.style.boxShadow = 'none';
  }

  saveLoop = () => {
    if (this.state.beatName) {
      let answer = this.props.storePattern(this.state.beatName);
      if (answer) {
        this.setState({ iconClass: true });
        this.inputRef.current.value = '';
      }
    } else {
      this.inputRef.current.style.boxShadow = 'inset 0 0 8px rgba(114, 47, 55, 0.7)';
    }
    setTimeout(() => {this.setState({ iconClass: false })}, 1000);
  };

  deletePattern = () => this.props.deletePattern(this.selectRef.current.value);

  render() {
    return (
        <div className={styles.ownBeats}>
          <div className={styles.selectAndStore}>
            <p>Select a beat to load</p>
            <div className={styles.pick}>
              <select ref={this.selectRef} name="Your loops" onChange={this.loadLoop}>
                {this.renderOptions()}
              </select>
              <span><FontAwesomeIcon onClick={this.deletePattern} icon={["fas", "trash-alt"]} /></span>
            </div>
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