import React, { Component, createContext } from 'react';

export const AudioEngine = createContext({});

export class AudioProvider extends Component {

  state = {
    context: '',
    hied: 'hieed',
  }

  render() {
    return <AudioEngine.Provider value={this.state}>{this.props.children}</AudioEngine.Provider>
  }
}