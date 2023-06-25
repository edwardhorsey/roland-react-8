import React, {  useEffect, useRef, useState } from "react";
import styles from "./OwnBeats.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../data/fa-library';
import { api } from "~/utils/api";

export default function OwnBeats(props) {

  const [state, setState]  = useState({ iconClass: false, beatName: '', });

  const data = api.beats.getUserBeats.useQuery();
  console.log(data);

    const inputRef = useRef();
    const selectRef =useRef();


  const renderOptions = () => {
    return props.userBeats.map((beat, index) => {
      return <option key={index} value={beat.beatID}>{beat.beatID}</option>
    })
  };

  const loadLoop = (event) => {
    const loop = props.userBeats.find(beat => beat.beatID === event.target.value).loop;
    props.loadLoop(loop)
  };

  const storeName = (event)=>{
    setState({ beatName: event.target.value });

    const input = inputRef.current;
    if (input) input.style.boxShadow = 'none';
  }

  const saveLoop = () => {
    if (state.beatName) {
      console.log('To store: ', state.beatName, props.loop);

      let answer = true; // props.storePattern(state.beatName);
      if (answer) {
        setState({ iconClass: true });
        inputRef.current.value = '';
      }
    } else {
      inputRef.current.style.boxShadow = 'inset 0 0 8px rgba(114, 47, 55, 0.7)';
    }
    setTimeout(() => {setState({ iconClass: false })}, 1000);
  };

  const deletePattern = () => props.deletePattern(selectRef.current.value);


    return (
        <div className={styles.ownBeats}>
          <div className={styles.selectAndStore}>
            <p>Select a beat to load</p>
            <div className={styles.pick}>
              <select ref={selectRef} name="Your loops" onChange={loadLoop}>
                {renderOptions()}
              </select>
              <span><FontAwesomeIcon onClick={deletePattern} icon={["fas", "trash-alt"]} /></span>
            </div>
            <p>Save your beat</p>
            <div className={styles.store}>
              <input ref={inputRef} type="text" placeholder="Name your beat" required="yes" onChange={storeName}/>
              <span className={state.iconClass ? styles.success : ''}><FontAwesomeIcon onClick={saveLoop} icon={["fas", "save"]} /></span>
            </div>
          </div>
        </div>
    );
  }
