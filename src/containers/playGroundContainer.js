import React, { Component } from 'react';
import autoBind from 'react-autobind';
import * as tf from '@tensorflow/tfjs';

class PlayGroundContainer extends Component {
	constructor() {
		super()
    autoBind(this);
	}

	componentDidMount() {
		this.ohhhYep()
	}

	ohhhYep() {
    console.log('ohhhhhh yep!!!');
  }

  render() {
    return (
      <div></div>
    );
  }
}

export default PlayGroundContainer;
